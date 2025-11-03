// src/hooks.client.js - VERSIONE CORRETTA E MODERNA
import { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY } from '$env/static/public';
import { createBrowserClient } from '@supabase/ssr';
import { setContext } from 'svelte';
import { getContext } from 'svelte'; // Potresti averne bisogno altrove

// Nota: il client moderno @supabase/ssr non ha bisogno della funzione 'load' 
// in questo file, ma usiamo 'load' per passare i dati del server al client.

export const load = async ({ fetch, data, depends }) => {
	depends('supabase:auth');

    // 1. Inizializza il client lato browser usando la funzione standard
	const supabase = createBrowserClient(
		PUBLIC_SUPABASE_URL,
		PUBLIC_SUPABASE_ANON_KEY,
		{
            global: {
                fetch,
            }
        },
        // 'data.session' viene passato dal server (dall'hooks.server.js)
        { serverSession: data.session } 
	);
	
    // 2. Imposta la sessione. 'data.session' è la sessione passata dal server.
    const session = data.session;

    // 3. Ritorna i dati.
	return { supabase, session };
};
