<script>
    import { onMount } from 'svelte';
    import { get } from 'svelte/store'; // Se usi una store per l'utente, altrimenti usa i props
    // import { userStore } from '$lib/stores'; // Esempio di import della store utente

    // --- PROPS NECESSARI ---
    // Questi dati dovrebbero essere caricati dalla funzione load/+page.server.js
    export let eventId;
    export let roster = []; // Esempio: [{ user_id: '...', discord_id: '...', team_name: 'Rossa' }, ...]
    export let isMatchOwner = false;
    
    // --- VARIABILI DI STATO ---
    let user = { id: 'YOUR_LOGGED_IN_USER_ID', jwt: 'YOUR_AUTH_JWT' }; // Sostituisci con la logica di autenticazione reale!
    let votes = {}; // { voted_user_id: score }
    let feedback = {}; // { voted_user_id: { status: 'success' | 'error', message: '...' } }
    let submissionStatus = ''; // 'pending' | 'success' | 'error'
    
    const BOT_VERCEL_URL = 'https://YOUR-BOT-VERCEL-DOMAIN.vercel.app'; // ⚠️ SOSTITUISCI CON IL TUO DOMINIO!
    const MAX_SCORE = 5;

    // Inizializza i voti a 0
    onMount(() => {
        roster.forEach(player => {
            votes[player.user_id] = 0;
        });
        votes = votes; // Forza aggiornamento Svelte
    });

    function getTeamColor(teamName) {
        switch (teamName) {
            case 'Rossa': return 'red';
            case 'Blu': return 'blue';
            case 'Gialla': return 'yellow';
            case 'Nera': return 'black';
            default: return 'gray';
        }
    }

    async function submitVote(votedPlayerId) {
        if (!user.id || !user.jwt) {
            alert("Devi essere loggato per votare.");
            return;
        }

        const score = votes[votedPlayerId];
        feedback[votedPlayerId] = { status: 'pending', message: 'Invio...' };
        feedback = feedback;

        try {
            const response = await fetch(`${BOT_VERCEL_URL}/api/match-vote`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    eventId: eventId,
                    voterId: user.id,
                    votedId: votedPlayerId,
                    score: score,
                    jwt: user.jwt // Passa il token per la RLS
                })
            });

            const data = await response.json();

            if (response.ok) {
                feedback[votedPlayerId] = { status: 'success', message: 'Voto salvato!' };
            } else {
                feedback[votedPlayerId] = { status: 'error', message: data.error || "Errore sconosciuto." };
            }
        } catch (e) {
            feedback[votedPlayerId] = { status: 'error', message: "Errore di rete." };
        } finally {
            feedback = feedback;
        }
    }

    // --- FUNZIONI ADMIN (per il calcolo finale e cleanup) ---
    async function handleAdminAction(endpoint) {
        submissionStatus = 'pending';
        
        try {
            const response = await fetch(`${BOT_VERCEL_URL}/api/${endpoint}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ eventId: eventId }) // Passa solo l'ID dell'evento
            });

            const data = await response.json();
            
            if (response.ok) {
                submissionStatus = 'success';
                alert(`✅ Azione '${endpoint}' completata! Controlla i log Vercel per i dettagli.`);
            } else {
                submissionStatus = 'error';
                alert(`❌ Errore in '${endpoint}': ${data.error || 'Errore HTTP.'}`);
            }

        } catch (e) {
            submissionStatus = 'error';
            alert(`❌ Errore di rete durante l'azione '${endpoint}'.`);
        }
    }
</script>

<style>
    .card {
        border: 1px solid #eee;
        padding: 15px;
        margin-bottom: 15px;
        border-radius: 8px;
        box-shadow: 0 2px 4px rgba(0,0,0,0.05);
        display: flex;
        justify-content: space-between;
        align-items: center;
    }
    .score-control {
        display: flex;
        gap: 10px;
        align-items: center;
    }
    .team-badge {
        font-weight: bold;
        padding: 4px 8px;
        border-radius: 4px;
        color: white;
    }
    .red { background: #E53935; }
    .blue { background: #1E88E5; }
    .yellow { background: #FFD700; color: #333;}
    .black { background: #424242; }
    .pending { color: orange; }
    .success { color: green; }
    .error { color: red; }
</style>

<main>
    <h2>Vota la Partita {eventId.slice(0, 8)}</h2>
    
    {#if roster.length === 0}
        <p>Caricamento roster o nessun partecipante trovato.</p>
    {:else}
        {#each roster as player}
            <div class="card">
                <div>
                    <span class="team-badge" style="background: {getTeamColor(player.team_name)}">{player.team_name}</span>
                    <span style="margin-left: 10px;">Giocatore ID: {player.user_id.slice(0, 8)}...</span>
                </div>

                <div class="score-control">
                    <input 
                        type="range" 
                        min="0" 
                        max={MAX_SCORE} 
                        bind:value={votes[player.user_id]} 
                        on:change={() => submitVote(player.user_id)}
                    />
                    <strong>{votes[player.user_id]} / {MAX_SCORE}</strong>
                    
                    {#if feedback[player.user_id]}
                        <span class="{feedback[player.user_id].status}">
                            {feedback[player.user_id].message}
                        </span>
                    {/if}
                </div>
            </div>
        {/each}
    {/if}

    {#if isMatchOwner}
        <hr style="margin: 30px 0;">
        <h3>Funzioni Admin</h3>
        <button on:click={() => handleAdminAction('match-calculate')} disabled={submissionStatus === 'pending'}>
            Calcola Punteggi Finali
        </button>
        <button on:click={() => handleAdminAction('match-cleanup')} disabled={submissionStatus === 'pending'}>
            Pulisci Canale Discord
        </button>
    {/if}
</main>
