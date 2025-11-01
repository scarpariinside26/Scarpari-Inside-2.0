// src/routes/api/match-vote/+server.js

import { json } from '@sveltejs/kit';
// Se stai usando il client Supabase Admin, assicurati di importarlo
// import { createClient } from '@supabase/supabase-js'; 

// --- FUNZIONE PER GESTIRE CORS (ESSENZIALE) ---
function setCorsHeaders(response) {
    // Permette l'accesso da qualsiasi origine (*)
    response.headers.set('Access-Control-Allow-Origin', '*'); 
    // Permette i metodi utilizzati
    response.headers.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS'); 
    // Permette gli header necessari, inclusi 'Authorization' se usi JWT
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
    
    // Inizializzazione del client Supabase Admin (se necessario per scrivere i voti)
    // const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY); 

    try {
        const { eventId, voterId, votedId, score, jwt } = await request.json();

        if (!eventId || !voterId || !votedId || score === undefined || score === null) {
            const errorResponse = json({ error: "Dati di voto mancanti o incompleti." }, { status: 400 });
            setCorsHeaders(errorResponse);
            return errorResponse;
        }

        /* ================================================================
        ⚠️ LOGICA SUPABASE (Il tuo codice precedente va qui)
        
        // FASE 1: Verifica JWT (o sessione utente) con Supabase Auth
        // FASE 2: Registra il voto nella tua tabella dei voti.
        // Esempio: 
        // const { error: voteError } = await supabaseAdmin.from('votes').upsert({...});
        
        ================================================================
        */

        // Risposta di Successo Fittizia se il codice arriva qui
        const finalResponse = json({ message: `Voto ${score} registrato per il giocatore ${votedId.slice(0, 8)}.` }, { status: 200 });
        
        setCorsHeaders(finalResponse);
        return finalResponse;

    } catch (e) {
        console.error("Errore fatale nel match-vote:", e);
        
        const errorResponse = json({ error: "Errore interno del server durante l'esecuzione del voto API. Controlla i log di Vercel.", detail: e.message || 'Unknown error' }, { status: 500 });
        
        setCorsHeaders(errorResponse);
        return errorResponse;
    }
}
