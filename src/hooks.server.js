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
        // Carica il profilo (se il tuo codice lo richiede)
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

export const handle = handleSupabase;
