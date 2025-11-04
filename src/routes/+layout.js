import { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY } from '$env/static/public';
import { createSupabaseLoadClient } from '@supabase/auth-helpers-sveltekit';

/**
 * Carica l'istanza di Supabase e i dati della sessione.
 * Esegue il lato server e poi si reidrata sul client.
 * * @type {import('./$types').LayoutLoad}
 */
export const load = async ({ fetch, data, depends }) => {
    // Forza il ricaricamento del layout ogni volta che l'autenticazione cambia (cruciale per il reindirizzamento)
    depends('supabase:auth');

    // Crea l'istanza del client Supabase per la funzione load
    const supabase = createSupabaseLoadClient({
        supabaseUrl: PUBLIC_SUPABASE_URL,
        supabaseKey: PUBLIC_SUPABASE_ANON_KEY,
        event: { fetch },
        serverSession: data.session, // Sessione fornita dal server (SSR)
    });

    // Ottiene i dati della sessione per lo stato iniziale
    const {
        data: { session },
    } = await supabase.auth.getSession();

    return { supabase, session };
};
