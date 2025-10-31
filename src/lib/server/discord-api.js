import * as env from '$env/dynamic/private';

// Variabili d'Ambiente: Non usare '??' qui per evitare l'errore di build
const DISCORD_BOT_TOKEN = env.DISCORD_BOT_TOKEN;
const DISCORD_GUILD_ID = env.DISCORD_GUILD_ID; 
const DISCORD_CATEGORY_ID = env.DISCORD_CATEGORY_ID;
const DISCORD_RED_ROLE_ID = env.DISCORD_RED_ROLE_ID;
const DISCORD_BLUE_ROLE_ID = env.DISCORD_BLUE_ROLE_ID;
const DISCORD_YELLOW_ROLE_ID = env.DISCORD_YELLOW_ROLE_ID;
const DISCORD_BLACK_ROLE_ID = env.DISCORD_BLACK_ROLE_ID;


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
        return { success: true, status: response.status, data: await response.json() };
    } else {
        const errorText = await response.text();
        console.error(`Discord API Request Failed for ${endpoint}: ${response.status} - ${errorText}`);
        return { success: false, status: response.status, error: errorText };
    }
}

// Funzioni specifiche per Discord
export async function createMatchChannel(channelName) {
    const endpoint = `/guilds/${DISCORD_GUILD_ID}/channels`;
    return discordApiRequest(endpoint, {
        method: 'POST',
        body: JSON.stringify({
            name: channelName,
            type: 0, // Text channel
            parent_id: DISCORD_CATEGORY_ID,
        }),
    });
}

export async function deleteMatchChannel(channelId) {
    const endpoint = `/channels/${channelId}`;
    return discordApiRequest(endpoint, {
        method: 'DELETE',
    });
}

export async function assignRoles(userId, red, blue, yellow, black) {
    const rolesToAssign = [];
    if (red) rolesToAssign.push(DISCORD_RED_ROLE_ID);
    if (blue) rolesToAssign.push(DISCORD_BLUE_ROLE_ID);
    if (yellow) rolesToAssign.push(DISCORD_YELLOW_ROLE_ID);
    if (black) rolesToAssign.push(DISCORD_BLACK_ROLE_ID);

    for (const roleId of rolesToAssign) {
        const endpoint = `/guilds/${DISCORD_GUILD_ID}/members/${userId}/roles/${roleId}`;
        const response = await discordApiRequest(endpoint, {
            method: 'PUT',
        });
        if (!response.success) {
            console.error(`Failed to assign role ${roleId} to user ${userId}`);
        }
    }
}

export async function unassignRoles(userId) {
    const rolesToRemove = [
        DISCORD_RED_ROLE_ID,
        DISCORD_BLUE_ROLE_ID,
        DISCORD_YELLOW_ROLE_ID,
        DISCORD_BLACK_ROLE_ID
    ];

    for (const roleId of rolesToRemove) {
        const endpoint = `/guilds/${DISCORD_GUILD_ID}/members/${userId}/roles/${roleId}`;
        const response = await discordApiRequest(endpoint, {
            method: 'DELETE',
        });
        if (!response.success) {
            // Questo errore è atteso se l'utente non aveva il ruolo, quindi lo logghiamo solo a livello di debug
            // console.debug(`Failed to remove role ${roleId} from user ${userId} (role not present?)`);
        }
    }
}
