import { createClient } from '@supabase/supabase-js';
import { createTemporaryChannel, setupChannelAndRoles } from '$lib/server/discord-api';

// Rimosse le importazioni da $env, ora si usa process.env
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY;
const DISCORD_GUILD_ID = process.env.DISCORD_GUILD_ID;

const TEAM_NAMES = ['Rossa', 'Blu', 'Gialla', 'Nera'];

function assignTeams(players) {
    players.sort(() => Math.random() - 0.5); // Mescola
    
    return players.map((player, index) => ({
        ...player,
        team_name: TEAM_NAMES[index % TEAM_NAMES.length],
    }));
}

export async function POST({ request }) {
    // 💥 CORREZIONE CHIAVE: Inizializza Supabase all'interno della funzione
    const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY, {
        auth: {
            autoRefreshToken: false,
            persistSession: false,
        },
    });

    try {
        const { eventId, matchOwnerId } = await request.json(); 

        if (!eventId || !matchOwnerId) {
            return new Response(JSON.stringify({ error: 'Missing eventId or matchOwnerId' }), { status: 400 });
        }
        
        // ===================================================================
        // PASSO 1: Ottieni i giocatori Convocati e i loro Discord ID
        // ===================================================================
        const { data: participationData, error: participationError } = await supabaseAdmin
            .from('partecipazioni') 
            .select(`
                utente_id, 
                profili_utenti:utente_id (discord_id) 
            `) 
            .eq('evento_id', eventId)
            .eq('stato', 'confermato'); 

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
        
        // ===================================================================
        // PASSO 3: SALVATAGGIO STATO E ROSTER IN SUPABASE e CREAZIONE CANALE
        // ===================================================================
        
        const eventDate = new Date().toISOString().slice(0, 10);
        const channelSlug = `partita-${eventDate}-${eventId.slice(0, 4)}`; 
        
        // Usa la funzione aggiornata, che ritorna { success, id }
        const { success: channelSuccess, id: channelId } = await createTemporaryChannel(channelSlug, matchOwnerId);
        
        if (!channelSuccess || !channelId) {
             console.error('Errore nella creazione del canale Discord');
             throw new Error('Impossibile creare il canale Discord.');
        }
        
        const discordChannelUrl = `https://discord.com/channels/${DISCORD_GUILD_ID}/${channelId}`;
        
        // 3a. Inserisci lo stato della partita e il canale Discord
        const { error: eventError } = await supabaseAdmin
            .from('event_tournaments')
            .insert({
                event_id: eventId,
                discord_channel_id: channelId,
                discord_channel_url: discordChannelUrl,
                is_active: true
            });
            
        if (eventError) {
            console.error('Errore Supabase (event_tournaments):', eventError);
            throw new Error('Impossibile salvare lo stato del torneo.');
        }

        // 3b. Inserisci il roster finale
        const rosterData = finalRoster.map(p => ({
            event_id: eventId,
            user_id: p.user_id,
            team_name: p.team_name,
        }));
        
        const { error: rosterError } = await supabaseAdmin
            .from('tournament_rosters')
            .insert(rosterData);

        if (rosterError) {
            console.error('Errore Supabase (tournament_rosters):', rosterError);
            throw new Error('Impossibile salvare il roster finale.');
        }
        
        // ===================================================================
        // PASSO 4: Interazione con Discord
        // ===================================================================

        await setupChannelAndRoles(channelId, finalRoster);
        
        // ===================================================================
        // PASSO 5: Risposta finale
        // ===================================================================

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
