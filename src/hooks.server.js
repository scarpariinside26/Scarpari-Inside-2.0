// src/hooks.server.js

import { createClient } from '@supabase/supabase-js';
import { sequence } from '@sveltejs/kit/hooks'; 

// --- Importazioni delle Variabili d'Ambiente ---

// Chiavi Pubbliche (URL deve essere importato da qui, altrimenti ottieni Errore 500!)
import { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY } from '$env/static/public';

// Chiave Privata (Service Key per le operazioni Admin)
import { SUPABASE_SERVICE_KEY } from '$env/static/private'; 


// --- 1. Definizione della Logica del Server Hook ---

async function handleSupabase({ event, resolve }) {
    // A. Inizializzazione Client STANDARD (lato utente/anonimo)
    // Questo client è necessario per i metodi come getSession() o per query semplici.
    event.locals.supabase = createClient(
        PUBLIC_SUPABASE_URL,
        PUBLIC_SUPABASE_ANON_KEY,
    );
    
    // B. Inizializzazione Client ADMIN (con Service Key)
    // Questo client usa la chiave privata ed è essenziale per le operazioni Admin.
    event.locals.supabaseAdmin = createClient(
        PUBLIC_SUPABASE_URL, // Usa l'URL pubblico, che è impostato correttamente in Vercel
        SUPABASE_SERVICE_KEY, 
        {
            auth: {
                persistSession: false // Cruciale per l'ambiente SSR/serverless
            }
        }
    );

    /**
     * Il codice qui sotto è un placeholder per la gestione della sessione.
     * Deve essere adattato al pacchetto di autenticazione che stai utilizzando
     * (es. @supabase/auth-helpers-sveltekit o @supabase/ssr).
     * * Il tuo +page.server.js usa event.locals.getSession(), 
     * quindi devi definire quella funzione qui o assicurarti che venga fornita
     * dal client Supabase standard (A).
     */
    
    // Se usi @supabase/auth-helpers, il codice era solitamente così:
    // event.locals.getSession = async () => {
    //     const { data: { session } } = await event.locals.supabase.auth.getSession();
    //     return session;
    // };

    // Risolvi e passa la richiesta alla route successiva
    return resolve(event);
}


// --- 2. Esporta l'Handler ---

// Usiamo 'sequence' nel caso tu voglia aggiungere altri hook in futuro
export const handle = sequence(handleSupabase);
