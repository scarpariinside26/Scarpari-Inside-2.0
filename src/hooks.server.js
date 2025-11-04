import { createClient } from '@supabase/supabase-js';
import { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY } from '$env/static/public';
import { SUPABASE_SERVICE_KEY } from '$env/static/private';


async function handleSupabase({ event, resolve }) {
    // 1. Client Standard (per l'uso nelle route)
    // Usiamo le chiavi pubbliche che dovrebbero essere sempre disponibili.
    event.locals.supabase = createClient(
        PUBLIC_SUPABASE_URL,
        PUBLIC_SUPABASE_ANON_KEY,
    );
    
    // 2. Client Admin (client privato con Service Key)
    // Creiamo il client Admin SOLO se la Service Key è definita, per prevenire errori 500.
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

    // Poiché abbiamo già disabilitato il recupero del profilo nel passo precedente,
    // manteniamo questo blocco snellito per isolare l'errore 500.
    event.locals.profile = null;
    
    return resolve(event);
}

export const handle = handleSupabase;
