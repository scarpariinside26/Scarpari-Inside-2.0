// src/routes/+page.server.js
import { error } from '@sveltejs/kit';
// ⚠️ DEVI USARE IL TUO CLIENT SUPABASE NORMALE PER RECUPERARE QUESTI DATI
// import { supabase } from '$lib/db'; 

export async function load({ locals }) {
    // ⚠️ Esempio di come recuperare l'ID utente loggato dal server
    const loggedInUserId = locals.user?.id || 'd3adbeef-d3ad-beef-d3ad-beefd3adbeef'; 
    
    // --- SIMULAZIONE DATI EVENTI ---
    // (SOSTITUISCI CON LA TUA LOGICA SUPABASE PER RECUPERARE LA LISTA DI EVENTI)
    const MOCK_EVENTS = [
        {
            id: 'e1a2b3c4-0001-4000-8000-0123456789ab',
            title: 'Martedì da leoni... CAMPONOGAR...',
            date_time: new Date('2025-10-31T19:40:00').toISOString(),
            status_text: 'Questa settimana',
            is_owner: true, // Simula che l'utente loggato sia l'owner
            is_active: false, // Simula che la partita non sia ancora iniziata
        },
        {
            id: 'e1a2b3c4-0002-4000-8000-0123456789ab',
            title: 'Dai che è Venerdì... CAMPONOGA...',
            date_time: new Date('2025-11-04T19:40:00').toISOString(),
            status_text: 'La prossima settimana',
            is_owner: true,
            is_active: true, // Simula che la partita SIA ATTIVA (es. per il Cleanup)
            channel_id: '112233445566778899', // Canale Discord da pulire
        },
    ];
    // --- FINE SIMULAZIONE ---
    
    return {
        events: MOCK_EVENTS,
        loggedInUserId: loggedInUserId,
    };
}
