import { json } from '@sveltejs/kit';
import { createClient } from '@supabase/supabase-js';
import { deleteMatchChannel, unassignRoles } from '$lib/server/discord-api.js';
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
        const { matchId } = await request.json();

        if (!matchId) {
            return json({ success: false, error: 'Missing required match ID' }, { status: 400 });
        }

        // 1. Recupera i dati della partita da Supabase
        const { data: matchData, error: fetchError } = await supabase
            .from('Matches')
            .select('channel_id, red_player_id, blue_player_id, yellow_player_id, black_player_id, red_score, blue_score, winner_id')
            .eq('id', matchId)
            .single();

        if (fetchError || !matchData) {
            console.error('Supabase fetch error:', fetchError);
            return json({ success: false, error: 'Match not found or database error' }, { status: 404 });
        }

        const { channel_id, red_player_id, blue_player_id, yellow_player_id, black_player_id } = matchData;

        // 2. Recupera gli ID Discord degli utenti
        const playerIds = [red_player_id, blue_player_id, yellow_player_id, black_player_id];

        const { data: userData, error: userError } = await supabase
            .from('Players')
            .select('id, discord_id')
            .in('id', playerIds);

        if (userError || !userData) {
            console.error('Supabase players fetch error:', userError);
            return json({ success: false, error: 'Failed to fetch player data' }, { status: 500 });
        }

        const discordIdsMap = userData.reduce((acc, player) => {
            acc[player.id] = player.discord_id;
            return acc;
        }, {});


        // 3. Rimuovi i ruoli Discord
        const cleanupPromises = [];
        
        if (discordIdsMap[red_player_id]) cleanupPromises.push(unassignRoles(discordIdsMap[red_player_id]));
        if (discordIdsMap[blue_player_id]) cleanupPromises.push(unassignRoles(discordIdsMap[blue_player_id]));
        if (discordIdsMap[yellow_player_id]) cleanupPromises.push(unassignRoles(discordIdsMap[yellow_player_id]));
        if (discordIdsMap[black_player_id]) cleanupPromises.push(unassignRoles(discordIdsMap[black_player_id]));

        await Promise.all(cleanupPromises);
        

        // 4. Elimina il canale Discord
        if (channel_id) {
            const deleteResponse = await deleteMatchChannel(channel_id);
            if (!deleteResponse.success) {
                 // Non consideriamo il fallimento dell'eliminazione del canale come un errore fatale per il cleanup generale,
                 // ma lo logghiamo.
                console.warn(`Failed to delete Discord channel ${channel_id}`);
            }
        }
        
        // 5. Aggiorna lo stato della partita su Supabase (se non è già stato fatto)
        // Se la partita è finita con successo, si presume che i punteggi siano già stati salvati.
        // Qui potremmo solo segnare la partita come chiusa.
        // Se si passa il risultato in questa chiamata, allora si deve aggiornare il record:
        const { error: updateError } = await supabase
            .from('Matches')
            .update({ status: 'closed' }) // Aggiungi una colonna 'status' alla tua tabella
            .eq('id', matchId);

        if (updateError) {
            console.error('Supabase update status error:', updateError);
            // Non fatale per il cleanup, ma da notare
        }
        
        
        return json({ success: true, message: `Cleanup complete for match ${matchId}` });

    } catch (e) {
        console.error('Cleanup error:', e);
        return json({ success: false, error: 'Internal server error during match cleanup' }, { status: 500 });
    }
}
