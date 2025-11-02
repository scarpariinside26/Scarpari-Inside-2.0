// src/routes/+page.server.js - VERSIONE FINALE CON LOGICA ROSTER E ADMIN CORRETTA
import { redirect } from '@sveltejs/kit';

// ⚠️ SOSTITUISCI CON L'EMAIL VERA DI DENIS FURIATO
const ADMIN_EMAIL = 'denis.furiato@example.com'; 

/** @type {import('./$types').PageServerLoad} */
export async function load({ locals }) {
    const supabase = locals.supabase;
    const session = await locals.getSession();
    const profile = locals.profile;

    // --- 1. Identificazione Admin e Utente Corrente ---
    let isAdmin = false;
    let currentUserId = null;
    let currentProfileId = null;

    if (session && profile) {
        currentUserId = session.user.id; // auth.users.id
        currentProfileId = profile.id;   // profili_utenti.id
        
        // Determina il ruolo di amministratore
        isAdmin = profile.tipo_profilo === 'amministratore' || profile.email === ADMIN_EMAIL;
    } 

    // --- 2. Trova l'Evento Live Più Recente ---
    const { data: latestEvent } = await supabase
        .from('eventi')
        .select('*, luogo:luogo_partita') // Assumiamo luogo_partita se luogo non esiste
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
                id, nome_completo, user_id, // DEVI PRENDERE user_id DA profili_utenti PER I VOTI
                portiere, difensore, centrocampista, attaccante, 
                classifiche(media_voto) // Carica la media voto dalla classifica
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
                profile_id: player.id,    // profili_utenti.id
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
            title: latestEvent.titolo || 'Partita Settimanale', // Assumiamo un campo titolo
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
