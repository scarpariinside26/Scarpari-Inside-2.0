// src/hooks.client.js - VERSIONE CORRETTA E MODERNA
import { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY } from '$env/static/public';
import { createBrowserClient } from '@supabase/ssr';

export const load = async ({ fetch, data, depends }) => {
	depends('supabase:auth');

    // Inizializza il client lato browser
	const supabase = createBrowserClient(
		PUBLIC_SUPABASE_URL,
		PUBLIC_SUPABASE_ANON_KEY,
		{
            global: {
                fetch,
            }
        },
        // Passa la sessione dal server
        { serverSession: data.session } 
	);
	
    // Usiamo la sessione passata dal server
	const session = data.session;

	return { supabase, session };
};
