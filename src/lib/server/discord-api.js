// RIMOSSA l'importazione da '$env/...'

// Variabili d'Ambiente: Lettura diretta da process.env (soluzione standard Node.js)
const DISCORD_BOT_TOKEN = process.env.DISCORD_BOT_TOKEN;
const DISCORD_GUILD_ID = process.env.DISCORD_GUILD_ID; 
const DISCORD_CATEGORY_ID = process.env.DISCORD_CATEGORY_ID;
const DISCORD_RED_ROLE_ID = process.env.DISCORD_RED_ROLE_ID;
const DISCORD_BLUE_ROLE_ID = process.env.DISCORD_BLUE_ROLE_ID;
const DISCORD_YELLOW_ROLE_ID = process.env.DISCORD_YELLOW_ROLE_ID;
const DISCORD_BLACK_ROLE_ID = process.env.DISCORD_BLACK_ROLE_ID;


const DISCORD_API = 'https://discord.com/api/v10'; 

// Funzione generica per le richieste API di Discord
async function discordApiRequest(endpoint, options) {
    if (!DISCORD_BOT_TOKEN || !DISCORD_GUILD_ID || !DISCORD_CATEGORY_ID) {
        console.error('Missing Discord environment variables.');
        return { success: false, status: 500, error: 'Configuration error: Discord variables missing' };
    }
    
    const url = `${DISCORD_API}${endpoint}`;
    
    const response = await fetch(url, {
        headers: {
            'Authorization': `Bot ${DISCORD_BOT_TOKEN}`,
            'Content-Type': 'application/json',
        },
        ...options
    });
    
    if (response.ok) {
        // La lettura JSON è necessaria solo se la risposta non è DELETE o 204 No Content
        try {
             return { success: true, status: response.status, data: await response.json() };
        } catch {
             return { success: true, status: response.status, data: null };
        }
    } else {
        const errorText = await response.text();
        console.error(`Discord API Request Failed for ${endpoint}: ${response.status} - ${errorText}`);
        return { success: false, status: response.status, error: errorText };
    }
}

// Funzioni specifiche per Discord
export async function createTemporaryChannel(matchSlug, matchOwnerId) {
    const channelName = matchSlug.toLowerCase().replace(/[^a-z0-9-]/g, '-');
    const endpoint = `/guilds/${DISCORD_GUILD_ID}/channels`;

    const initialPerms = [
        {
            id: DISCORD_GUILD_ID,
            type: 0, // Tipo: Role (@everyone)
            deny: (1 << 10) | (1 << 2), // VIEW_CHANNEL | SEND_MESSAGES
            allow: 0,
        },
        {
            id: matchOwnerId,
            type: 1, // Tipo: Member (Admin che deve vedere il canale subito)
            allow: (1 << 10), // VIEW_CHANNEL
            deny: 0,
        }
    ];

    const response = await discordApiRequest(endpoint, {
        method: 'POST',
        body: JSON.stringify({
            name: channelName,
            type: 0, // Canale di Testo
            parent_id: DISCORD_CATEGORY_ID, 
            permission_overwrites: initialPerms,
        }),
    });

    return { success: response.success, status: response.status, id: response.data?.id };
}

export async function setupChannelAndRoles(channelId, roster) {
    const roleIds = {
        'Rossa': DISCORD_RED_ROLE_ID,
        'Blu': DISCORD_BLUE_ROLE_ID,
        'Gialla': DISCORD_YELLOW_ROLE_ID,
        'Nera': DISCORD_BLACK_ROLE_ID,
    };

    // 1. Assegna i Ruoli Colorati
    const roleAssignmentPromises = roster.flatMap(player => {
        const roleIdToAssign = roleIds[player.team_name];
        if (!roleIdToAssign) return [];
        
        const endpoint = `/guilds/${DISCORD_GUILD_ID}/members/${player.discord_id}/roles/${roleIdToAssign}`;

        return [discordApiRequest(endpoint, { method: 'PUT' })];
    });

    await Promise.allSettled(roleAssignmentPromises);
    

    // 2. Sblocca il Canale per i 4 Ruoli Squadra (Permessi)
    const rolesToUnlock = Object.values(roleIds);
    const unlockPromises = rolesToUnlock.map(roleId => {
        const endpoint = `/channels/${channelId}/permissions/${roleId}`;
        const allowPermissions = (1 << 10) | (1 << 2); // VIEW_CHANNEL | SEND_MESSAGES

        return discordApiRequest(endpoint, {
            method: 'PUT',
            body: JSON.stringify({
                id: roleId,
                type: 0, // Tipo: Role
                allow: allowPermissions,
                deny: 0,
            }),
        });
    });

    await Promise.allSettled(unlockPromises);
}


export async function cleanupMatch(channelId, discordUserIds) {
    const roleIdsToRemove = [
        DISCORD_RED_ROLE_ID,
        DISCORD_BLUE_ROLE_ID,
        DISCORD_YELLOW_ROLE_ID,
        DISCORD_BLACK_ROLE_ID,
    ];

    // 1. Rimuovi tutti i 4 ruoli di squadra da ogni utente
    const removalPromises = discordUserIds.flatMap(userId => 
        roleIdsToRemove.map(roleId => {
            const endpoint = `/guilds/${DISCORD_GUILD_ID}/members/${userId}/roles/${roleId}`;

            return discordApiRequest(endpoint, { method: 'DELETE' });
        })
    );

    await Promise.allSettled(removalPromises);

    // 2. Elimina il Canale di Testo
    const deleteEndpoint = `/channels/${channelId}`;
    await discordApiRequest(deleteEndpoint, { method: 'DELETE' });
}
