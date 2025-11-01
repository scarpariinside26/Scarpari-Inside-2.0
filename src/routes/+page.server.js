// src/routes/+page.server.js

import { error } from '@sveltejs/kit';

export async function load({ locals }) {
    
    // Simula l'ID dell'utente loggato (per i pulsanti Admin)
    const loggedInUserId = locals.user?.id || 'TEST_ADMIN_USER_UUID'; 
    
    // --- SIMULAZIONE DATI EVENTI ---
    const MOCK_EVENTS = [
        {
            id: 'e1a2b3c4-0001-4000-8000-0123456789ab',
            title: 'Martedì Prova: Partita Non Avviata',
            date_time: new Date().toISOString(),
            status_text: 'Questa settimana',
            is_owner: true, 
            is_active: false, 
        },
        {
            id: 'e1a2b3c4-0002-4000-8000-0123456789ab',
            title: 'Venerdì Test: Partita Attiva',
            date_time: new Date(Date.now() + 86400000).toISOString(),
            status_text: 'Domani',
            is_owner: true, 
            is_active: true, 
            channel_id: '112233445566778899', 
        },
    ];
    // --- FINE SIMULAZIONE ---
    
    return {
        events: MOCK_EVENTS,
        loggedInUserId: loggedInUserId,
    };
}
