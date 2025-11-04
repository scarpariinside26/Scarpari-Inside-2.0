import { redirect } from '@sveltejs/kit';

/** @type {import('./$types').LayoutServerLoad} */
export async function load({ locals, url }) {
    // 1. Ottieni i dati di sessione e profilo da hooks.server.js
    // Questo è il punto in cui la sessione e il profilo sono già stati caricati o impostati su null.
    const session = locals.session;
    const profile = locals.profile;

    // 2. Definisci le pagine pubbliche che non richiedono login (o sono entry point)
    // Ho aggiunto anche /auth, poiché il callback è lì.
    const publicRoutes = ['/login', '/signup', '/auth/callback', '/auth'];
    
    // Controlla se l'utente sta cercando di accedere a una rotta pubblica
    const isPublicRoute = publicRoutes.includes(url.pathname);

    // 3. Logica di reindirizzamento
    
    if (!session) {
        // A. Utente NON autenticato
        if (!isPublicRoute) {
            // Reindirizza alla pagina di login se la rotta è privata
            throw redirect(303, `/login?redirectTo=${url.pathname}`);
        }
    } else {
        // B. Utente autenticato
        if (isPublicRoute && url.pathname !== '/auth/callback') {
            // Se l'utente è loggato e tenta di accedere a /login o /signup, 
            // reindirizza alla home. Escludiamo il callback per sicurezza.
            throw redirect(303, '/');
        }
    }

    // Passa i dati al client (+layout.svelte)
    // Il client Supabase (locals.supabase) è essenziale per il client-side.
    return {
        supabase: locals.supabase,
        session,
        profile
    };
}
