import { 
    DISCORD_BOT_TOKEN, 
    DISCORD_GUILD_ID, 
    DISCORD_CATEGORY_ID,
    DISCORD_RED_ROLE_ID,
    DISCORD_BLUE_ROLE_ID,
    DISCORD_YELLOW_ROLE_ID,
    DISCORD_BLACK_ROLE_ID 
} from '$env/dynamic/private'; 

const DISCORD_API = 'https://discord.com/api/v10';

// =================================================================
// FUNZIONE 1: CREAZIONE CANALE
// =================================================================

/**
 * Crea un canale di testo temporaneo sotto la categoria specificata, nascondendolo a @everyone.
 * @param {string} matchSlug - Nome unico del canale (es: "partita-martedi-2000")
 * @param {string} matchOwnerId - L'ID Discord dell'utente che ha creato l'evento
 * @returns {Promise<string>} L'ID del canale appena creato
 */
export async function createTemporaryChannel(matchSlug, matchOwnerId) {
    const channelName = matchSlug.toLowerCase().replace(/[^a-z0-9-]/g, '-');
    const endpoint = `${DISCORD_API}/guilds/${DISCORD_GUILD_ID}/channels`;

    // Permessi iniziali: @everyone non può vedere (deny: 1 << 10), l'admin può
    const initialPerms = [
        {
            id: DISCORD_GUILD_ID,
            type: 0, // Tipo: Role (@everyone)
            deny: (1 << 10) | (1 << 2), // VIEW_CHANNEL | SEND_MESSAGES
            allow: 0,
        },
        {
            id: matchOwnerId,
            type: 1, // Tipo: Member (Admin)
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

/**
 * Assegna i ruoli di squadra ai membri e aggiorna i permessi del canale.
 * @param {string} channelId - L'ID del canale appena creato.
 * @param {Array<{discord_id: string, team_name: string}>} roster - La lista dei giocatori e delle loro squadre.
 */
export async function setupChannelAndRoles(channelId, roster) {
    const roleIds = {
        'Rossa': DISCORD_RED_ROLE_ID,
        'Blu': DISCORD_BLUE_ROLE_ID,
        'Gialla': DISCORD_YELLOW_ROLE_ID,
        'Nera': DISCORD_BLACK_ROLE_ID,
    };

    // 1. Assegna i Ruoli Colorati
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
    console.log(`Tentativo di assegnazione ruoli completato per ${roster.length} giocatori.`);


    // 2. Sblocca il Canale per i 4 Ruoli Squadra
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
    console.log(`Canale ${channelId} sbloccato per i ruoli squadra.`);
}
