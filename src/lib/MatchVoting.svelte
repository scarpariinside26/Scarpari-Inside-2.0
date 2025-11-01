<script>
    import { onMount } from 'svelte';
    import { slide } from 'svelte/transition';

    export let eventId;
    export let roster = []; 
    export let isMatchOwner = false;
    export let isMatchActive = false;
    export let hasUserVoted = false;
    
    const BOT_VERCEL_URL = 'https://scarpari-inside-20.vercel.app'; // ⚠️ Aggiorna questo URL se necessario
    const MAX_SCORE = 5;

    let user = { id: 'TEST_VOTER_ID', jwt: 'TEST_JWT_TOKEN' }; 
    let votes = {}; 
    let feedback = {}; 
    let processingSubmission = false; 

    onMount(() => {
        // Inizializza il voto di ogni giocatore a 1
        roster.forEach(player => {
            votes[player.user_id] = 1; 
        });
        votes = votes; 
    });

    function getTeamColorStyle(teamName) {
        switch (teamName) {
            case 'Rossa': return 'background: #ff4757;';
            case 'Blu': return 'background: #1e90ff;';
            case 'Gialla': return 'background: #ffa502; color: #1a1a2e;';
            case 'Nera': return 'background: #3c4048;';
            default: return 'background: #6c757d;';
        }
    }

    async function submitVote(votedPlayerId) {
        if (!isMatchActive || hasUserVoted || processingSubmission) {
            // Blocca il voto se la partita non è attiva, l'utente ha già votato o è in corso un invio
            return;
        }

        const score = votes[votedPlayerId];
        feedback[votedPlayerId] = { status: 'pending', message: 'Invio...' };
        feedback = feedback;
        processingSubmission = true;
        
        try {
            // ⚠️ Questa chiamata fallirà finché non avrai i file API corretti con CORS!
            const response = await fetch(`${BOT_VERCEL_URL}/api/match-vote`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    eventId: eventId,
                    voterId: user.id,
                    votedId: votedPlayerId,
                    score: score,
                    jwt: user.jwt
                })
            });

            const data = await response.json();

            if (response.ok) {
                feedback[votedPlayerId] = { status: 'success', message: `Voto ${score} salvato!` };
            } else {
                feedback[votedPlayerId] = { status: 'error', message: data.error || "Errore API voto." };
            }
        } catch (e) {
            feedback[votedPlayerId] = { status: 'error', message: "Errore di rete (Controlla CORS)." };
        } finally {
            feedback = feedback;
            processingSubmission = false;
        }
    }
</script>

<style>
    .voter-container { max-width: 900px; margin: 20px auto; }
    .player-card { display: flex; justify-content: space-between; align-items: center; padding: 15px 25px; margin-bottom: 10px; position: relative; overflow: hidden; }
    
    .player-info { display: flex; align-items: center; gap: 20px; }
    .team-badge { font-weight: bold; padding: 5px 12px; border-radius: 5px; color: white; text-shadow: 1px 1px 2px rgba(0,0,0,0.5); font-size: 0.9em; }
    
    /* Controlli Voto / Visualizzazione Roster */
    .score-control { display: flex; gap: 15px; align-items: center; width: 450px; flex-shrink: 0; }
    .score-display { font-weight: bold; font-size: 1.1em; color: var(--accent-color-glow); }

    input[type="range"] { flex-grow: 1; -webkit-appearance: none; height: 8px; background: #4a4a75; border-radius: 4px; box-shadow: 0 0 5px rgba(0, 188, 212, 0.5); }
    input[type="range"]::-webkit-slider-thumb { -webkit-appearance: none; appearance: none; width: 18px; height: 18px; border-radius: 50%; background: var(--accent-color); cursor: pointer; box-shadow: 0 0 8px var(--accent-color); transition: background 0.2s; }
    
    .admin-controls { display: flex; gap: 15px; margin-top: 25px; padding: 20px; border: 1px dashed var(--accent-color); border-radius: 8px; }
    .pending { color: var(--warning-color); }
    .success { color: var(--success-color); font-weight: bold; }
    .error { color: var(--danger-color); font-weight: bold; }
    .feedback-box { width: 150px; text-align: right; }
    
    /* Mobile Layout */
    @media (max-width: 768px) {
        .player-card { flex-direction: column; align-items: flex-start; }
        .player-info { margin-bottom: 10px; }
        .score-control { width: 100%; }
        .feedback-box { text-align: left; margin-top: 5px; }
        .admin-controls { flex-direction: column; }
    }
</style>

<div class="voter-container">
    <div class="panel">
        <h2>{isMatchActive ? 'Votazione' : 'Roster Finale'} Match {eventId.slice(0, 8)}</h2>
        <p>
            {#if isMatchActive}
                Assegna un punteggio da 1 a {MAX_SCORE} per ogni giocatore.
            {:else}
                Risultato finale e punteggi dei giocatori.
            {/if}
        </p>
        
        {#if !isMatchActive}
            <p class="error" transition:slide>La votazione per questa partita è chiusa!</p>
        {:else if hasUserVoted}
            <p class="success" transition:slide>Hai già registrato il tuo voto.</p>
        {/if}
    </div>

    {#if roster.length === 0}
        <p>Nessun giocatore nel roster.</p>
    {:else}
        {#each roster as player (player.user_id)}
            <div class="player-card card" transition:slide>
                <div class="player-info">
                    <span class="team-badge" style="{getTeamColorStyle(player.team_name)}">
                        {player.team_name}
                    </span>
                    <strong>{player.name || `Giocatore ${player.user_id.slice(0, 8)}...`}</strong>
                    <p style="font-size: 0.8em; color: #999;">Status: {player.status}</p>
                </div>

                <div class="score-control">
                    {#if isMatchActive && !hasUserVoted}
                        <input 
                            type="range" 
                            min="1" 
                            max={MAX_SCORE} 
                            step="1"
                            bind:value={votes[player.user_id]} 
                            on:input={() => submitVote(player.user_id)} 
                            disabled={processingSubmission}
                        />
                        <strong style="width: 30px; text-align: right; color: var(--accent-color);">
                            {votes[player.user_id]}
                        </strong>
                        <div class="feedback-box">
                            {#if feedback[player.user_id]}
                                <span class="{feedback[player.user_id].status}" transition:slide>
                                    {feedback[player.user_id].message}
                                </span>
                            {/if}
                        </div>
                    {:else}
                        <p>Punteggio: <span class="score-display">{player.score.toFixed(1)} / {MAX_SCORE}</span></p>
                    {/if}
                </div>
            </div>
        {/each}
    {/if}

    {#if isMatchOwner}
        <div class="admin-controls" transition:slide>
            <h3>Pannello Amministrativo (Risultati)</h3>
            <button class="btn-success" disabled={isMatchActive}>Calcola Punteggi Finali</button>
            <button class="btn-danger" disabled={isMatchActive}>Pulisci Canale Discord</button>
        </div>
    {/if}
</div>
