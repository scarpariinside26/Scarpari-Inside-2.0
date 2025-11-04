import { redirect } from '@sveltejs/kit';

// Rotte accessibili a TUTTI, anche se non autenticati.
// La root ('/') è stata aggiunta per evitare un reindirizzamento loop subito dopo il login
// quando il client SvelteKit non ha ancora elaborato la sessione fresca.
const publicRoutes = [
    '/', // Aggiunto per permettere al callback di Supabase di atterrare e stabilizzare la sessione
    '/login',
    '/signup',
    '/auth/callback',
    '/forgot-password',
    '/update-password'
];

/** @type {import('./$types').LayoutServerLoad} */
export async function load({ locals, url }) {

    // 1. Dati utente globali e sessione
    // NOTA: Con il corretto hooks.server.js, questa riga non è strettamente necessaria qui,
    // ma funge da robusta doppia verifica per la sessione più aggiornata.
    const {
        data: { session },
    } = await locals.supabase.auth.getSession();

    // Questi dati dovrebbero essere popolati in src/hooks.server.js
    const user = locals.user || session?.user || null;
    const profile = locals.profile || null;
    const isAdmin = profile?.is_admin === true;

    // 2. Logica di reindirizzamento
    if (!session) {
        // Se NON c'è sessione e l'utente NON sta provando ad accedere a una route pubblica...
        if (!publicRoutes.includes(url.pathname)) {
            // Reindirizza forzatamente al login.
            // Se l'utente tenta di accedere a una pagina protetta, viene reindirizzato
            // e la destinazione originale viene salvata.
            const targetPath = url.pathname === '/' ? '/app' : url.pathname;
            throw redirect(303, `/login?redirected=true&from=${encodeURIComponent(targetPath)}`);
        }
    } else {
        // Se C'È sessione ma l'utente tenta di accedere a pagine di autenticazione...
        if (url.pathname.startsWith('/login') || url.pathname.startsWith('/signup')) {
            // Reindirizza alla dashboard privata.
            throw redirect(303, '/'); // Reindirizza alla home (che dovrebbe essere protetta/dashboard)
        }
    }

    // 3. Ritorna i dati della sessione e del profilo a tutte le pagine
    return {
        session,
        user,
        profile,
        isAdmin
    };
}
