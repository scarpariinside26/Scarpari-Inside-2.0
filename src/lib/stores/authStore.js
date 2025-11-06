import { writable } from 'svelte/store';

// L'utente viene inizializzato a null. Contiene l'oggetto user di Supabase quando loggato.
// Deve essere PURE JAVASCRIPT per evitare errori di build.
export const user = writable(null);
