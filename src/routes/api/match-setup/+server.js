import { json } from '@sveltejs/kit';
import { createClient } from '@supabase/supabase-js';
import { createMatchChannel, assignRoles } from '$lib/server/discord-api.js';
import * as env from '$env/dynamic/private'; // Manteniamo * as env


// Variabili d'Ambiente: Non usare '??' qui
const SUPABASE_URL = env.SUPABASE_URL;
const SUPABASE_SERVICE_KEY = env.SUPABASE_SERVICE_KEY;


if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
    console.error('Missing Supabase environment variables.');
    // In un ambiente di produzione, potresti voler lanciare un errore
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);


export async function POST({ request }) {
    try {
        const { channelName, redPlayer, bluePlayer, yellowPlayer, blackPlayer } = await request.json();

        if (!channelName || !redPlayer || !bluePlayer || !yellowPlayer || !blackPlayer) {
            return json({ success: false, error: 'Missing required match data' }, { status: 400 });
        }

        // 1. Crea il canale Discord
        const channelResponse = await createMatchChannel(channelName);

        if (!channelResponse.success || !channelResponse.data.id) {
            return json({ success: false, error: 'Failed to create Discord channel' }, { status: channelResponse.status || 500 });
        }

        const discordChannelId = channelResponse.data.id;

        // 2. Assegna i ruoli
        await assignRoles(redPlayer.discordId, true, false, false, false);
        await assignRoles(bluePlayer.discordId, false, true, false, false);
        await assignRoles(yellowPlayer.discordId, false, false, true, false);
        await assignRoles(blackPlayer.discordId, false, false, false, true);
        // Nota: la funzione assignRoles deve essere migliorata per supportare più assegnazioni in una singola richiesta se possibile,
        // ma per ora l'approccio sequenziale va bene.

        // 3. Inserisci i dati della partita su Supabase
        const { data, error } = await supabase
            .from('Matches')
            .insert([
                { 
                    channel_id: discordChannelId, 
                    channel_name: channelName,
                    red_player_id: redPlayer.id,
                    blue_player_id: bluePlayer.id,
                    yellow_player_id: yellowPlayer.id,
                    black_player_id: blackPlayer.id
                },
            ])
            .select();

        if (error) {
            console.error('Supabase insert error:', error);
            // In caso di errore Supabase, dovremmo cercare di pulire il canale Discord
            await deleteMatchChannel(discordChannelId);
            return json({ success: false, error: 'Database insertion failed' }, { status: 500 });
        }

        return json({ success: true, match: data[0] });

    } catch (e) {
        console.error('Setup error:', e);
        return json({ success: false, error: 'Internal server error during match setup' }, { status: 500 });
    }
}
