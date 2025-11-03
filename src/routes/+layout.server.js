// src/routes/+layout.server.js
import { redirect } from '@sveltejs/kit';

export async function load({ locals, url }) {
    // 1. Ottieni i dati da hooks.server.js
    const session = locals.session;
    const profile = locals.profile; // Se usi il profilo

    // 2. Definisci le pagine pubbliche che non richiedono login
    const publicRoutes = ['/login', '/signup', '/auth/callback'];

    // 3. Logica di reindirizzamento
    if (!session) {
        // Se non c'è sessione
        if (!publicRoutes.includes(url.pathname)) {
            // Reindirizza alla pagina di login se l'utente tenta di accedere a una route privata
            // Mantenendo l'URL della pagina a cui voleva accedere
            throw redirect(303, `/login?redirectTo=${url.pathname}`);
        }
    } else {
        // Se c'è sessione e l'utente è su una pagina pubblica (login/signup)
        if (publicRoutes.includes(url.pathname)) {
            // Reindirizza alla pagina principale se è già loggato
            throw redirect(303, '/');
        }
    }

    // Passa i dati al lato client
    return {
        session,
        profile
    };
}
