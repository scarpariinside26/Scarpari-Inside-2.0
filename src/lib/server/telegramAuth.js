// src/lib/server/telegramAuth.js

import { createHmac } from 'crypto';

/**
 * Chiave segreta del tuo Bot Telegram. 
 * * NOTE: Devi impostare questa variabile d'ambiente (es. TELEGRAM_BOT_TOKEN) 
 * nel tuo ambiente di hosting (Vercel) per mantenere il token segreto.
 * * Per il testing locale, puoi usare un file .env.
 */
const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;

/**
 * Verifica l'autenticità dei dati di avvio (initData) di Telegram.
 * * La verifica è fondamentale per la sicurezza: garantisce che i dati dell'utente (ID, nome)
 * non siano stati manomessi e provengano veramente da un server Telegram.
 * * @param {string} initData - La stringa di dati di avvio passata dalla Mini App.
 * @returns {{isValid: boolean, userId: string | null}} - Oggetto con stato di validità e ID utente.
 */
export function verifyTelegramAuth(initData) {
    if (!TELEGRAM_BOT_TOKEN) {
        console.error("ERRORE DI CONFIGURAZIONE: TELEGRAM_BOT_TOKEN non è definito nelle variabili d'ambiente.");
        return { isValid: false, userId: null };
    }

    // 1. Decodifica e Analizza i Dati
    const urlParams = new URLSearchParams(initData);
    
    // L'hash è l'unico elemento che dobbiamo estrarre prima di riordinare il resto.
    const hash = urlParams.get('hash');
    if (!hash) {
        console.error("Dati non validi: Hash mancante.");
        return { isValid: false, userId: null };
    }

    // 2. Raccogli e Ordina i Dati di Controllo
    const dataCheckString = Array.from(urlParams.entries())
        .filter(([key]) => key !== 'hash')
        .sort(([keyA], [keyB]) => keyA.localeCompare(keyB))
        .map(([key, value]) => `${key}=${value}`)
        .join('\n');
        
    // 3. Calcola la Chiave Segreta di Telegram (Secret Key)
    // Telegram usa un SHA256 del token del bot come chiave segreta per l'HMAC.
    const secretKey = createHmac('sha256', 'WebAppData')
        .update(TELEGRAM_BOT_TOKEN)
        .digest();

    // 4. Calcola l'Hash Previsto (Expected Hash)
    const expectedHash = createHmac('sha256', secretKey)
        .update(dataCheckString)
        .digest('hex');

    // 5. Confronto Finale
    const isValid = expectedHash === hash;
    
    if (!isValid) {
        console.error("VERIFICA FALLITA: Hash calcolato non corrisponde a hash fornito.");
    }

    // Estrai l'ID utente dal campo 'user' o 'receiver' (contiene JSON)
    let userId = null;
    const userJson = urlParams.get('user');
    if (isValid && userJson) {
        try {
            const user = JSON.parse(userJson);
            userId = user.id.toString(); // Usa l'ID Telegram come userId
        } catch (e) {
            console.error("Errore nel parsing dei dati utente JSON:", e);
        }
    }
    
    return { isValid, userId };
}

// Nota: per i test o l'uso, aggiungi un esempio di come verrebbe chiamata la funzione:
// Esempio: const { isValid, userId } = verifyTelegramAuth(req.body.initData);
