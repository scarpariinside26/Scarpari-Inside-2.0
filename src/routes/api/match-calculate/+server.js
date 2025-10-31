import { createClient } from '@supabase/supabase-js';

// Rimosse le importazioni da $env, ora si usa process.env
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY;

export async function POST({ request }) {
    // 💥 CORREZIONE CHIAVE: Inizializza Supabase Admin all'interno della funzione
    const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY, {
        auth: {
            autoRefreshToken: false,
            persistSession: false,
        },
    });

    try {
        const { eventId } = await request.json(); 

        if (!eventId) {
            return new Response(JSON.stringify({ error: 'Missing eventId.' }), { status: 400 });
        }
        
        // ===================================================================
        // PASSO 1: Ottieni Voti e Roster
        // ===================================================================

        // 1a. Ottieni tutti i voti per l'evento (solo il service_role può farlo!)
        const { data: votesData, error: votesError } = await supabaseAdmin
            .from('voti_partita')
            .select('voter_user_id, voted_user_id, punteggio')
            .eq('event_id', eventId);

        if (votesError) {
            console.error('Errore query voti Supabase:', votesError);
            throw new Error('Impossibile recuperare i voti segreti.');
        }

        // 1b. Ottieni tutti i partecipanti (roster)
        const { data: rosterData, error: rosterError } = await supabaseAdmin
            .from('tournament_rosters')
            .select('user_id, team_name')
            .eq('event_id', eventId);
            
        if (rosterError) {
             console.error('Errore query roster Supabase:', rosterError);
             throw new Error('Impossibile recuperare il roster della partita.');
        }
        
        // Mappa dei partecipanti per ID utente
        const participants = rosterData.map(p => p.user_id);
        
        if (participants.length === 0) {
             return new Response(JSON.stringify({ message: 'Nessun partecipante trovato per calcolare i voti.' }), { status: 400 });
        }


        // ===================================================================
        // PASSO 2: Calcolo e Aggregazione dei Punteggi
        // ===================================================================

        const finalScores = {};
        const bonusParticipation = {}; // Contatore per il bonus "voto dato"

        // Inizializza punteggi e bonus per tutti i partecipanti
        participants.forEach(id => {
            finalScores[id] = 0;
            bonusParticipation[id] = 0;
        });

        // Aggrega i voti
        votesData.forEach(vote => {
            // Aggiungi il voto al giocatore che ha ricevuto il voto (voted_user_id)
            if (finalScores.hasOwnProperty(vote.voted_user_id)) {
                finalScores[vote.voted_user_id] += vote.punteggio;
            }
            
            // Aggiungi il bonus di partecipazione (per chi ha votato)
            if (bonusParticipation.hasOwnProperty(vote.voter_user_id)) {
                 bonusParticipation[vote.voter_user_id] = 1; // 1 punto bonus per aver votato
            }
        });
        
        let finalResults = [];

        // Applica i bonus e prepara il risultato finale
        participants.forEach(id => {
            const totalScore = finalScores[id] + (bonusParticipation[id] * 5); // 5 punti bonus per aver votato
            
            finalResults.push({
                user_id: id,
                score_voti: finalScores[id],
                bonus_partecipazione: bonusParticipation[id] * 5,
                total_score: totalScore
            });
            
            // Aggiorna il DB qui o nel passo 3b
            // Nota: Se salvi i punteggi in una tabella di risultati, devi creare quella tabella
        });


        // ===================================================================
        // PASSO 3: Aggiornamento Risultati nel Database
        // ===================================================================
        
        // Questo passo dipende da dove salvi il punteggio finale.
        // Ipotizziamo di avere una tabella 'event_results' per salvare il punteggio totale dell'evento:
        
        // 3a. Inserisci o Aggiorna i risultati finali (Esempio teorico, la tabella 'event_results' deve esistere)
        /*
        const updatePromises = finalResults.map(result => {
             return supabaseAdmin
                .from('event_results') 
                .upsert({ 
                    event_id: eventId,
                    user_id: result.user_id,
                    punteggio_finale: result.total_score,
                }, { onConflict: ['event_id', 'user_id'] }); // Aggiorna se esiste già
        });

        await Promise.allSettled(updatePromises);
        */
        
        // 3b. Segna la partita come calcolata (es. su event_tournaments)
        const { error: calcError } = await supabaseAdmin
            .from('event_tournaments')
            .update({ is_calculated: true }) // Devi aggiungere la colonna is_calculated: boolean alla tabella event_tournaments
            .eq('event_id', eventId);

        if (calcError) {
             console.warn('ATTENZIONE: Fallito l\'aggiornamento di is_calculated:', calcError);
        }

        return new Response(JSON.stringify({ 
            message: 'Calcolo completato. Punteggi e bonus aggregati.',
            results: finalResults
        }), { 
            status: 200, 
            headers: { 'Content-Type': 'application/json' }
        });

    } catch (error) {
        console.error('Errore critico nel calcolo dei voti:', error);
        return new Response(JSON.stringify({ 
            error: 'Errore interno del server durante il calcolo.',
            detail: error.message 
        }), { 
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
}
