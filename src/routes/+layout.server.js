import { redirect } from '@sveltejs/kit';

// Rotte accessibili a TUTTI, anche se non autenticati.
const publicRoutes = [
    '/', 
    '/login',
    '/signup',
    '/auth/callback',
    '/forgot-password',
    '/update-password'
];

/** @type {import('./$types').LayoutServerLoad} */
export async function load({ locals, url }) {

    // -----------------------------------------------------------
    // 1. GESTIONE DEL TOKEN SSO (Telegram/JWT)
    // -----------------------------------------------------------
    // Cattura il JWT temporaneo passato dall'URL dopo un login SSO riuscito.
    // Questo token servirà al client (+layout.svelte) per stabilire la sessione.
    const supabaseToken = url.searchParams.get('supabaseToken');
    
    // -----------------------------------------------------------
    // 2. RECUPERO DATI UTENTE GLOBALI (Standard Supabase Auth)
    // -----------------------------------------------------------
    
    // Recupera la sessione dal cookie (gestito da locals.supabase tramite hooks.server.js)
    const {
        data: { session },
    } = await locals.supabase.auth.getSession();

    // Dati aggiuntivi (popolati tipicamente in src/hooks.server.js)
    const user = locals.user || session?.user || null;
    const profile = locals.profile || null;
    const isAdmin = profile?.is_admin === true;

    // -----------------------------------------------------------
    // 3. LOGICA DI REINDIRIZZAMENTO
    // -----------------------------------------------------------
    
    if (!session) {
        // Se NON c'è sessione e l'utente NON sta provando ad accedere a una route pubblica...
        if (!publicRoutes.includes(url.pathname)) {
            // Aggiungi un'eccezione per il token SSO: se è presente,
            // permetti il caricamento anche se la sessione server non è ancora stabilita.
            if (!supabaseToken) {
                // Reindirizza forzatamente al login.
                const targetPath = url.pathname === '/' ? '/app' : url.pathname;
                throw redirect(303, `/login?redirected=true&from=${encodeURIComponent(targetPath)}`);
            }
        }
    } else {
        // Se C'È sessione ma l'utente tenta di accedere a pagine di autenticazione...
        if (url.pathname.startsWith('/login') || url.pathname.startsWith('/signup')) {
            // Reindirizza alla dashboard privata.
            throw redirect(303, '/'); 
        }
    }

    // -----------------------------------------------------------
    // 4. RITORNA I DATI AL CLIENT (+layout.svelte)
    // -----------------------------------------------------------
    return {
        session,
        user,
        profile,
        isAdmin,
        // Passa il token SSO al client (se presente nell'URL)
        supabaseToken 
    };
}
