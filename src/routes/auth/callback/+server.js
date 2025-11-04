import { redirect } from '@sveltejs/kit';

/**
 * Endpoint del server per gestire il reindirizzamento di Supabase dopo l'autenticazione OAuth.
 * Questo endpoint cattura il 'code', lo scambia per una sessione E si assicura che il profilo esista.
 *
 * @type {import('./$types').RequestHandler}
 */
export async function GET({ url, locals }) { 
    
    const code = url.searchParams.get('code');
    // Prende la destinazione originale o usa '/' come fallback
    const redirectTo = url.searchParams.get('from') || '/'; 

    // 1. GESTIONE SCAMBIO CODICE E SESSIONE
    if (code) {
        // Questo imposta il cookie di sessione nel browser
        const { data: sessionData, error: sessionError } = await locals.supabase.auth.exchangeCodeForSession(code);

        if (sessionError) {
            console.error('SERVER ERROR: Errore durante lo scambio del codice OAuth:', sessionError.message);
            throw redirect(303, '/login?error=' + encodeURIComponent(sessionError.message));
        }

        const user = sessionData?.session?.user;

        // 2. CREAZIONE/AGGIORNAMENTO DEL PROFILO (Upsert)
        if (user && locals.supabaseAdmin) {
            
            // Usiamo supabaseAdmin (Service Key) per garantire l'inserimento del profilo
            // indipendentemente da RLS, basandoci sui dati di autenticazione.

            const { error: profileError } = await locals.supabaseAdmin
                .from('profili_utenti')
                .upsert(
                    {
                        user_id: user.id,
                        email: user.email,
                        // Il nome completo (full_name) arriva di solito dall'OAuth provider (es. Google)
                        nome_completo: user.user_metadata.full_name || user.user_metadata.name || 'Nome Utente',
                        // Inserisci qui altri campi iniziali se necessari (es. username, avatar_url)
                    },
                    { onConflict: 'user_id', ignoreDuplicates: false } // Usa onConflict per upserting
                );

            if (profileError) {
                // Questo è l'errore che potrebbe essere apparso come "Errore nell'inserimento del profilo: Object"
                console.error('SERVER ERROR: Errore durante l\'upsert del profilo:', profileError.message);
                // Non blocchiamo il reindirizzamento, ma logghiamo l'errore critico
            } else {
                console.log(`SERVER SUCCESS: Profilo creato/aggiornato per ${user.email}`);
            }
        }

        // 3. REINDIRIZZAMENTO AL DASHBOARD
        // L'inserimento del profilo è gestito, reindirizziamo alla destinazione.
        throw redirect(303, redirectTo);
    }

    // 4. GESTIONE ERRORI GENERICI (se non c'è 'code')
    if (url.searchParams.has('error')) {
        const errorDescription = url.searchParams.get('error_description') || 'Errore di autenticazione social sconosciuto.';
        console.error('SERVER ERROR: Errore di autenticazione social:', errorDescription);
        throw redirect(303, '/login?error=' + encodeURIComponent(errorDescription));
    }

    // Default: reindirizza al login se non c'è né codice né errore
    throw redirect(303, '/login');
}
