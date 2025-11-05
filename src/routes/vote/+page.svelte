<script>
    import TopNavBar from '$lib/components/TopNavBar.svelte';
    import { fly } from 'svelte/transition';
    import { enhance } from '$app/forms'; 
    import { quintOut } from 'svelte/easing';
    
    // Lo script in SvelteKit è un modulo ES e le importazioni sono corrette.
    // L'errore è spesso legato alla configurazione del progetto Node/Vite.
    
    /** @type {import('./$types').PageData} */
    export let data;
    
    // Dati caricati dalla load function
    let { teams, liveEvent, previousMatches } = data;
    
    // Variabile di stato per il voto sul risultato del match: 'W', 'D', 'L'
    let matchResultVote = null; 

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

        // 3. Verifica se l'utente ha votato il risultato del match
        if (!matchResultVote) {
             formMessage = { type: 'error', text: "❌ Devi selezionare il risultato della partita (Vittoria, Pareggio o Sconfitta)." };
            return false;
        }

        // 4. Serializza i voti individuali (già fatto nella tua versione)
        const form = e.target;
        form.elements.votes.value = JSON.stringify(allVotes);
        
        // 5. Imposta il voto sul risultato nel campo nascosto
        form.elements.matchResult.value = matchResultVote;
        
        formMessage = null; // Rimuovi il messaggio precedente
    }

    // Helper per mostrare il risultato
    function getScoreDisplay(result) {
        // Implementazione semplificata per i dati di tournament_matches (Team A vs Team B)
        return `${result.team_a_name} ${result.team_a_score || '?'} - ${result.team_b_score || '?'} ${result.team_b_name}`;
    }

    // Helper per determinare lo stile del pulsante
    function setVote(player, vote) {
        if (player.isVotable) {
             player.vote = vote;
             // Forza l'aggiornamento dello stato reattivo
             teams = teams; 
        } else {
             formMessage = { type: 'error', text: "Non puoi votare te stesso!" };
        }
    }
</script>

<style>
    /* VARIABILI CSS PERSONALIZZATE (Assumo che siano definite altrove o nel body) */
    :root {
        --text-color-primary: #f5f5f5;
        --text-color-bright: #ffffff;
        --secondary-accent: #9aa0a6;
        --accent-color: #6366f1; /* Indigo 500 */
        --panel-bg: #1e1e1e;
        --input-bg: #2a2a2a;
        --success-color: #4ade80; /* Green 400 */
        --error-color: #f87171; /* Red 400 */
    }
    .page-container { max-width: 450px; margin: 0 auto; padding: 0 16px; padding-top: 70px; padding-bottom: 20px; min-height: 100vh; background-color: #121212; color: var(--text-color-primary); font-family: sans-serif; }
    .voting-section { margin-bottom: 25px; background: var(--panel-bg); border-radius: 12px; padding: 15px; box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3); }
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
    .submit-button { width: 100%; padding: 15px; background: var(--success-color); color: black; border: none; border-radius: 10px; font-weight: 800; font-size: 1.1rem; cursor: pointer; margin-top: 20px; transition: background 0.2s; }
    .submit-button:hover { background: #34d399; }
    .results-section h3 { color: var(--text-color-bright); margin-bottom: 10px; }
    .result-entry { display: flex; justify-content: space-between; align-items: center; background: var(--panel-bg); padding: 12px; border-radius: 8px; margin-bottom: 8px; font-size: 0.95rem; }
    .result-date { font-weight: 700; color: var(--secondary-accent); width: 60px; }
    .result-scores { font-weight: 600; color: var(--text-color-bright); flex-grow: 1; text-align: right; }
    .form-message { padding: 10px; border-radius: 6px; margin-bottom: 10px; font-weight: 600; text-align: center; }
    .form-message.error { background: var(--error-color); color: white; }
    .form-message.success { background: var(--success-color); color: black; }
    
    /* Nuovo stile per il voto sul risultato */
    .result-vote-section { margin: 20px 0; padding: 15px; background: var(--panel-bg); border-radius: 12px; box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2); }
    .result-vote-buttons { display: flex; gap: 10px; margin-top: 10px; }
    .result-button { 
        flex-grow: 1; 
        padding: 12px; 
        border-radius: 8px; 
        border: 2px solid var(--input-bg);
        background: var(--input-bg); 
        color: var(--secondary-accent); 
        font-weight: 600; 
        cursor: pointer;
        transition: all 0.2s;
    }
    .result-button.selected-W { background: #3b82f6; color: white; border-color: #3b82f6; transform: scale(1.05); } /* Blu per Vittoria */
    .result-button.selected-D { background: #fbbf24; color: black; border-color: #fbbf24; transform: scale(1.05); } /* Giallo per Pareggio */
    .result-button.selected-L { background: #ef4444; color: white; border-color: #ef4444; transform: scale(1.05); } /* Rosso per Sconfitta */
</style>

<svelte:head>
    <title>Scarpa Inside | Votazioni</title>
</svelte:head>

<div class="page-container">
    <TopNavBar />

    <h2 style="color: var(--accent-color); margin-bottom: 20px;">Votazione {liveEvent?.titolo || 'Partita'}</h2>
    <p style="color: var(--secondary-accent); margin-top: -15px;">Vota i giocatori (4.0-10.0) e il risultato finale.</p>

    <form class="voting-form" method="POST" action="?/submitVotes" on:submit|preventDefault={handleVoteAction} use:enhance={() => {
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
        <input type="hidden" name="matchResult" id="match-result-data" /> 

        <!-- SEZIONE VOTO GIOCATORI -->
        <div class="voting-section">
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
        </div>

        <!-- NUOVA SEZIONE: VOTO RISULTATO PARTITA -->
        <div class="result-vote-section">
            <h3 style="color: var(--text-color-bright); border-bottom: none; margin-bottom: 5px;">Voto Risultato Finale</h3>
            <p style="color: var(--secondary-accent); font-size: 0.85rem;">(Come ti ricordi sia finita la partita?)</p>
            <div class="result-vote-buttons">
                <button 
                    type="button" 
                    class="result-button" 
                    class:selected-W={matchResultVote === 'W'}
                    on:click={() => matchResultVote = 'W'}
                >
                    <span style="font-size: 1.2rem;">🏆</span> Vittoria
                </button>
                <button 
                    type="button" 
                    class="result-button" 
                    class:selected-D={matchResultVote === 'D'}
                    on:click={() => matchResultVote = 'D'}
                >
                    <span style="font-size: 1.2rem;">🤝</span> Pareggio
                </button>
                <button 
                    type="button" 
                    class="result-button" 
                    class:selected-L={matchResultVote === 'L'}
                    on:click={() => matchResultVote = 'L'}
                >
                    <span style="font-size: 1.2rem;">😥</span> Sconfitta
                </button>
            </div>
        </div>
        <!-- FINE NUOVA SEZIONE -->

        <button type="submit" class="submit-button" transition:fly={{ y: 10, duration: 300, easing: quintOut }}>
            INVIA TUTTI I MIEI VOTI
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
