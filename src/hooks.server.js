import { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY } from '$env/static/public';
import { SUPABASE_SERVICE_KEY } from '$env/static/private';
// Importiamo il client standard per l'admin e il client SSR per le rotte pubbliche
import { createClient } from '@supabase/supabase-js';
import { createServerClient } from '@supabase/ssr'; // <-- Importazione CRUCIALE per i cookie

async function handleSupabase({ event, resolve }) {
    // 1. Client SSR (Client Pubblico per la sessione utente e le API)
    // QUESTO è il client che deve essere usato per gestire i cookie/sessione
    event.locals.supabase = createServerClient(
        PUBLIC_SUPABASE_URL,
        PUBLIC_SUPABASE_ANON_KEY,
        {
            cookies: {
                // PASSAGGIO ESSENZIALE: configuriamo Supabase per leggere/scrivere i cookie HTTP
                get: (key) => event.cookies.get(key),
                set: (key, value, options) => {
                    event.cookies.set(key, value, { ...options, path: '/' });
                },
                remove: (key, options) => {
                    event.cookies.set(key, '', { ...options, path: '/' });
                },
            },
        }
    );

    // 2. Client Admin (client privato con Service Key) - Nessuna gestione cookie necessaria
    if (SUPABASE_SERVICE_KEY) {
        event.locals.supabaseAdmin = createClient(
            PUBLIC_SUPABASE_URL,
            SUPABASE_SERVICE_KEY,
            {
                auth: {
                    persistSession: false
                }
            }
        );
    } else {
        event.locals.supabaseAdmin = null;
        console.warn("SUPABASE_SERVICE_KEY non trovata. Il client Admin è disabilitato.");
    }

    // 3. Ottieni la sessione aggiornata
    // L'uso di getSession sul client SSR attiva l'aggiornamento automatico dei token.
    const { data: { session } } = await event.locals.supabase.auth.getSession();
    event.locals.session = session;
    
    // Popola locals con l'utente (per comodità)
    event.locals.user = session?.user;

    // 4. Caricamento del Profilo (La tua logica personalizzata)
    if (session) {
        // Carica il profilo (richiede Policy RLS su profili_utenti)
        const { data: profile, error } = await event.locals.supabase
            .from('profili_utenti')
            .select('*')
            .eq('user_id', session.user.id)
            .maybeSingle();

        // Controllo l'errore, che potrebbe essere un problema di permessi RLS
        if (error && error.code !== 'PGRST116') {
            console.error('Errore nel caricamento del profilo:', error);
            event.locals.profile = null;
        } else {
            event.locals.profile = profile;
        }
    } else {
        event.locals.profile = null;
    }

    return resolve(event);
}

export const handle = handleSupabase;
