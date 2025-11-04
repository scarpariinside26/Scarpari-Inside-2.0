import { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY } from '$env/static/public';
// Modifica qui: usa createBrowserClient al posto del vecchio helper
import { createBrowserClient } from '@supabase/ssr'; // Aggiornato l'importazione

/**
 * Carica l'istanza di Supabase e i dati della sessione.
 * @type {import('./$types').LayoutLoad}
 */
export const load = async ({ fetch, data, depends }) => {
    depends('supabase:auth');

    // Usa createBrowserClient da @supabase/ssr
    const supabase = createBrowserClient(
        PUBLIC_SUPABASE_URL,
        PUBLIC_SUPABASE_ANON_KEY,
        {
            // Il client SSR richiede i cookie per l'idratazione.
            // L'istanza createBrowserClient/createSupabaseLoadClient si idrata automaticamente
            // con la sessione passata da +layout.server.js (data.session).
            cookies: {
                get: (key) => data.session ? JSON.parse(data.session)[key] : null,
                set: (key, value, options) => {
                    // Questa funzione non dovrebbe essere chiamata durante il caricamento,
                    // ma è necessaria per la tipizzazione corretta.
                }
            },
        }
    );
    
    // Non devi più passare 'serverSession: data.session' come opzione
    // perché viene gestito dal wrapper cookies.

    const {
        data: { session },
    } = await supabase.auth.getSession();

    return { supabase, session };
};
