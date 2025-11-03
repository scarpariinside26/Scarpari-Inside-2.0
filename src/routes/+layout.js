import { createClient } from '@supabase/supabase-js';
// Importa le variabili d'ambiente pubbliche da SvelteKit
import { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY } from '$env/static/public';

// Dichiara la variabile all'esterno della funzione 'load' per implementare il Singleton.
// In questo modo, il client viene creato una sola volta sul lato client.
let supabase;

/** @type {import('./$types').LayoutLoad} */
export async function load({ fetch, data }) {
    
    // Crea l'istanza di Supabase solo se non è stata ancora creata.
    if (!supabase) {
        supabase = createClient(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY, {
            global: {
                // Assicura che SvelteKit fetch venga usato, utile per il server-side rendering
                fetch: fetch, 
            },
        });
    }

    // Ottiene la sessione utente attuale.
    const { 
        data: { session }, 
    } = await supabase.auth.getSession();
    
    // Restituisce l'istanza di Supabase e la sessione.
    // Questi saranno iniettati nel +layout.svelte tramite la prop `data`.
    return { 
        supabase, 
        session,
    };
}
