import { SUPABASE_URL, SUPABASE_SERVICE_KEY, DISCORD_GUILD_ID } from '$env/dynamic/private';
import { createClient } from '@supabase/supabase-js';
import { createTemporaryChannel, setupChannelAndRoles } from '$lib/server/discord-api';

const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY, {
    auth: {
        autoRefreshToken: false,
        persistSession: false,
    },
});

const TEAM_NAMES = ['Rossa', 'Blu', 'Gialla', 'Nera'];

/**
 * Funzione di utilità per dividere i giocatori in 4 squadre (casuale semplice)
 */
function assignTeams(players) {
    players.sort(() => Math.random() - 0.5); // Mescola
    
    // Assegna a rotazione
    return players.map((player, index) => ({
        ...player,
        team_name: TEAM_NAMES[index % TEAM_NAMES.length],
    }));
}

/**
 * Endpoint POST: Avvia la configurazione della partita e del canale Discord
 */
export async function POST({ request }) {
    try {
        const { eventId, matchOwnerId } = await request.json(); 

        if (!eventId || !matchOwnerId) {
            return new Response(JSON.stringify({ error: 'Missing eventId or matchOwnerId' }), { status: 400 });
        }
        
        // ===================================================================
        // PASSO 1: Ottieni i giocatori Convocati e i loro Discord ID (QUERY CORRETTA)
        // ===================================================================
        
        const { data: participationData, error: participationError } = await supabaseAdmin
            .from('partecipazioni') // <--- NOME TABELLA DI COLLEGAMENTO
            .select(`
                utente_id, 
                profili_utenti:utente_id (discord_id) 
            `) 
            .eq('evento_id', eventId)
            .eq('stato', 'confermato'); // Assumiamo che solo i 'confermati' giochino

        if (participationError) {
            console.error('Errore query Supabase:', participationError);
            throw new Error('Errore nel recupero dei partecipanti.');
        }

        const players = participationData
            .filter(p => p.profili_utenti?.discord_id) 
            .map(p => ({
                user_id: p.utente_id, 
                discord_id: p.profili_utenti.discord_id,
            }));
        
        if (players.length < 4) {
            return new Response(JSON.stringify({ message: `Solo ${players.length} giocatori con Discord ID trovati. Necessari almeno 4.` }), { status: 400 });
        }
        
        // ===================================================================
        // PASSO 2: Divisione Squadre e Preparazione Roster
        // ===================================================================
        
        const finalRoster = assignTeams(players); 
        
        // OPZIONALE: Qui dovresti anche salvare il roster finale (finalRoster)
        // nelle tabelle 'event_tournaments' e 'tournament_rosters' se non è già stato fatto.
        
        // ===================================================================
        // PASSO 3: Interazione con Discord
        // ===================================================================

        const eventDate = new Date().toISOString().slice(0, 10);
        const channelSlug = `partita-${eventDate}-${eventId.slice(0, 4)}`; 
        const channelId = await createTemporaryChannel(channelSlug, matchOwnerId);
        
        await setupChannelAndRoles(channelId, finalRoster);
        
        // ===================================================================
        // PASSO 4: Risposta finale
        // ===================================================================

        const discordChannelUrl = `https://discord.com/channels/${DISCORD_GUILD_ID}/${channelId}`;

        return new Response(JSON.stringify({ 
            message: 'Partita configurata con successo e Bot Discord attivato!',
            channel_id: channelId,
            channel_url: discordChannelUrl,
            squadre_assegnate: finalRoster.length
        }), { 
            status: 200, 
            headers: { 'Content-Type': 'application/json' }
        });

    } catch (error) {
        console.error('Errore critico nel setup della partita:', error);
        return new Response(JSON.stringify({ 
            error: 'Errore interno del server durante la preparazione della partita.',
            detail: error.message 
        }), { 
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
}
