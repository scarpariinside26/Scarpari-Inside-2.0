import { redirect } from '@sveltejs/kit';

/**
 * Endpoint del server per gestire il reindirizzamento di Supabase dopo l'autenticazione OAuth.
 *
 * @type {import('./$types').RequestHandler}
 */
export async function GET({ url, locals }) { // Deve essere GET, non load
    
    const code = url.searchParams.get('code');
    const redirectTo = url.searchParams.get('from') || '/'; // Otteniamo la destinazione originale

    if (code) {
        console.log('SERVER DEBUG: Codice OAuth ricevuto. Tentativo di scambio sessione...');
        const { data, error } = await locals.supabase.auth.exchangeCodeForSession(code);

        if (error) {
            console.error('SERVER ERROR: Errore durante lo scambio del codice OAuth:', error.message);
            throw redirect(303, '/login?error=' + encodeURIComponent(error.message));
        }

        console.log('SERVER SUCCESS: Sessione creata per utente:', data.session.user.email);
        
        // Se lo scambio ha successo, reindirizza alla destinazione originale.
        throw redirect(303, redirectTo);
    }

    // ... (resto della logica)
    
    // Default: reindirizza al login se non c'è né codice né errore
    console.log('SERVER DEBUG: Nessun codice, reindirizzo al login.');
    throw redirect(303, '/login');
}
