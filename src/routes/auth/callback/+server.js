import { redirect } from '@sveltejs/kit';

/**
 * Endpoint del server per gestire il reindirizzamento di Supabase dopo l'autenticazione OAuth.
 * Questo endpoint cattura il 'code' dal parametro URL e lo scambia per una sessione.
 *
 * @type {import('./$types').RequestHandler}
 */
export async function GET({ url, locals }) { // Deve essere GET, non load
    
    // Controlla se è presente il codice di autorizzazione OAuth
    const code = url.searchParams.get('code');

    if (code) {
        // Se è presente il codice, usiamo il client Supabase lato server 
        // (da locals.supabase, popolato dal tuo hooks.server.js) per scambiarlo.
        // Questo è il passaggio CRITICO che imposta il cookie di sessione nel browser.
        const { error } = await locals.supabase.auth.exchangeCodeForSession(code);

        if (error) {
            console.error('Errore durante lo scambio del codice OAuth:', error.message);
            // Reindirizza al login con un errore se lo scambio fallisce
            throw redirect(303, '/login?error=' + encodeURIComponent(error.message));
        }

        // Se lo scambio ha successo, reindirizza l'utente alla dashboard
        throw redirect(303, '/');
    }

    // Se l'URL non contiene 'code' (es. un reindirizzamento manuale senza token o un errore generico non gestito)
    // Controlliamo se Supabase ha reindirizzato con un errore
    if (url.searchParams.has('error')) {
        const errorDescription = url.searchParams.get('error_description') || 'Errore di autenticazione social sconosciuto.';
        console.error('Errore di autenticazione social:', errorDescription);
        throw redirect(303, '/login?error=' + encodeURIComponent(errorDescription));
    }

    // Default: reindirizza al login se non c'è né codice né errore
    throw redirect(303, '/login');
}
