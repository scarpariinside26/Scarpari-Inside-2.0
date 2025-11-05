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

/** @type {import('./$types').RequestHandler} */
export async function POST({ request, locals }) {
    try {
        const data = await request.json();
        
        // Esempio: Se stai gestendo un token SSO di Telegram qui
        const { token } = data;
        
        if (!token) {
            throw error(400, 'Missing authentication token.');
        }

        // Qui dovrebbe esserci la tua logica che utilizza 'supabaseAdmin' 
        // per verificare o generare una sessione utente privilegiata.
        
        // Placeholder di risposta (sostituisci con la tua logica API reale)
        return json({ 
            success: true, 
            message: "Token received and processed by admin server.",
            // In un caso reale, qui potresti tornare il JWT di Supabase generato
        });

    } catch (e) {
        console.error('API Error in login endpoint:', e);
        throw error(500, 'Internal server error: Check server logs and environment variables.');
    }
}
