import * as env from '$env/dynamic/private';

// =================================================================
// Variabili d'Ambiente con Fallback (Risolve l'errore di build)
// =================================================================
const DISCORD_BOT_TOKEN = env.DISCORD_BOT_TOKEN ?? 'MISSING_TOKEN';
const DISCORD_GUILD_ID = env.DISCORD_GUILD_ID ?? '0'; 
const DISCORD_CATEGORY_ID = env.DISCORD_CATEGORY_ID ?? '0';
const DISCORD_RED_ROLE_ID = env.DISCORD_RED_ROLE_ID ?? '0';
const DISCORD_BLUE_ROLE_ID = env.DISCORD_BLUE_ROLE_ID ?? '0';
const DISCORD_YELLOW_ROLE_ID = env.DISCORD_YELLOW_ROLE_ID ?? '0';
const DISCORD_BLACK_ROLE_ID = env.DISCORD_BLACK_ROLE_ID ?? '0';


const DISCORD_API = 'https://discord.com/api/v10';

// =================================================================
// FUNZIONE 1: CREAZIONE CANALE
// =================================================================
export async function createTemporaryChannel(matchSlug, matchOwnerId) {
    const channelName = matchSlug.toLowerCase().replace(/[^a-z0-9-]/g, '-');
    const endpoint = `${DISCORD_API}/guilds/${DISCORD_GUILD_ID}/channels`;

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

    const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Authorization': `Bot ${DISCORD_BOT_TOKEN}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({
            name: channelName,
            type: 0, // Canale di Testo
            parent_id: DISCORD_CATEGORY_ID, 
            permission_overwrites: initialPerms,
        }),
    });

    if (!response.ok) {
        const errorData = await response.json();
        console.error('ERRORE DISCORD API (Creazione Canale):', errorData);
        throw new Error(`Impossibile creare il canale Discord: ${response.status}`);
    }

    const data = await response.json();
    return data.id; 
}


// =================================================================
// FUNZIONE 2: ASSEGNAZIONE RUOLI E SBLOCCO CANALE
// =================================================================
export async function setupChannelAndRoles(channelId, roster) {
    const roleIds = {
        'Rossa': DISCORD_RED_ROLE_ID,
        'Blu': DISCORD_BLUE_ROLE_ID,
        'Gialla': DISCORD_YELLOW_ROLE_ID,
        'Nera': DISCORD_BLACK_ROLE_ID,
    };

    // 1. Assegna i Ruoli Colorati (DELETE/PUT di ruolo)
    const roleAssignmentPromises = roster.map(player => {
        const roleIdToAssign = roleIds[player.team_name];
        if (!roleIdToAssign) return Promise.resolve();
        
        const endpoint = `${DISCORD_API}/guilds/${DISCORD_GUILD_ID}/members/${player.discord_id}/roles/${roleIdToAssign}`;

        return fetch(endpoint, {
            method: 'PUT',
            headers: { 'Authorization': `Bot ${DISCORD_BOT_TOKEN}` },
        });
    });

    await Promise.allSettled(roleAssignmentPromises);
    

    // 2. Sblocca il Canale per i 4 Ruoli Squadra (Permessi)
    const rolesToUnlock = Object.values(roleIds);
    const unlockPromises = rolesToUnlock.map(roleId => {
        const endpoint = `${DISCORD_API}/channels/${channelId}/permissions/${roleId}`;
        const allowPermissions = (1 << 10) | (1 << 2); // VIEW_CHANNEL | SEND_MESSAGES

        return fetch(endpoint, {
            method: 'PUT',
            headers: { 'Authorization': `Bot ${DISCORD_BOT_TOKEN}`, 'Content-Type': 'application/json' },
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


// =================================================================
// FUNZIONE 3: RIMOZIONE RUOLI E CANALE
// =================================================================
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
            const endpoint = `${DISCORD_API}/guilds/${DISCORD_GUILD_ID}/members/${userId}/roles/${roleId}`;

            return fetch(endpoint, {
                method: 'DELETE',
                headers: { 'Authorization': `Bot ${DISCORD_BOT_TOKEN}` },
            });
        })
    );

    await Promise.allSettled(removalPromises);

    // 2. Elimina il Canale di Testo
    const deleteEndpoint = `${DISCORD_API}/channels/${channelId}`;
    await fetch(deleteEndpoint, {
        method: 'DELETE',
        headers: { 'Authorization': `Bot ${DISCORD_BOT_TOKEN}` },
    });
}
