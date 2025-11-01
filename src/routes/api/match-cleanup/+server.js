// src/routes/api/match-cleanup/+server.js

import { json } from '@sveltejs/kit';
// Se stai usando il client Supabase Admin, assicurati di importarlo
// import { createClient } from '@supabase/supabase-js'; 

// --- FUNZIONE PER GESTIRE CORS (ESSENZIALE) ---
function setCorsHeaders(response) {
    // Permette l'accesso da qualsiasi origine
    response.headers.set('Access-Control-Allow-Origin', '*'); 
    // Permette i metodi utilizzati
    response.headers.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS'); 
    // Permette gli header necessari
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization'); 
}

// ----------------------------------------------------------------------
// 1. GESTIONE DELLA PRE-FLIGHT (OPTIONS)
// Necessario affinché il browser autorizzi la richiesta POST
export async function OPTIONS() {
    const response = new Response(null, { status: 204 }); // 204 No Content
    setCorsHeaders(response);
    return response;
}
// ----------------------------------------------------------------------


// ----------------------------------------------------------------------
// 2. GESTIONE DELLA RICHIESTA POST
export async function POST({ request, url }) {
    
    // Inizializzazione del client Supabase Admin (se non usi un file utils)
    // const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY); 

    try {
        const { eventId, matchOwnerId, channelId } = await request.json();

        if (!eventId || !matchOwnerId || !channelId) {
            const errorResponse = json({ error: "Dati mancanti: eventId, matchOwnerId o channelId sono obbligatori per il cleanup." }, { status: 400 });
            setCorsHeaders(errorResponse);
            return errorResponse;
        }

        /* ================================================================
        ⚠️ LOGICA SUPABASE/DISCORD (Il tuo codice precedente va qui)
        
        // FASE 1: Chiama le API Discord per eliminare il canale/ruoli utilizzando channelId
        // Esempio: const discordResponse = await fetch('DISCORD_API_URL', ...); 

        // FASE 2: Aggiorna lo stato dell'evento su Supabase (es. impostando is_active=false)
        // const { error: updateError } = await supabaseAdmin...
        
        ================================================================
        */

        // Risposta di Successo Fittizia se il codice arriva qui
        const finalResponse = json({ message: `Cleanup avviato per l'evento ${eventId.slice(0, 8)} nel canale ${channelId}.` }, { status: 200 });
        
        setCorsHeaders(finalResponse);
        return finalResponse;

    } catch (e) {
        console.error("Errore fatale nel match-cleanup:", e);
        
        const errorResponse = json({ error: "Errore interno del server durante l'esecuzione del cleanup API. Controlla i log di Vercel.", detail: e.message || 'Unknown error' }, { status: 500 });
        
        setCorsHeaders(errorResponse);
        return errorResponse;
    }
}
