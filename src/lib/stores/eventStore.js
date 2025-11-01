// src/lib/stores/eventStore.js
import { writable } from 'svelte/store';

// Stato iniziale
const initialState = {
    isOpen: false,
    eventData: null // Qui memorizzeremo i dati dell'evento da mostrare
};

// Creazione dello store
const { subscribe, set, update } = writable(initialState);

export const eventStore = {
    subscribe,
    /** Apre la modale con i dati dell'evento */
    openModal: (data) => set({ isOpen: true, eventData: data }),
    /** Chiude la modale */
    closeModal: () => set(initialState),
    /** Funzione fittizia per simulare la modifica dell'evento */
    updateEvent: (updatedData) => {
        // Logica fittizia di salvataggio
        console.log('Evento aggiornato:', updatedData);
        // Puoi aggiungere qui la logica di aggiornamento reale se necessario
    }
};
