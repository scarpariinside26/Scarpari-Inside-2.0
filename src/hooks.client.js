// src/hooks.client.js
import { createSupabaseLoadClient } from '@supabase/auth-helpers-sveltekit';
import { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY } from '$env/static/public';
import { setContext } from 'svelte';

export const load = async ({ fetch, data, depends }) => {
	depends('supabase:auth');

	const supabase = createSupabaseLoadClient({
		supabaseUrl: PUBLIC_SUPABASE_URL,
		supabaseKey: PUBLIC_SUPABASE_ANON_KEY,
		event: { fetch },
		serverSession: data.session
	});
	
    // Imposta il client Supabase nel contesto Svelte per l'accesso frontend
    setContext('supabase', supabase);

	const {
		data: { session }
	} = await supabase.auth.getSession();

	return { supabase, session };
};
