import { createClient } from '@supabase/supabase-js';
import { cleanupMatch } from '$lib/server/discord-api';
// Rimosse le importazioni da $env

// Variabili d'Ambiente: Lettura diretta da process.env
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY;

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

        // 1. Recupera la lista degli utenti da pulire (user_id)
        const { data: rosterData, error: rosterError } = await supabaseAdmin
            .from('tournament_rosters')
            .select('user_id')
            .eq('event_id', eventId);
        
        if (rosterError) {
            console.error('Errore nel recupero del roster per la pulizia:', rosterError);
            throw new Error('Impossibile recuperare il roster finale.');
        }

        // 2. Mappa user_id a discord_id
        const { data: profiles, error: profileError } = await supabaseAdmin
            .from('profili_utenti')
            .select('discord_id')
            .in('utente_id', rosterData.map(p => p.user_id));

        if (profileError) {
            console.error('Errore nel recupero dei profili per la pulizia:', profileError);
            // Non fatale, proviamo a pulire solo il canale
        }

        const discordUserIds = profiles
            .map(p => p.discord_id)
            .filter(id => id != null);
        
        // 3. Interazione con Discord (rimozione ruoli e canale)
        await cleanupMatch(channelId, discordUserIds);

        // 4. Aggiorna lo stato della partita in Supabase
        const { error: updateError } = await supabaseAdmin
            .from('event_tournaments')
            .update({ is_active: false })
            .eq('event_id', eventId);
        
        if (updateError) {
            console.warn('ATTENZIONE: Fallito l\'aggiornamento di is_active:', updateError);
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
