// src/routes/api/match-setup/+server.js

import { json } from '@sveltejs/kit';
// Assicurati che 'createClient' sia importato correttamente se lo stai usando
// import { createClient } from '@supabase/supabase-js'; 

// ⚠️ Se usi variabili d'ambiente locali, definiscile qui
// const SUPABASE_URL = process.env.SUPABASE_URL;
// const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY;
// const DISCORD_TOKEN = process.env.DISCORD_TOKEN;


// --- FUNZIONE PER GESTIRE CORS (ESSENZIALE per l'errore di rete) ---
function setCorsHeaders(response) {
    // Permette l'accesso da qualsiasi origine (*)
    response.headers.set('Access-Control-Allow-Origin', '*'); 
    // Permette i metodi che usiamo (GET, POST) e OPTIONS (il check del browser)
    response.headers.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS'); 
    // Permette gli header utilizzati nella chiamata fetch del Frontend
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization'); 
}

// ----------------------------------------------------------------------
// 1. GESTIONE DELLA PRE-FLIGHT (OPTIONS)
// Il browser invia questo metodo PRIMA del POST per verificare i permessi CORS
export async function OPTIONS() {
    const response = new Response(null, { status: 204 }); // 204 No Content
    setCorsHeaders(response);
    return response;
}
// ----------------------------------------------------------------------


// ----------------------------------------------------------------------
// 2. GESTIONE DELLA RICHIESTA POST
export async function POST({ request, url }) {
    
    // Inizializzazione del client (scommenta quando necessario, usa le tue variabili ENV)
    // const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY); 

    try {
        const { eventId, matchOwnerId } = await request.json();

        if (!eventId || !matchOwnerId) {
            const errorResponse = json({ error: "Dati mancanti: eventId o matchOwnerId sono obbligatori." }, { status: 400 });
            setCorsHeaders(errorResponse);
            return errorResponse;
        }

        /* ================================================================
        ⚠️ LOGICA SUPABASE/DISCORD (Il tuo codice precedente va qui)
        
        // FASE 1: Recupera i dati dell'evento e il roster da Supabase
        // (QUI SI ERA VERIFICATO L'ERRORE "Errore nel recupero dei partecipanti.")
        // const { data: eventData, error: dbError } = await supabaseAdmin...

        // FASE 2: Chiama le API Discord per creare canale/ruoli
        // Esempio: const discordResponse = await fetch('DISCORD_API_URL', ...); 

        // FASE 3: Aggiorna lo stato dell'evento su Supabase
        // const { error: updateError } = await supabaseAdmin...
        
        ================================================================
        */

        // Risposta di Successo se il codice arriva qui (altrimenti viene catturato da catch)
        const finalResponse = json({ message: `Setup avviato per l'evento ${eventId.slice(0, 8)}.` }, { status: 200 });
        
        setCorsHeaders(finalResponse);
        return finalResponse;

    } catch (e) {
        console.error("Errore fatale nel match-setup:", e);
        
        const errorResponse = json({ error: "Errore interno del server durante l'esecuzione del setup API. Controlla i log di Vercel.", detail: e.message || 'Unknown error' }, { status: 500 });
        
        setCorsHeaders(errorResponse);
        return errorResponse;
    }
}
