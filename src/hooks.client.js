// src/hooks.client.js - Aggiornato per @supabase/ssr
import { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY } from '$env/static/public';
import { createBrowserClient } from '@supabase/ssr';

export const load = async ({ fetch, data, depends }) => {
	depends('supabase:auth');

	const supabase = createBrowserClient(
		PUBLIC_SUPABASE_URL,
		PUBLIC_SUPABASE_ANON_KEY,
		{
            global: { fetch }
        },
        // Passa la sessione dal server (data.session)
        { serverSession: data.session } 
	);
	
	const session = data.session;

	return { supabase, session };
};
