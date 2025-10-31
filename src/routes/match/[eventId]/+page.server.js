// src/routes/match/[eventId]/+page.server.js
import { error } from '@sveltejs/kit';
// import { createClient } from '@supabase/supabase-js'; // Importa il tuo client Supabase (anon key)

export async function load({ params, locals }) {
    const eventId = params.eventId;
    // const supabase = locals.supabase; // Usa il client iniettato dalle tue locals

    // --- SIMULAZIONE DATI (RIMUOVI PER LA TUA VERA LOGICA SUPABASE) ---
    const MOCK_ROSTER = [
        { user_id: 'a1b2c3d4...', discord_id: '12345...', team_name: 'Rossa' },
        { user_id: 'e5f6g7h8...', discord_id: '67890...', team_name: 'Blu' },
        { user_id: 'i9j0k1l2...', discord_id: '11223...', team_name: 'Gialla' },
        { user_id: 'm3n4o5p6...', discord_id: '44556...', team_name: 'Nera' },
    ];
    const MOCK_IS_OWNER = true; // Simula che tu sia l'owner
    // --- FINE SIMULAZIONE ---
    
    // LOGICA VERA:
    /*
    const { data: roster, error: rosterError } = await supabase
        .from('tournament_rosters')
        .select('user_id, team_name, profili_utenti(discord_id)') // Assumendo una join
        .eq('event_id', eventId);
        
    // Verifica se l'utente loggato (locals.user.id) è l'owner dell'evento
    const isOwner = locals.user?.id === event.owner_id;
    */

    if (!MOCK_ROSTER || MOCK_ROSTER.length === 0) {
        throw error(404, 'Partita non trovata o roster vuoto.');
    }

    return {
        eventId: eventId,
        roster: MOCK_ROSTER,
        isMatchOwner: MOCK_IS_OWNER
    };
}
