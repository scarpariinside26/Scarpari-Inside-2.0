// src/hooks.server.js - CRUCIALE PER LA SESSIONE E I DATI
import { createClient } from '@supabase/supabase-js';
import { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY } from '$env/static/public';
import { SUPABASE_SERVICE_KEY } from '$env/static/private'; 


async function handleSupabase({ event, resolve }) {
    // 1. Client Standard (per l'uso nelle route)
    event.locals.supabase = createClient(
        PUBLIC_SUPABASE_URL,
        PUBLIC_SUPABASE_ANON_KEY,
    );
    
    // 2. Client Admin (client privato con Service Key)
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

    // 3. Implementa getSession() e carica i dati
    event.locals.getSession = async () => {
        const { data: { session } } = await event.locals.supabase.auth.getSession();
        return session;
    };

    const session = await event.locals.getSession();
    event.locals.session = session;

    // RIABILITAZIONE DEL RECUPERO DEL PROFILO -------------------------
    if (session) {
        // Carica il profilo (richiede Policy RLS su profili_utenti)
        const { data: profile, error } = await event.locals.supabase
            .from('profili_utenti')
            .select('*')
            .eq('user_id', session.user.id)
            .maybeSingle();

        // Controllo l'errore, che potrebbe essere un problema di permessi RLS
        if (error && error.code !== 'PGRST116') { // PGRST116 = nessun risultato, non è un errore
            console.error('Errore nel caricamento del profilo:', error);
            // Non blocco l'esecuzione, ma profile sarà null
            event.locals.profile = null;
        } else {
            event.locals.profile = profile;
        }
    } else {
        event.locals.profile = null;
    }
    // -----------------------------------------------------------------
    
    return resolve(event);
}

export const handle = handleSupabase;
