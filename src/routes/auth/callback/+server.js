// src/routes/auth/callback/+server.js

import { redirect } from '@sveltejs/kit';

export async function GET(event) {
	const {
		url,
		locals: { supabase } // Accede al client Supabase inizializzato in hooks.server.js
	} = event;

	const code = url.searchParams.get('code');
	const next = url.searchParams.get('next') ?? '/'; // Dove reindirizzare dopo il login

	if (code) {
		const { error } = await supabase.auth.exchangeCodeForSession(code);

		if (!error) {
			// Se lo scambio di codice ha successo, reindirizza l'utente
			throw redirect(303, `/${next.slice(1)}`); 
		}
	}

	// Se l'autenticazione fallisce per qualsiasi motivo, reindirizza alla pagina di login
	throw redirect(303, '/login');
}
