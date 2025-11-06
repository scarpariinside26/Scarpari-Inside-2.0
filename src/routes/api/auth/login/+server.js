import { json, error } from '@sveltejs/kit';
// *** CORREZIONE QUI ***: Usiamo SUPABASE_SERVICE_KEY come definito in Vercel.
import { SUPABASE_SERVICE_KEY } from '$env/static/private';
// Assumiamo che PUBLIC_SUPABASE_URL sia statico e pubblico
import { PUBLIC_SUPABASE_URL } from '$env/static/public';
import { createClient } from '@supabase/supabase-js';

// Crea un client Supabase con la Service Key (ex Service Role Key)
const supabaseAdmin = createClient(PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_KEY, {
    auth: {
        autoRefreshToken: false,
        persistSession: false
    }
});

// --- FUNZIONE MOCK PER LA VERIFICA DEL TOKEN ESTERNO (ES. TELEGRAM) ---
// In un ambiente reale, questa funzione dovrebbe fare una chiamata API esterna 
// o usare il segreto di Telegram per verificare l'integrità del 'token'.
async function verifyExternalToken(token) {
    // Logica di verifica complessa...
    if (token === "valid_telegram_sso_token") {
        return {
            valid: true,
            external_user_id: 'telegram_12345678', // L'ID utente univoco fornito dall'SSO
            username: 'UtenteTelegramSSO'
        };
    }
    return { valid: false };
}
// ------------------------------------------------------------------------

/** @type {import('./$types').RequestHandler} */
export async function POST({ request, locals }) {
    try {
        const data = await request.json();
        
        const { token } = data;
        
        if (!token) {
            throw error(400, 'Missing authentication token.');
        }

        // 1. Verifica il token SSO esterno
        const verificationResult = await verifyExternalToken(token);

        if (!verificationResult.valid) {
            throw error(401, 'Invalid or expired external authentication token.');
        }

        const { external_user_id, username } = verificationResult;

        // 2. Utilizza supabaseAdmin per aggiornare o creare l'utente nel tuo database
        // Nota: Non possiamo creare utenti direttamente in auth.users senza un'email/password,
        // ma possiamo gestire il profilo in una tabella 'profiles' pubblica.
        // Questo è il punto in cui dimostriamo l'uso della Service Key.

        const { data: profile, error: upsertError } = await supabaseAdmin
            .from('profiles')
            .upsert(
                { 
                    id: external_user_id, // Usiamo l'ID esterno come chiave primaria
                    username: username,
                    last_login: new Date().toISOString()
                },
                { onConflict: 'id' } // Se l'ID esiste, aggiorna invece di inserire
            )
            .select()
            .single();

        if (upsertError) {
            console.error('Supabase Upsert Error:', upsertError);
            throw error(500, 'Failed to process user profile via admin client.');
        }

        // 3. Risposta: L'utente è stato verificato e il profilo è aggiornato.
        // Ora il client deve usare un metodo alternativo (es. Custom JWT o link) 
        // per stabilire una sessione Supabase sul lato client.
        
        return json({ 
            success: true, 
            message: "External token validated and user profile updated.",
            user_id: external_user_id,
            profile: profile
        });

    } catch (e) {
        // Gestione degli errori di tipo 'error' di SvelteKit o errori generici
        if (e.status) {
            throw e; // Rilancia errori SvelteKit con stato (400, 401, ecc.)
        }
        console.error('API Error in login endpoint:', e);
        throw error(500, 'Internal server error: Check server logs and environment variables.');
    }
}
