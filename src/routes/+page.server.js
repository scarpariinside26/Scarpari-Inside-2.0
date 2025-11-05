import { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY } from '$env/static/public';
import { TELEGRAM_BOT_TOKEN } from '$env/static/private';
import { createClient } from '@supabase/supabase-js';
import { error } from '@sveltejs/kit';

// ==========================================================
// *** CHECK CRITICO - PROBABILE CAUSA DELL'ERRORE ALLA LINEA 10 ***
// Questo controllo deve avvenire prima di inizializzare il client Supabase
// per evitare di usare valori non definiti. Se una di queste è mancante 
// nel server Vercel, il build fallisce qui.
if (!PUBLIC_SUPABASE_URL || !PUBLIC_SUPABASE_ANON_KEY || !TELEGRAM_BOT_TOKEN) {
    // Aggiungi un log di debug per vedere quale variabile manca
    console.error('URL:', PUBLIC_SUPABASE_URL ? 'OK' : 'MISSING');
    console.error('ANON_KEY:', PUBLIC_SUPABASE_ANON_KEY ? 'OK' : 'MISSING');
    console.error('TELEGRAM_BOT_TOKEN:', TELEGRAM_BOT_TOKEN ? 'OK' : 'MISSING');
    
    // Ritorna un errore standard o continua con un fallback se possibile
    throw new Error('Mancano variabili d\'ambiente essenziali per l\'autenticazione. Controllare PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY e TELEGRAM_BOT_TOKEN.');
}

// ==========================================================

// Inizializzazione del client Supabase con le chiavi pubbliche
const supabase = createClient(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY);


/** @type {import('./$types').PageServerLoad} */
export async function load({ locals }) {
    // Qui andrà la logica per la pagina, come il fetching degli eventi o lo stato utente.
    // Esempio:
    // const { data: events, error: err } = await supabase.from('events').select('*');
    
    return {
        // Ritorna i dati necessari alla pagina
        // events: events || [], 
    };
}
