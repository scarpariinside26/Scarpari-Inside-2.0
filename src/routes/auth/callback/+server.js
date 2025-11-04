import { redirect } from '@sveltejs/kit';

/**
 * Endpoint del server per gestire il reindirizzamento di Supabase dopo l'autenticazione.
 * Questo file cattura i parametri URL (come 'access_token', 'refresh_token' e 'expires_in')
 * che Supabase utilizza per impostare la sessione lato client.
 * * @type {import('./$types').RequestHandler}
 */
export async function GET({ url }) {
    // Supabase gestisce l'impostazione della sessione tramite i parametri URL.
    // Dobbiamo solo reindirizzare a una pagina sicura (la dashboard).

    // L'istanza di Supabase in +layout.svelte e in load.js leggerà automaticamente questi 
    // parametri URL e li userà per impostare la sessione e salvare il token nei cookie/storage.

    // Controlliamo se ci sono parametri che indicano un successo (access_token o errore)
    if (url.searchParams.has('access_token')) {
        // Se l'autenticazione ha successo, reindirizziamo alla home o alla dashboard.
        throw redirect(303, '/');
    }

    // Se c'è un errore (es. utente nega il permesso), reindirizziamo alla pagina di login con un errore.
    if (url.searchParams.has('error')) {
        console.error('Errore di autenticazione social:', url.searchParams.get('error_description'));
        throw redirect(303, '/login?error=' + url.searchParams.get('error_description'));
    }

    // In caso di accesso diretto o stato indefinito, reindirizza alla pagina di login
    throw redirect(303, '/login');
}
