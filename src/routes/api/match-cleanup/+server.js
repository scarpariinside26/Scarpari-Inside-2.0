import { SUPABASE_URL, SUPABASE_SERVICE_KEY } from '$env/dynamic/private';
import { createClient } from '@supabase/supabase-js';
import { cleanupMatch } from '$lib/server/discord-api';

const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY, {
    auth: {
        autoRefreshToken: false,
        persistSession: false,
    },
});

export async function POST({ request }) {
    try {
        const { channelId, eventId } = await request.json(); 

        if (!channelId || !eventId) {
            return new Response(JSON.stringify({ error: 'Missing channelId or eventId' }), { status: 400 });
        }

        // 1. Recupera la lista degli utenti da pulire
        const { data: rosterData, error: rosterError } = await supabaseAdmin
            .from('tournament_rosters')
            .select('user_id')
            .eq('event_id', eventId);
        
        if (rosterError) {
            console.error('Errore nel recupero del roster per la pulizia:', rosterError);
            throw new Error('Impossibile recuperare il roster finale.');
        }

        const discordUserIds = rosterData.map(p => p.user_id);
        
        // 2. Interazione con Discord (rimozione ruoli e canale)
        await cleanupMatch(channelId, discordUserIds);

        // 3. Aggiorna lo stato della partita in Supabase
        const { error: updateError } = await supabaseAdmin
            .from('event_tournaments')
            .update({ is_active: false })
            .eq('event_id', eventId);
        
        if (updateError) {
            console.warn('ATTENZIONE: Fallito l\'aggiornamento di is_active:', updateError);
            // Non blocchiamo la risposta, perché la pulizia di Discord è più importante.
        }
        
        return new Response(JSON.stringify({ 
            message: 'Pulizia post-partita completata con successo.',
            channel_deleted: channelId
        }), { 
            status: 200, 
            headers: { 'Content-Type': 'application/json' }
        });

    } catch (error) {
        console.error('Errore durante la pulizia post-partita:', error);
        return new Response(JSON.stringify({ 
            error: 'Errore interno del server durante la pulizia.',
            detail: error.message 
        }), { 
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
}
