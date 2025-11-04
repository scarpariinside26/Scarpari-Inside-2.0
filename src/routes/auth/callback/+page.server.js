import { redirect } from '@sveltejs/kit';

/**
 * Funzione di caricamento del server per gestire il callback di autenticazione di Supabase (OAuth o magic link).
 * Supabase imposta la sessione nel browser automaticamente leggendo i parametri URL.
 * Il compito del server è semplicemente reindirizzare l'utente loggato alla dashboard.
 * * @type {import('./$types').PageServerLoad}
 */
export async function load({ url }) {
    // Supabase ha già elaborato i token di autenticazione lato client.
    
    // 1. Gestione degli errori
    if (url.searchParams.has('error')) {
        const errorMsg = url.searchParams.get('error_description') || 'Errore di autenticazione social.';
        console.error('Errore di autenticazione:', errorMsg);
        // Reindirizzamento alla pagina di login, mostrando l'errore
        throw redirect(303, `/login?error=${encodeURIComponent(errorMsg)}`);
    }

    // 2. Gestione del successo (l'utente è autenticato)
    // Non devi più cercare 'access_token', l'unica cosa che devi fare
    // è reindirizzare l'utente a un percorso protetto.
    
    // Se è presente un parametro 'redirectTo', usalo, altrimenti usa '/app' come predefinito.
    const redirectTo = url.searchParams.get('redirectTo') || '/app';
    
    // Poiché siamo qui, Supabase avrà impostato i cookie/sessione nel browser.
    // Reindirizziamo alla destinazione.
    throw redirect(303, redirectTo);
}
