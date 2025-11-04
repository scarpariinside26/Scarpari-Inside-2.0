import { createClient } from '@supabase/supabase-js';
import { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY } from '$env/static/public';
import { SUPABASE_SERVICE_KEY } from '$env/static/private';


async function handleSupabase({ event, resolve }) {
    // 1. Client Standard (per l'uso nelle route)
    event.locals.supabase = createClient(
        PUBLIC_SUPABASE_URL,
        PUBLIC_SUPABASE_ANON_KEY,
    );
    
    // 2. Client Admin (se usato, usa la Service Key privata)
    event.locals.supabaseAdmin = createClient(
        PUBLIC_SUPABASE_URL,
        SUPABASE_SERVICE_KEY, 
        {
            auth: {
                persistSession: false
            }
        }
    );

    // 3. Implementa getSession() e carica i dati
    event.locals.getSession = async () => {
        const { data: { session } } = await event.locals.supabase.auth.getSession();
        return session;
    };

    const session = await event.locals.getSession();
    event.locals.session = session;

    if (session) {
        // --- BLOCCO TEMPORANEAMENTE DISABILITATO PER RISOLVERE ERRORE 500 ---
        // Se l'errore 500 scompare, il problema è qui (policy RLS o nome colonna).
        /*
        const { data: profile, error } = await event.locals.supabase
            .from('profili_utenti')
            .select('*')
            .eq('user_id', session.user.id)
            .maybeSingle();

        if (error) {
            console.error('Errore nel caricamento del profilo:', error);
            event.locals.profile = null;
        } else {
            event.locals.profile = profile;
        }
        */
       
       // Sostituito con null per testare il flusso di autenticazione base:
       event.locals.profile = null;
    } else {
        event.locals.profile = null;
    }
    
    return resolve(event);
}

export const handle = handleSupabase;
