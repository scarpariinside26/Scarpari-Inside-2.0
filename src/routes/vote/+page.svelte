<script>
    import TopNavBar from '$lib/components/TopNavBar.svelte';
    import { fly } from 'svelte/transition';
    import { enhance } from '$app/forms'; 
    import { quintOut } from 'svelte/easing';
    
    /** @type {import('./$types').PageData} */
    export let data;
    
    // Dati caricati dalla load function
    let { teams, liveEvent, previousMatches } = data;
    
    /** Voti possibili: da 4.0 a 10.0 a step di 0.5 */
    const possibleVotes = Array.from({ length: 13 }, (_, i) => 4.0 + i * 0.5);

    let formMessage = null;

    /** Logica per preparare e inviare i voti */
    function handleVoteAction(e) {
        // 1. Raccogli tutti i voti
        const allVotes = teams.flatMap(team => team.players.filter(p => p.isVotable).map(p => ({ 
            user_id: p.user_id, // L'ID utente che ha ricevuto il voto (auth.users.id)
            score: p.vote 
        })));
        
        // 2. Verifica client-side se tutti i voti richiesti sono stati assegnati (escludendo l'utente stesso)
        const unvoted = allVotes.filter(v => v.score < 4.0);
        if (unvoted.length > 0) {
            formMessage = { type: 'error', text: "❌ Attenzione: devi assegnare un voto a tutti i giocatori (escluso te stesso) prima di inviare." };
            return false; // Blocca l'invio del form
        }

        // 3. Serializza i voti nel campo nascosto del form
        const form = e.target;
        form.elements.votes.value = JSON.stringify(allVotes);
        
        formMessage = null; // Rimuovi il messaggio precedente
    }

    // Helper per mostrare il risultato
    function getScoreDisplay(result) {
        // Implementazione semplificata per i dati di tournament_matches (Team A vs Team B)
        return `${result.team_a_name} ${result.team_a_score || '?'} - ${result.team_b_score || '?'} ${result.team_b_name}`;
    }

    // Helper per determinare lo stile del pulsante (aggiunto nel load)
    function setVote(player, vote) {
        if (player.isVotable) {
             player.vote = vote;
             // Forza l'aggiornamento dello stato reattivo, altrimenti Svelte potrebbe non registrare il cambiamento nell'array
             teams = teams; 
        } else {
            formMessage = { type: 'error', text: "Non puoi votare te stesso!" };
        }
    }
</script>

<style>
    /* ... (STILI DAL MESSAGGIO PRECEDENTE) ... */
    .page-container { max-width: 450px; margin: 0 auto; padding: 0 16px; padding-top: 70px; padding-bottom: 20px; min-height: 100vh; }
    .voting-section { margin-bottom: 25px; background: var(--panel-bg); border-radius: 12px; padding: 15px; }
    .voting-section h3 { color: var(--accent-color); margin-top: 0; border-bottom: 1px solid var(--input-bg); padding-bottom: 10px; margin-bottom: 15px; }
    .player-vote-card { padding: 10px 0; border-bottom: 1px dashed var(--input-bg); }
    .player-vote-card:last-child { border-bottom: none; padding-bottom: 0; }
    .player-name { font-weight: 700; color: var(--text-color-bright); margin-bottom: 5px; display: flex; justify-content: space-between; align-items: center;}
    .touch-bar-grid { display: grid; grid-template-columns: repeat(7, 1fr); gap: 2px; width: 100%; margin-top: 5px; border-radius: 8px; overflow: hidden; border: 1px solid var(--input-bg); }
    .vote-button { padding: 5px 0; border: none; background: var(--input-bg); color: var(--secondary-accent); font-weight: 600; font-size: 0.8rem; cursor: pointer; transition: background 0.1s, color 0.1s, transform 0.1s; line-height: 1; grid-row: 1; opacity: 1; }
    .vote-button.half-point { grid-row: 2; }
    .vote-button:nth-child(even) { background: var(--input-bg); } 
    .vote-button:nth-child(odd) { background: var(--panel-bg); }
    .vote-button.selected { background: var(--accent-color) !important; color: black; font-weight: 800; transform: scale(1.05); }
    .vote-10-0 { grid-column: 7; grid-row: 1 / span 2; font-size: 1rem; background: var(--success-color) !important; color: black !important; }
    .vote-button.disabled { opacity: 0.5; cursor: not-allowed; background: var(--input-bg) !important; } /* Stile disabilitato */
    .submit-button { width: 100%; padding: 15px; background: var(--success-color); color: black; border: none; border-radius: 10px; font-weight: 800; font-size: 1.1rem; cursor: pointer; margin-top: 20px; }
    .results-section h3 { color: var(--text-color-bright); margin-bottom: 10px; }
    .result-entry { display: flex; justify-content: space-between; align-items: center; background: var(--panel-bg); padding: 12px; border-radius: 8px; margin-bottom: 8px; font-size: 0.95rem; }
    .result-date { font-weight: 700; color: var(--secondary-accent); width: 60px; }
    .result-scores { font-weight: 600; color: var(--text-color-bright); flex-grow: 1; text-align: right; }
    .form-message { padding: 10px; border-radius: 6px; margin-bottom: 10px; font-weight: 600; text-align: center; }
    .form-message.error { background: var(--error-color); color: white; }
    .form-message.success { background: var(--success-color); color: black; }
</style>

<svelte:head>
    <title>Scarpa Inside | Votazioni</title>
</svelte:head>

<div class="page-container">
    <TopNavBar />

    <h2 style="color: var(--accent-color); margin-bottom: 20px;">Votazione {liveEvent?.titolo || 'Partita'}</h2>
    <p style="color: var(--secondary-accent); margin-top: -15px;">Solo i voti da 4.0 a 10.0 sono validi.</p>

    <form class="voting-section" method="POST" action="?/submitVotes" on:submit={handleVoteAction} use:enhance={() => {
        return async ({ result, update }) => {
            if (result.type === 'success') {
                formMessage = { type: 'success', text: '✅ Voti inviati con successo! La pagina si aggiornerà...' };
            } else if (result.type === 'failure' && result.data?.error) {
                formMessage = { type: 'error', text: `❌ Errore: ${result.data.error}` };
            } else if (result.type === 'error') {
                 formMessage = { type: 'error', text: `❌ Errore sconosciuto durante l'invio.` };
            }
            await update(); // Aggiorna i dati per mostrare lo stato di voto corretto
        };
    }}>
        
        {#if formMessage}
            <div class="form-message" class:error={formMessage.type === 'error'} class:success={formMessage.type === 'success'} transition:fly={{ y: -10, duration: 200 }}>
                {formMessage.text}
            </div>
        {/if}

        <input type="hidden" name="event_id" value={liveEvent?.id || ''} />
        <input type="hidden" name="votes" id="votes-data" /> 

        {#each teams as team (team.id)}
            <h3 style="color: {team.color}; border-color: {team.color}40;">⭐ {team.name}</h3>
            
            {#each team.players as player (player.user_id)}
                <div class="player-vote-card">
                    <span class="player-name">
                        {player.name}
                        {#if !player.isVotable}
                            <span style="font-size: 0.7rem; font-weight: 400; color: var(--secondary-accent);"> (Tu)</span>
                        {/if}
                    </span>
                    
                    <div class="touch-bar-grid">
                        {#each possibleVotes as vote (vote)}
                            {#if vote < 10.0}
                                <button 
                                    type="button" 
                                    class="vote-button"
                                    class:selected={player.vote === vote}
                                    class:half-point={vote % 1 !== 0}
                                    class:disabled={!player.isVotable}
                                    on:click={() => setVote(player, vote)}
                                    disabled={!player.isVotable}
                                    style="grid-column: {Math.floor(vote - 3)};"
                                >
                                    {vote % 1 === 0 ? Math.floor(vote) : '.5'}
                                </button>
                            {:else}
                                <button 
                                    type="button"
                                    class="vote-button vote-10-0"
                                    class:selected={player.vote === vote}
                                    class:disabled={!player.isVotable}
                                    on:click={() => setVote(player, vote)}
                                    disabled={!player.isVotable}
                                >
                                    {vote.toFixed(1)}
                                </button>
                            {/if}
                        {/each}
                    </div>
                </div>
            {/each}
        {/each}

        <button type="submit" class="submit-button" transition:fly={{ y: 10, duration: 300, easing: quintOut }}>
            INVIA I MIEI VOTI
        </button>
    </form>

    <div class="results-section">
        <h3>Risultati Partite Precedenti (Ultimi 3)</h3>
        {#each previousMatches as result (result.id)}
            <div class="result-entry" transition:fly={{ y: 5, duration: 200 }}>
                <span class="result-date">Match #{result.match_number}</span>
                <span class="result-scores">
                    {getScoreDisplay(result)}
                </span>
            </div>
        {/each}
    </div>
</div>
