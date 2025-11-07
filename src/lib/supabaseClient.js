// Questo file inizializza il client Supabase da utilizzare nel browser (lato client).
// Utilizza le variabili d'ambiente pubbliche (VITE_PUBLIC_...).

import { createClient } from '@supabase/supabase-js';
import { env } from '$env/dynamic/public'; 

// === Controllo delle Variabili d'Ambiente ===
// Le variabili pubbliche sono necessarie per il client browser.
if (!env.VITE_PUBLIC_SUPABASE_URL || !env.VITE_PUBLIC_SUPABASE_ANON_KEY) {
    console.error('ERRORE: Le variabili VITE_PUBLIC_SUPABASE_URL e VITE_PUBLIC_SUPABASE_ANON_KEY devono essere impostate nel tuo file .env.');
    throw new Error('Configurazione Supabase mancante. Controlla il file .env.');
}

// === Inizializzazione del Client Supabase ===
export const supabase = createClient(
    env.VITE_PUBLIC_SUPABASE_URL,
    env.VITE_PUBLIC_SUPABASE_ANON_KEY
);

console.log("[CLIENT] Supabase Client Lato Browser Inizializzato.");
