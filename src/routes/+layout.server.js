import { redirect } from '@sveltejs/kit';

/** @type {import('./$types').LayoutServerLoad} */
export async function load({ locals, url }) {
    // 1. Ottieni i dati di sessione e profilo da hooks.server.js
    const session = locals.session;
    const profile = locals.profile;

    // 2. Definisci le pagine pubbliche che non richiedono login (o sono entry point)
    // Ho aggiunto anche /auth, poiché il callback è lì.
    const publicRoutes = ['/login', '/signup', '/auth/callback', '/auth'];

    // 3. Logica di reindirizzamento
    if (!session) {
        // Se non c'è sessione e l'utente tenta di accedere a una route privata
        if (!publicRoutes.includes(url.pathname)) {
            // Reindirizza alla pagina di login.
            // Uso il path base /login per semplicità, ma mantengo il redirectTo per l'uso client.
            throw redirect(303, `/login?redirectTo=${url.pathname}`);
        }
    } else {
        // Se c'è sessione e l'utente è su una pagina pubblica (login/signup/auth)
        if (publicRoutes.includes(url.pathname)) {
            // Reindirizza alla pagina principale se è già loggato
            throw redirect(303, '/');
        }
    }

    // Passa i dati al client (+layout.svelte)
    // Importante: Passiamo anche event.locals.supabase in modo che sia disponibile 
    // per essere esposto tramite setContext in +layout.svelte.
    return {
        supabase: locals.supabase, // Aggiunto per l'uso in +layout.svelte
        session,
        profile
    };
}
