import { redirect } from '@sveltejs/kit';

// Rotte accessibili a TUTTI, anche se non autenticati.
// Rimuovendo '/' da qui, la home page (/) e tutte le altre pagine (eccetto queste)
// saranno protette e richiederanno il login.
const publicRoutes = [
    '/login', 
    '/signup', 
    '/auth/callback', 
    '/forgot-password',
    '/update-password' // Aggiungiamo anche la pagina per l'aggiornamento della password
];

/** @type {import('./$types').LayoutServerLoad} */
export async function load({ locals, url }) {
    const session = locals.session;
    
    // 1. Dati utente globali (usiamo i dati da locals, che hooks.server.js ha popolato)
    const user = locals.user || null;
    const profile = locals.profile || null;
    // Assicurati che isAdmin sia un booleano, anche se profile è null
    const isAdmin = profile?.is_admin === true; 
    
    // 2. Logica di reindirizzamento
    if (!session) {
        // Se NON c'è sessione e l'utente NON sta provando ad accedere a una route pubblica...
        if (!publicRoutes.includes(url.pathname)) {
            // Reindirizza forzatamente al login.
            // Uso il percorso completo e codifico la destinazione originale
            const targetPath = url.pathname === '/' ? '/app' : url.pathname;
            throw redirect(303, `/login?redirected=true&from=${encodeURIComponent(targetPath)}`);
        }
    } else {
        // Se C'È sessione ma l'utente tenta di accedere a pagine di autenticazione...
        if (url.pathname.startsWith('/login') || url.pathname.startsWith('/signup')) {
            // Reindirizza alla dashboard privata.
            throw redirect(303, '/app');
        }
    }
    
    // 3. Ritorna i dati della sessione e del profilo a tutte le pagine
    // Ritorna anche user, profile e isAdmin per comodità nel layout client
    return {
        session,
        user,
        profile,
        isAdmin
        // Se carichi qui liveEvent e teams, li aggiungi qui.
    };
}
