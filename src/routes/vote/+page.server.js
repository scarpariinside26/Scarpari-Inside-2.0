// src/routes/vote/+page.server.js - VERSIONE FINALE CON LOAD E ACTIONS
import { redirect, fail } from '@sveltejs/kit';
import { supabase } from '$lib/supabase'; // Assumiamo che tu abbia un client Supabase riutilizzabile qui

/** @type {import('./$types').PageServerLoad} */
export async function load({ locals }) {
    const supabase = locals.supabase;
    const session = await locals.getSession();
    
    // Se l'utente non è loggato, non può votare
    if (!session) {
        throw redirect(303, '/login'); 
    }

    // --- 1. Trova l'Evento Live Più Recente ---
    const { data: latestEvent } = await supabase
        .from('eventi')
        .select('id, data, titolo')
        .order('data', { ascending: false })
        .limit(1)
        .maybeSingle();

    if (!latestEvent) {
        return { liveEvent: null, teams: [] };
    }

    const liveEventId = latestEvent.id;

    // --- 2. Carica Roster per l'Evento Live ---
    const { data: rosterData } = await supabase
        .from('tournament_rosters')
        .select(`
            team_name,
            profili_utenti!user_id (
                id, nome_completo, user_id, // user_id è FONDAMENTALE per voti_partita
                portiere, difensore, centrocampista, attaccante 
            )
        `)
        .eq('event_id', liveEventId);

    // --- 3. Carica i Voti già espressi dall'utente loggato per questo evento ---
    const { data: userVotes } = await supabase
        .from('voti_partita')
        .select('voted_user_id, punteggio')
        .eq('event_id', liveEventId)
        .eq('voter_user_id', session.user.id);

    const userVotesMap = new Map(userVotes?.map(v => [v.voted_user_id, v.punteggio]) || []);


    // --- 4. Riorganizza i dati in formato Teams Array ---
    const teamsMap = new Map();
    const teamColors = {
        'Team Rosso': '#FF4136',
        'Team Blu': '#0074D9',
        'Team Verde': '#2ECC40',
        'Team Giallo': '#FFDC00',
    };

    if (rosterData) {
        rosterData.forEach(item => {
            const teamName = item.team_name;
            const player = item.profili_utenti;
            
            // Inizializza il voto a 0.0 (non votato) o al voto già espresso
            const initialVote = userVotesMap.get(player.user_id) || 0.0;

            if (!teamsMap.has(teamName)) {
                teamsMap.set(teamName, {
                    id: teamName, 
                    name: teamName,
                    color: teamColors[teamName] || '#AAAAAA',
                    players: []
                });
            }

            teamsMap.get(teamName).players.push({
                name: player.nome_completo,
                profile_id: player.id,    // profili_utenti.id
                user_id: player.user_id, // auth.users.id (CRUCIALE per inserimento voto)
                vote: initialVote,
                isVotable: player.user_id !== session.user.id // L'utente non può votare se stesso
            });
        });
    }
    
    // --- 5. Dati per la cronologia (risultati precedenti) ---
    // Logica semplificata: carica le ultime 3 partite completate (non l'evento live)
    const { data: previousMatches } = await supabase
         .from('tournament_matches') // Carichiamo solo i match del torneo per coerenza
         .select('*')
         .order('match_number', { ascending: false })
         .limit(3);
        
    return {
        liveEvent: latestEvent,
        teams: Array.from(teamsMap.values()),
        previousMatches: previousMatches || []
    };
}


/** @type {import('./$types').Actions} */
export const actions = {
    // ... (La funzione submitVotes rimane invariata rispetto al messaggio precedente) ...
    submitVotes: async ({ request, locals }) => {
        const supabase = locals.supabase;
        const session = await locals.getSession();
        
        if (!session) {
            throw redirect(303, '/login'); 
        }

        const formData = await request.formData();
        const eventId = formData.get('event_id');
        const voterUserId = session.user.id;
        
        const rawVotes = JSON.parse(formData.get('votes')); 
        
        // Mappa i dati nel formato esatto della tabella voti_partita
        const votesToInsert = rawVotes.map(vote => ({
            event_id: eventId,
            voter_user_id: voterUserId,
            voted_user_id: vote.user_id,
            punteggio: vote.score,
        }));
        
        const invalidVotes = votesToInsert.filter(v => v.punteggio < 4.0 || v.punteggio > 10.0);
        if (invalidVotes.length > 0) {
             return fail(400, { error: 'Voti non validi inviati.' });
        }

        const { error } = await supabase
            .from('voti_partita') 
            .upsert(votesToInsert, { 
                onConflict: ['event_id', 'voter_user_id', 'voted_user_id'],
                ignoreDuplicates: false
            });

        // --- GESTIONE LOG E NOTIFICHE DI TEST ---
        if (error) {
            console.error("Errore inserimento voti in voti_partita:", error);
            console.log(`[TEST EMAIL ALERT] ERRORE VOTO su ${voterUserId}: ${error.message}. Notifica inviata a scarpariinside@gmail.com.`);
            return fail(500, { error: 'Errore durante il salvataggio dei voti.' });
        }

        console.log(`[TEST EMAIL ALERT] V
