import { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY } from '$env/static/public';
import { SUPABASE_SERVICE_KEY } from '$env/static/private';
import { createServerClient } from '@supabase/ssr';
import { createClient } from '@supabase/supabase-js';
import { redirect } from '@sveltejs/kit';

/**
 * Funzione di gestione principale per SvelteKit.
 * Inizializza Supabase SSR client, Supabase Admin client,
 * e carica la sessione/profilo per renderli disponibili in locals.
 *
 * @type {import('@sveltejs/kit').Handle}
 */
export const handle = async ({ event, resolve }) => {
    // 1. Inizializzazione del Client SSR (Gestisce i Cookie)
    event.locals.supabase = createServerClient(
        PUBLIC_SUPABASE_URL,
        PUBLIC_SUPABASE_ANON_KEY,
        {
            cookies: {
                get: (key) => event.cookies.get(key),
                set: (key, value, options) => {
                    event.cookies.set(key, value, options);
                },
                remove: (key, options) => {
                    event.cookies.set(key, '', options);
                },
            },
        }
    );

    // 2. Inizializzazione del Client Admin (solo se la chiave è disponibile)
    if (SUPABASE_SERVICE_KEY) {
        event.locals.supabaseAdmin = createClient(
            PUBLIC_SUPABASE_URL,
            SUPABASE_SERVICE_KEY,
            {
                auth: { persistSession: false }
            }
        );
    } else {
        event.locals.supabaseAdmin = null;
    }

    // 3. Caricamento della Sessione e del Profilo
    
    // getSession() è il modo più robusto per leggere i cookie che sono stati scritti
    // dal client SSR al punto 1.
    const { data: { session } } = await event.locals.supabase.auth.getSession();
    event.locals.session = session;
    event.locals.user = session?.user || null;
    event.locals.profile = null; // Inizializza profile a null

    if (session) {
        // Usa il client SSR (event.locals.supabase) per leggere il profilo.
        // La RLS Policy che hai creato in precedenza permette la lettura.
        const { data: profile, error } = await event.locals.supabase
            .from('profili_utenti')
            .select('*')
            .eq('user_id', session.user.id)
            .maybeSingle();

        if (error) {
            console.error('Errore nel caricamento del profilo in hooks.server:', error.message);
        } else {
            event.locals.profile = profile;
        }
    }

    // Prosegui con l'esecuzione delle route (es. +layout.server.js)
    return resolve(event);
};
