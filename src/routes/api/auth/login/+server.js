// src/routes/api/auth/login/+server.js

import { json } from '@sveltejs/kit';
import { createClient } from '@supabase/supabase-js';
import { verifyTelegramAuth } from '$lib/server/telegramAuth.js';
import { PUBLIC_SUPABASE_URL } from '$env/static/public';
import { TELEGRAM_BOT_TOKEN, SUPABASE_SERVICE_ROLE_KEY } from '$env/static/private';

// Variabili d'ambiente lato server (private)
// La chiave Service Role è NECESSARIA per creare utenti e custom token lato server.
if (!SUPABASE_SERVICE_ROLE_KEY) {
    throw new Error('SUPABASE_SERVICE_ROLE_KEY non è configurata. Impossibile eseguire l\'autenticazione server-side.');
}

// 1. Inizializzazione del client Supabase con Service Role (PERICOLOSO: USALO SOLO LATO SERVER!)
const supabaseAdmin = createClient(
    PUBLIC_SUPABASE_URL,
    SUPABASE_SERVICE_ROLE_KEY,
    {
        auth: {
            // Impedisce al client admin di usare il localStorage/cookie, forzando solo l'uso server-side.
            persistSession: false 
        }
    }
);

/**
 * Gestisce la richiesta POST di autenticazione da Telegram Mini App.
 * Riceve l'initData e restituisce un Custom Token Supabase.
 * @type {import('./$types').RequestHandler}
 */
export async function POST({ request }) {
    try {
        const { initData } = await request.json();

        if (!initData) {
            return json({ message: 'Dati di avvio Telegram (initData) mancanti.' }, { status: 400 });
        }

        // 2. Verifica l'autenticità dei dati di Telegram
        const { isValid, userId } = verifyTelegramAuth(initData);

        if (!isValid || !userId) {
            console.warn("Tentativo di accesso non valido rilevato.");
            return json({ message: 'Autenticazione Telegram fallita. Hash non valido.' }, { status: 401 });
        }

        // 3. Estrazione dei dettagli utente per la creazione/aggiornamento del profilo
        // Dobbiamo estrarre il nome e l'email dall'initData per aggiornare il profilo Supabase.
        // Questo passaggio garantisce che i dettagli utente siano sincronizzati.
        const urlParams = new URLSearchParams(initData);
        const userJson = urlParams.get('user');
        let userDetails = {};
        if (userJson) {
            userDetails = JSON.parse(userJson);
        }
        
        // Telegram ID (userId) è l'identificatore univoco del nostro utente su Supabase (sotto 'raw_user_meta_data')
        const telegram_id = userId; 
        const user_email = `${telegram_id}@telegram.mini.app`; // Email fittizia

        // 4. Upsert dell'utente su Supabase
        // Usiamo un ID custom (telegram_id) che viene inserito come parte dei metadati.
        // Questa non è una creazione Auth vera e propria, ma un modo per ottenere un token valido.

        // Supabase non supporta nativamente "login by external_id", quindi usiamo il Service Role per
        // l'autenticazione tramite Custom Claims o, più semplicemente, generiamo un token.
        
        // 5. Generazione del Custom Token Supabase (il metodo più sicuro)
        // Creiamo un token che identifica l'utente con il suo ID Telegram.
        // Supabase creerà o loggherà l'utente al momento del consumo del token.
        const { data: tokenData, error: tokenError } = await supabaseAdmin.auth.admin.generateUserToken(telegram_id, {
            // Aggiungiamo i metadati utente per la creazione (se l'utente non esiste)
            // L'ID utente qui sarà l'ID Telegram.
            gotrue_meta_data: { 
                email: user_email,
                user_name: userDetails.username,
                full_name: userDetails.first_name + (userDetails.last_name ? ' ' + userDetails.last_name : ''),
                telegram_id: telegram_id // Manteniamo l'ID Telegram come riferimento nel metadato
            }
        });

        if (tokenError) {
            console.error('Errore nella generazione del token Supabase:', tokenError);
            return json({ message: `Errore del server Supabase: ${tokenError.message}` }, { status: 500 });
        }

        // 6. Aggiornamento del profilo utente nel database 'profili_utenti' (se necessario)
        // Questo è il tuo database custom per i profili.
        const { error: profileError } = await supabaseAdmin
            .from('profili_utenti')
            .upsert({
                user_id: telegram_id, // Usiamo l'ID Telegram come chiave primaria
                email: user_email,
                nome_completo: userDetails.first_name + (userDetails.last_name ? ' ' + userDetails.last_name : ''),
                telefono: userDetails.phone_number || null, // Aggiungi telefono se disponibile
                // Aggiungi qui altri campi di profilo che vuoi sincronizzare
            }, { 
                onConflict: 'user_id', // Chiave di conflitto: ID utente Telegram
                ignoreDuplicates: false 
            });

        if (profileError) {
            // Nota: L'autenticazione ha successo, ma c'è un errore nel DB del profilo.
            console.error("Attenzione: Errore nell'upsert del profilo utente:", profileError);
            // Non blocchiamo il login ma logghiamo l'errore.
        }

        // 7. Successo: Restituisce il token di accesso
        return json({ 
            message: 'Autenticazione riuscita',
            accessToken: tokenData.token, // Questo è il Custom Token Supabase
            telegramId: telegram_id 
        });

    } catch (e) {
        console.error('Errore critico durante la POST di login:', e);
        return json({ message: 'Errore interno del server.' }, { status: 500 });
    }
}
