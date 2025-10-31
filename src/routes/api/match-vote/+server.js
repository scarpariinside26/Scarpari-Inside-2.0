import { createClient } from '@supabase/supabase-js';
// Rimosse le importazioni da $env

// Variabili d'Ambiente per il client Anon (chiave pubblica)
// Se non l'hai ancora aggiunta a Vercel, dovrai farlo.
const SUPABASE_URL = process.env.SUPABASE_URL; 
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY; 

export async function POST({ request }) {
    // 💥 CORREZIONE CHIAVE: Inizializza Supabase all'interno della funzione
    // Usiamo la chiave ANON qui per attivare la RLS.
    const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    
    try {
        // I dati del voto sono passati dal client front-end
        const { eventId, voterId, votedId, score, jwt } = await request.json(); 

        if (!eventId || !voterId || !votedId || score === undefined || !jwt) {
            return new Response(JSON.stringify({ error: 'Dati di voto mancanti o incompleti.' }), { status: 400 });
        }
        
        // 1. Imposta la sessione per il voto (essenziale per la RLS)
        // Il JWT (JSON Web Token) è la chiave di sessione dell'utente.
        const { error: sessionError } = await supabase.auth.setSession({ access_token: jwt });

        if (sessionError) {
             console.error('Errore sessione Supabase:', sessionError);
             return new Response(JSON.stringify({ error: 'Errore di autenticazione Supabase. Sei loggato?' }), { status: 401 });
        }

        // 2. Inserisci il voto
        // La RLS su 'voti_partita' impedirà l'inserimento se voterId non è auth.uid()
        const { data, error } = await supabase
            .from('voti_partita')
            .insert({
                event_id: eventId,
                voter_user_id: voterId,
                voted_user_id: votedId,
                punteggio: score
            })
            .select();

        if (error) {
            console.error('Errore inserimento voto Supabase:', error);
            
            // Gestione dell'errore di violazione del vincolo UNIQUE (voto duplicato)
            if (error.code === '23505') { 
                return new Response(JSON.stringify({ error: 'Hai già votato per questa partita.' }), { status: 409 });
            }

            return new Response(JSON.stringify({ error: 'Impossibile registrare il voto.', detail: error.message }), { status: 500 });
        }
        
        return new Response(JSON.stringify({ 
            message: 'Voto registrato con successo.',
            voto_id: data[0].id
        }), { 
            status: 200, 
            headers: { 'Content-Type': 'application/json' }
        });

    } catch (error) {
        console.error('Errore critico nella registrazione del voto:', error);
        return new Response(JSON.stringify({ 
            error: 'Errore interno del server.',
            detail: error.message 
        }), { 
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
}
