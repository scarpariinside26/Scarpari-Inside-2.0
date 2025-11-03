// src/hooks.server.js
import { createClient } from '@supabase/supabase-js';
import { sequence } from '@sveltejs/kit/hooks'; 

// Importa l'URL Pubblico per entrambi i client (risoluzione Errore 500)
import { 
    PUBLIC_SUPABASE_URL, 
    PUBLIC_SUPABASE_ANON_KEY 
} from '$env/static/public';

// Importa la chiave privata
import { SUPABASE_SERVICE_KEY } from '$env/static/private'; 


// Funzione Hook Principale
async function handleSupabase({ event, resolve }) {
    // --- 1. Client Standard (per le operazioni come locals.supabase) ---
    // Questo client è quello che il tuo +page.server.js usa per le query SQL.
    event.locals.supabase = createClient(
        PUBLIC_SUPABASE_URL,
        PUBLIC_SUPABASE_ANON_KEY,
    );
    
    // --- 2. Client Admin (per operazioni con privilegi elevati) ---
    event.locals.supabaseAdmin = createClient(
        PUBLIC_SUPABASE_URL,
        SUPABASE_SERVICE_KEY, 
        {
            auth: {
                persistSession: false // Cruciale per Vercel
            }
        }
    );

    // --- 3. Implementazione di getSession() ---
    // Dobbiamo re-implementare la funzione getSession() che il tuo +page.server.js si aspetta.
    event.locals.getSession = async () => {
        // Chiama il metodo standard Supabase per recuperare la sessione
        const { data: { session } } = await event.locals.supabase.auth.getSession();
        return session;
    };

    // --- 4. Carica la Sessione e il Profilo (per il tuo +page.server.js) ---
    // Questo carica la sessione e il profilo nell'oggetto locals, in modo che 
    // siano disponibili per tutte le tue route server.
    const session = await event.locals.getSession();
    event.locals.session = session;

    if (session) {
        // Recupera i dati del profilo dalla tua tabella 'profili_utenti' usando l'ID utente.
        const { data: profile } = await event.locals.supabase
            .from('profili_utenti')
            .select('*')
            .eq('user_id', session.user.id)
            .maybeSingle();

        event.locals.profile = profile;
    } else {
        event.locals.profile = null;
    }
    
    return resolve(event);
}

// Esporta l'handler
export const handle = handleSupabase;
