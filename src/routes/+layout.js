import { createClient } from '@supabase/supabase-js';
// Assicurati che queste variabili siano definite nel tuo file .env e rese pubbliche.
import { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY } from '$env/static/public';

/** @type {import('./$types').LayoutLoad} */
export async function load({ fetch, data }) {
    // La funzione load è l'unico contenuto di questo file. Non deve contenere tag Svelte.
    
    // Inizializza il client Supabase
    const supabase = createClient(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY, {
        global: {
            fetch: fetch, // Usa fetch di SvelteKit per il lato server
        },
    });

    // Ottiene la sessione corrente
    const { 
        data: { session }, 
    } = await supabase.auth.getSession();
    
    // Restituisce l'oggetto Supabase e la sessione.
    // Questi saranno disponibili come data.supabase e data.session in +layout.svelte.
    return { 
        supabase, 
        session,
    };
}
