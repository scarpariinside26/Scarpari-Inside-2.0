import { redirect, error } from '@sveltejs/kit';
import { createClient } from '@supabase/supabase-js';
import * as crypto from 'crypto';

// ⚠️ SOSTITUISCI CON L'EMAIL VERA DI DENIS FURIATO
const ADMIN_EMAIL = 'denis.furiato@gmail.com'; 

// --- 1. CONFIGURAZIONE AMBIENTE E CLIENTE ADMIN ---
// Variabili essenziali per il login Telegram (Devono esistere su Vercel!)
const SUPABASE_URL = process.env.PUBLIC_SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;

// Verifica di sicurezza all'avvio del server
if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY || !TELEGRAM_BOT_TOKEN) {
    console.error('Mancano variabili d\'ambiente essenziali per l\'autenticazione (Supabase o Telegram).');
    throw new Error('Errore di configurazione del server.');
}

// Inizializza il client Supabase con la Service Role Key per l'accesso amministrativo
// Necessario per l'upsert del profilo e la generazione del JWT personalizzato.
const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
    auth: {
        autoRefreshToken: false,
        persistSession: false
    }
});


/**
 * @type {import('./$types').PageServerLoad}
 */
export async function load({ locals, url }) {
    // --- PARTE A: GESTIONE LOGIN TELEGRAM (PRIORITARIA) ---

    const params = Object.fromEntries(url.searchParams);
    const { hash, ...data } = params;

    // Se hash e dati essenziali di Telegram sono presenti, tentiamo il login.
    if (hash && data.id && data.auth_date) {
        try {
            const isValid = verifyTelegramAuth(data, hash, TELEGRAM_BOT_TOKEN);

            if (!isValid) {
                console.error('Login Telegram fallito: Firma hash non valida.');
                throw error(401, 'Accesso non autorizzato: firma di Telegram non valida.');
            }

            // --- L'autenticazione Telegram è valida ---

            const { id, first_name, last_name, username, photo_url } = data;
            const tg_id = parseInt(id);

            // 1. Aggiorna o crea il profilo utente nella tabella 'profiles' con il client Admin
            const { error: upsertError } = await supabaseAdmin
                .from('profili_utenti')
                .upsert(
                    {
                        telegram_id: tg_id, // Usiamo telegram_id come ID univoco di Telegram
                        nome_completo: `${first_name} ${last_name || ''}`.trim(),
                        username: username || null,
                        photo_url: photo_url || null,
                        last_login: new Date().toISOString()
                        // Nota: il campo 'id' (UUID di Supabase Auth) verrà popolato dalla RPC
                    },
                    { 
                        onConflict: 'telegram_id', // Conflitto su ID Telegram
                        ignoreDuplicates: false 
                    }
                );

            if (upsertError) {
                console.error('Supabase Upsert Error:', upsertError.message);
                throw error(500, 'Errore interno: salvataggio del profilo fallito.');
            }
            
            // 2. Chiama la funzione RPC per creare/ottenere l'utente Supabase Auth e generare il JWT
            const { data: jwtData, error: jwtError } = await supabaseAdmin.rpc('sso_login_tg', {
                telegram_id: tg_id,
                user_email: `${tg_id}@telegram.id`, // Email fittizia per Supabase Auth
                user_display_name: username || first_name
            });

            if (jwtError || !jwtData || !jwtData.token) {
                console.error('Supabase JWT Generation Error:', jwtError ? jwtError.message : 'Dati JWT mancanti.');
                throw error(500, 'Errore nel servizio di autenticazione (RPC mancante o fallito).');
            }

            // Restituisce il token al client per stabilire la sessione Supabase
            // Il client in +layout.svelte deve poi reindirizzare o pulire l'URL.
            return {
                supabaseToken: jwtData.token,
                isAuthenticated: true
            };

        } catch (e) {
            // Se l'errore non è di tipo SvelteKit (es. 401/500), lo solleviamo come 500 generico
            if (e.status) throw e;
            console.error("Errore durante il login Telegram:", e);
            throw error(500, 'Errore sconosciuto durante il login.');
        }
    }


    // --- PARTE B: LOGICA DI CARICAMENTO DATI ESISTENTE (TUA LOGICA) ---
    
    const supabase = locals.supabase;
    const session = await locals.getSession();
    const profile = locals.profile; // Questo è il 'profili_utenti' collegato

    // Se l'utente ha tentato il login Telegram ma non ha una sessione attiva (e non siamo in un redirect post-token),
    // o se non ha mai effettuato l'accesso, profile e session saranno null.
    // L'UI si aspetta che la sessione sia stabilita per mostrare i dati.

    // --- 1. Identificazione Admin e Utente Corrente ---
    let isAdmin = false;
    let currentUserId = null;
    let currentProfileId = null;

    if (session && profile) {
        currentUserId = session.user.id; // auth.users.id
        currentProfileId = profile.id;   // profili_utenti.id
        
        // Determina il ruolo di amministratore
        isAdmin = profile.tipo_profilo === 'amministratore' || profile.email === ADMIN_EMAIL;
    } 
    
    // Se non loggato, la UI dovrebbe mostrare solo l'interfaccia di login.
    // Restituiamo dati vuoti per evitare errori nel frontend (es. tentativi di accesso a .id)
    if (!currentUserId) {
        return { liveEvent: null, teams: [], isAdmin: false, user: { id: null, profileId: null } };
    }


    // --- 2. Trova l'Evento Live Più Recente ---
    const { data: latestEvent } = await supabase
        .from('eventi')
        .select('*, luogo:luogo_partita') 
        .order('data', { ascending: false })
        .limit(1)
        .maybeSingle();

    if (!latestEvent) {
        return { liveEvent: null, teams: [], isAdmin, user: { id: currentUserId, profileId: currentProfileId } };
    }

    const liveEventId = latestEvent.id;

    // --- 3. Carica Roster, Dettagli Giocatore e Voti Medi (per la homepage) ---
    const { data: rosterData } = await supabase
        .from('tournament_rosters')
        .select(`
            team_name,
            profili_utenti!user_id (
                id, nome_completo, user_id, 
                portiere, difensore, centrocampista, attaccante, 
                classifiche(media_voto) 
            )
        `)
        .eq('event_id', liveEventId)
        .eq('profili_utenti.is_approved', true); // Mostra solo giocatori approvati

    // --- 4. Carica Numero di Conferme (partecipazioni) ---
    const { count: confirmedCount } = await supabase
        .from('partecipazioni')
        .select('*', { count: 'exact' })
        .eq('evento_id', liveEventId)
        .eq('stato', 'confermato'); // Assumiamo che 'confermato' sia lo stato giusto

    // --- 5. Riorganizza i dati in formato App (Teams Array) ---
    const teamsMap = new Map();
    const teamColors = {
        'Team Rosso': '#FF4136',
        'Team Blu': '#0074D9',
        'Team Verde': '#2ECC40',
        'Team Giallo': '#FFDC00',
    };

    if (rosterData) {
        rosterData.forEach(item => {
            const teamName = item.team_name;
            const player = item.profili_utenti;
            
            // Determina il ruolo e il rating (media_voto)
            let role = 'Gioc.';
            if (player.portiere) role = 'Por';
            else if (player.attaccante) role = 'Att';
            else if (player.centrocampista) role = 'Cen';
            else if (player.difensore) role = 'Dif';

            // Gestione dei voti (potrebbe essere necessario accedere a classifiche[0].media_voto)
            const rating = player.classifiche?.[0]?.media_voto || 6.0; 

            if (!teamsMap.has(teamName)) {
                teamsMap.set(teamName, {
                    id: teamName,
                    name: teamName,
                    color: teamColors[teamName] || '#AAAAAA',
                    players: []
                });
            }

            teamsMap.get(teamName).players.push({
                name: player.nome_completo,
                profile_id: player.id,    // profili_utenti.id
                user_id: player.user_id, // auth.users.id (CRUCIALE per i voti)
                role: role,
                rating: rating
            });
        });
    }
    
    // Riporta i dati al frontend
    return {
        liveEvent: {
            id: latestEvent.id,
            title: latestEvent.titolo || 'Partita Settimanale', 
            date: latestEvent.data,
            time: latestEvent.ora || '20:00', 
            location: latestEvent.luogo || 'Campo Sconosciuto', 
            description: latestEvent.descrizione || '', 
            confirmed: confirmedCount,
            total: latestEvent.max_partecipanti || 16, 
        },
        teams: Array.from(teamsMap.values()),
        isAdmin,
        user: { id: currentUserId, profileId: currentProfileId }
    };
}


/**
 * Verifica la firma hash dei dati di login di Telegram.
 * @param {Record<string, string>} data I dati ricevuti da Telegram (senza 'hash')
 * @param {string} hash La firma hash calcolata dal widget di Telegram
 * @param {string} botToken Il token segreto del bot Telegram
 * @returns {boolean} Vero se la firma è valida
 */
function verifyTelegramAuth(data, hash, botToken) {
    // 1. Preparazione della stringa di dati: 'chiave1=valore1\nchiave2=valore2\n...' (ordinate alfabeticamente)
    const dataCheckString = Object.keys(data)
        .filter(key => key !== 'hash') 
        .sort()
        .map(key => `${key}=${data[key]}`)
        .join('\n');

    // 2. Calcolo della chiave segreta (SHA256(bot_token))
    const secretKey = crypto.createHash('sha256')
        .update(botToken)
        .digest();

    // 3. Calcolo dell'hash (HMAC-SHA256)
    const hmac = crypto.createHmac('sha256', secretKey)
        .update(dataCheckString)
        .digest('hex');

    // 4. Confronto
    // Confronta l'hash calcolato con l'hash fornito dal client.
    return hmac === hash;
}
