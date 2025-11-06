// Questo file inizializza il client Supabase.
// ATTENZIONE: Devi sostituire i placeholder con le tue credenziali Supabase.

import { createClient } from '@supabase/supabase-js';

// ** DA SOSTITUIRE CON LE TUE CREDENZIALI SUPABASE **
// Se stai utilizzando SvelteKit, è fortemente consigliato usare variabili d'ambiente 
// (ad esempio, VITE_PUBLIC_SUPABASE_URL e VITE_PUBLIC_SUPABASE_ANON_KEY).
const SUPABASE_URL = 'INSERISCI_QUI_IL_TUO_SUPABASE_PROJECT_URL';
const SUPABASE_ANON_KEY = 'INSERISCI_QUI_LA_TUA_CHIAVE_PUBBLICA_ANONIMA';

// Inizializza il client Supabase
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

console.log("Supabase Client Inizializzato. Ricorda di inserire le tue credenziali reali.");
