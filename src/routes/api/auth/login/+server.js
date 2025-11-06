import { createHmac } from 'crypto';
// Importiamo la variabile d'ambiente dal contesto SvelteKit/Vercel (static/private)
import { TELEGRAM_BOT_TOKEN } from '$env/static/private';


/**
 * Verifica l'autenticità dei dati di avvio (initData) di Telegram.
 * * La verifica è fondamentale per la sicurezza: garantisce che i dati dell'utente (ID, nome)
 * non siano stati manomessi e provengano veramente da un server Telegram.
 * * @param {string} initData - La stringa di dati di avvio passata dalla Mini App.
 * @returns {{isValid: boolean, userId: string | null, username: string | null}} - Oggetto con stato di validità, ID utente e Username.
 */
export function verifyTelegramAuth(initData) {
    if (!TELEGRAM_BOT_TOKEN) {
        // Se si verifica in locale, assicurarsi che TELEGRAM_BOT_TOKEN sia nel .env
        console.error("ERRORE DI CONFIGURAZIONE: TELEGRAM_BOT_TOKEN non è definito (Controlla $env/static/private).");
        return { isValid: false, userId: null, username: null };
    }

    // 1. Decodifica e Analizza i Dati
    const urlParams = new URLSearchParams(initData);
    
    const hash = urlParams.get('hash');
    if (!hash) {
        console.error("Dati non validi: Hash mancante.");
        return { isValid: false, userId: null, username: null };
    }

    // 2. Raccogli e Ordina i Dati di Controllo
    // Filtra 'hash' e ricrea la stringa di controllo ordinata alfabeticamente
    const dataCheckString = Array.from(urlParams.entries())
        .filter(([key]) => key !== 'hash')
        .sort(([keyA], [keyB]) => keyA.localeCompare(keyB))
        .map(([key, value]) => `${key}=${value}`)
        .join('\n');
        
    // 3. Calcola la Chiave Segreta (Secret Key)
    // Chiave radice: SHA256 del token del bot, usato per l'HMAC.
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

    // 6. Estrai ID e Nome Utente solo se valido
    let userId = null;
    let username = null;
    
    const userJson = urlParams.get('user');
    
    if (isValid && userJson) {
        try {
            const user = JSON.parse(userJson);
            userId = user.id.toString(); 
            // Preferiamo 'username' ma usiamo 'first_name' se il campo è assente
            username = user.username || user.first_name || 'Utente TG'; 
        } catch (e) {
            console.error("Errore nel parsing dei dati utente JSON:", e);
        }
    }
    
    return { isValid, userId, username };
}
