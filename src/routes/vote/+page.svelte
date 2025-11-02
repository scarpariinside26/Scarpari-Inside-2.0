<script>
    import TopNavBar from '$lib/components/TopNavBar.svelte';
    import { fly } from 'svelte/transition';
    
    // --- DATI FITTIZI (Dovranno essere caricati dal server in un'app reale) ---
    // Giocatori attuali (divisi per squadra)
    const teams = [
        { id: 1, name: 'Team Rosso', color: '#FF4136', players: [
            { name: 'Mario Rossi', id: 101, vote: 7 },
            { name: 'Giulio Neri', id: 102, vote: 7 },
            { name: 'Marco Bianchi', id: 103, vote: 7 },
            { name: 'Paolo Gialli', id: 104, vote: 7 },
        ]},
        { id: 2, name: 'Team Blu', color: '#0074D9', players: [
            { name: 'Andrea Blu', id: 201, vote: 7 },
            { name: 'Simone Azzurro', id: 202, vote: 7 },
            { name: 'Davide Marino', id: 203, vote: 7 },
            { name: 'Pietro Oceano', id: 204, vote: 7 },
        ]},
        // Assumiamo che il resto dei giocatori non abbia ancora un team assegnato
    ];

    // Risultati delle partite precedenti (3 partite)
    const results = [
        { id: 1, date: '26 Ott', team1: 'Rossi', score1: 3, team2: 'Blu', score2: 2, score3: null, score4: null },
        { id: 2, date: '19 Ott', team1: 'Rossi', score1: 1, team2: 'Blu', score2: 1, score3: 'Verde', score3: 3, score4: 'Giallo', score4: 1 },
        { id: 3, date: '12 Ott', team1: 'Rossi', score1: 4, team2: 'Blu', score2: 4, score3: null, score4: null }
    ];

    /** Logica per inviare i voti */
    function submitVotes() {
        const votes = teams.flatMap(team => team.players.map(p => ({ 
            player_id: p.id, 
            vote: p.vote 
        })));
        console.log("Voti inviati:", votes);
        alert('Voti inviati con successo! Grazie per aver votato.');
        // In un'app reale: chiamata API a Supabase
    }

    // Determina il numero massimo di squadre per i risultati
    $: maxTeams = Math.max(...results.map(r => r.score3 ? 4 : 2));
    
    function getScoreDisplay(result) {
        if (result.score3 === null) {
            // 2 squadre
            return `${result.team1} ${result.score1} - ${result.score2} ${result.team2}`;
        } else {
            // 4 squadre
            return `${result.team1} ${result.score1} - ${result.score2} ${result.team2} - ${result.team3} ${result.score3} - ${result.team4} ${result.score4}`;
        }
    }
</script>

<style>
    .page-container {
        max-width: 450px;
        margin: 0 auto;
        padding: 0 16px;
        padding-top: 70px;
        padding-bottom: 20px;
        min-height: 100vh;
    }
    
    /* Area Votazione */
    .voting-section {
        margin-bottom: 25px;
        background: var(--panel-bg);
        border-radius: 12px;
        padding: 15px;
    }
    .voting-section h3 {
        color: var(--accent-color);
        margin-top: 0;
        border-bottom: 1px solid var(--input-bg);
        padding-bottom: 10px;
        margin-bottom: 15px;
    }

    /* Votazione Giocatore */
    .player-vote-card {
        padding: 10px 0;
        border-bottom: 1px dashed var(--input-bg);
    }
    .player-vote-card:last-child {
        border-bottom: none;
    }
    .player-vote-card label {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 5px;
        font-weight: 600;
    }
    .vote-input-group {
        display: flex;
        align-items: center;
        gap: 10px;
        flex-grow: 1;
        margin-left: 20px;
    }
    .vote-input-group input[type="range"] {
        flex-grow: 1;
        height: 5px;
        -webkit-appearance: none;
        appearance: none;
        background: var(--input-bg);
        border-radius: 5px;
        cursor: pointer;
    }
    .vote-input-group input[type="range"]::-webkit-slider-thumb {
        -webkit-appearance: none;
        appearance: none;
        width: 15px;
        height: 15px;
        border-radius: 50%;
        background: var(--accent-color);
    }
    .vote-display {
        width: 30px;
        text-align: center;
        font-weight: 800;
        color: var(--success-color);
    }
    .submit-button {
        width: 100%;
        padding: 15px;
        background: var(--success-color);
        color: black;
        border: none;
        border-radius: 10px;
        font-weight: 800;
        font-size: 1.1rem;
        cursor: pointer;
        margin-top: 20px;
    }

    /* Area Risultati */
    .results-section h3 {
        color: var(--text-color-bright);
        margin-bottom: 10px;
    }
    .result-entry {
        display: flex;
        justify-content: space-between;
        align-items: center;
        background: var(--panel-bg);
        padding: 12px;
        border-radius: 8px;
        margin-bottom: 8px;
        font-size: 0.95rem;
    }
    .result-date {
        font-weight: 700;
        color: var(--secondary-accent);
        width: 60px;
    }
    .result-scores {
        font-weight: 600;
        color: var(--text-color-bright);
        flex-grow: 1;
        text-align: right;
    }
</style>

<svelte:head>
    <title>Scarpa Inside | Votazioni</title>
</svelte:head>

<div class="page-container">
    <TopNavBar />

    <h2 style="color: var(--accent-color); margin-bottom: 20px;">Votazione Partita (4.0 - 10.0)</h2>

    <div class="voting-section" transition:fly={{ y: 20, duration: 400 }}>
        {#each teams as team (team.id)}
            <h3 style="color: {team.color}; border-color: {team.color}40;">⭐ {team.name}</h3>
            {#each team.players as player (player.id)}
                <div class="player-vote-card">
                    <label>
                        <span>{player.name}</span>
                        <div class="vote-input-group">
                            <input 
                                type="range" 
                                min="4.0" 
                                max="10.0" 
                                step="0.5" 
                                bind:value={player.vote}
                                aria-label={`Vota ${player.name}`}
                            />
                            <span class="vote-display">{player.vote.toFixed(1)}</span>
                        </div>
                    </label>
                </div>
            {/each}
        {/each}

        <button class="submit-button" on:click={submitVotes}>
            INVIA I MIEI VOTI
        </button>
    </div>

    <div class="results-section">
        <h3>Risultati Partite Precedenti (Ultimi 3)</h3>
        {#each results as result (result.id)}
            <div class="result-entry" transition:fly={{ y: 5, duration: 200 }}>
                <span class="result-date">{result.date}</span>
                <span class="result-scores">
                    {getScoreDisplay(result)}
                </span>
            </div>
        {/each}
    </div>
</div>
