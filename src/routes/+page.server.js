// src/routes/+page.server.js

import { error } from '@sveltejs/kit';

// ⚠️ Questo codice non usa il client Supabase Admin, usa una simulazione
// per garantire che il deploy passi senza problemi di chiavi e logica di connessione.

export async function load({ locals }) {
    
    // Simula l'ID dell'utente loggato (necessario per i pulsanti Admin nella dashboard)
    // Sostituisci 'TEST_ADMIN_USER_UUID' con locals.session.user.id nel tuo progetto reale
    const loggedInUserId = locals.user?.id || 'TEST_ADMIN_USER_UUID'; 
    
    // --- SIMULAZIONE DATI EVENTI ---
    const MOCK_EVENTS = [
        {
            id: 'e1a2b3c4-0001-4000-8000-0123456789ab',
            title: 'Martedì Prova: Partita Non Avviata',
            date_time: new Date().toISOString(),
            status_text: 'Questa settimana',
            is_owner: true, // Questo ti rende l'Admin per vedere i pulsanti
            is_active: false, // Permette il pulsante "Setup"
        },
        {
            id: 'e1a2b3c4-0002-4000-8000-0123456789ab',
            title: 'Venerdì Test: Partita Attiva',
            date_time: new Date(Date.now() + 86400000).toISOString(),
            status_text: 'Domani',
            is_owner: true, // Questo ti rende l'Admin per vedere i pulsanti
            is_active: true, // Permette il pulsante "Cleanup"
            channel_id: '112233445566778899', // ID fittizio del canale per il cleanup
        },
    ];
    // --- FINE SIMULAZIONE ---
    
    return {
        events: MOCK_EVENTS,
        loggedInUserId: loggedInUserId,
    };
}
