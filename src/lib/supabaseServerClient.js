// Questo client è destinato ESCLUSIVAMENTE all'utilizzo lato server (es. actions, +page.server.js).
// NON deve contenere o importare alcun codice Svelte/client-side.

import { createClient } from '@supabase/supabase-js';
import { env } from '$env/static/private'; 

// Nota: In questo contesto, è comune usare la SERVICE_KEY per bypassare le RLS,
// ma l'uso della chiave anonima NON pubblica è anche possibile se l'RLS lo permette.

if (!env.SUPABASE_URL || !env.SUPABASE_SERVICE_KEY) {
    console.error('ATTENZIONE: La variabile SUPABASE_SERVICE_KEY è fondamentale per il server. Controlla il file .env.');
    throw new Error('Configurazione Supabase Server mancante.');
}

// Creiamo un client che non deve gestire la sessione tramite cookie,
// ma che può essere usato per operazioni "Admin" o generiche lato server.
export const supabaseServerClient = createClient(
    env.SUPABASE_URL,
    env.SUPABASE_SERVICE_KEY, // Usa la chiave Service Role per il massimo accesso
    { auth: { persistSession: false } } // Disabilita la persistenza della sessione (non necessaria per questo tipo di client)
);
