<script>
    import TopNavBar from '$lib/components/TopNavBar.svelte';
    import { fly } from 'svelte/transition';
    
    // --- DATI FITTIZI (Dovranno essere caricati dal server in un'app reale) ---
    // Giocatori attuali (divisi per squadra)
    const teams = [
        { id: 1, name: 'Team Rosso', color: '#FF4136', players: [
            { name: 'Mario Rossi', id: 101, vote: 7.0 },
            { name: 'Giulio Neri', id: 102, vote: 7.0 },
            { name: 'Marco Bianchi', id: 103, vote: 7.0 },
            { name: 'Paolo Gialli', id: 104, vote: 7.0 },
        ]},
        { id: 2, name: 'Team Blu', color: '#0074D9', players: [
            { name: 'Andrea Blu', id: 201, vote: 7.0 },
            { name: 'Simone Azzurro', id: 202, vote: 7.0 },
            { name: 'Davide Marino', id: 203, vote: 7.0 },
            { name: 'Pietro Oceano', id: 204, vote: 7.0 },
        ]},
        // Assumiamo che il resto dei giocatori non abbia ancora un team assegnato
    ];

    // Risultati delle partite precedenti (3 partite - RITORNANO ALLA VERSIONE SEMPLICE per pulizia)
    const results = [
        { id: 1, date: '26 Ott', team1: 'Rossi', score1: 3, team2: 'Blu', score2: 2, team3: 'Verdi', score3: 1, team4: 'Gialli', score4: 1 },
        { id: 2, date: '19 Ott', team1: 'Rossi', score1: 1, team2: 'Blu', score2: 1, team3: null, score3: null, team4: null, score4: null }, // 2 Squadre
        { id: 3, date: '12 Ott', team1: 'Rossi', score1: 4, team2: 'Blu', score2: 4, team3: 'Verdi', score3: 3, team4: 'Gialli', score4: 2 }
    ];

    /** Voti possibili: da 4.0 a 10.0 a step di 0.5 */
    const possibleVotes = Array.from({ length: 13 }, (_, i) => 4.0 + i * 0.5);

    /** Funzione per inviare i voti */
    function submitVotes() {
        const votes = teams.flatMap(team => team.players.map(p => ({ 
            player_id: p.id, 
            vote: p.vote 
        })));
        
        // Verifica se tutti i voti sono stati assegnati
        const unvoted = votes.filter(v => v.vote === null || v.vote < 4.0);
        if (unvoted.length > 0) {
            alert("Attenzione: devi assegnare un voto a tutti i giocatori prima di inviare.");
            return;
        }

        console.log("Voti inviati:", votes);
        alert('Voti inviati con successo! Grazie per aver votato.');
        // In un'app reale: chiamata API a Supabase
    }

    /** Helper per mostrare il risultato */
    function getScoreDisplay(result) {
        if (!result.team3) {
            // 2 squadre
            return `${result.team1} ${result.score1} - ${result.score2} ${result.team2}`;
        } else {
            // 4 squadre
            return `${result.team1} ${result.score1} - ${result.score2} ${result.team2} | ${result.team3} ${result.score3} - ${result.team4} ${result.score4}`;
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

    /* Contenitore Votazione Giocatore */
    .player-vote-card {
        padding: 10px 0;
        border-bottom: 1px dashed var(--input-bg);
    }
    .player-vote-card:last-child {
        border-bottom: none;
        padding-bottom: 0;
    }
    .player-name {
        font-weight: 700;
        color: var(--text-color-bright);
        margin-bottom: 5px;
        display: block;
    }

    /* Touch Bar Stili */
    .touch-bar-grid {
        display: grid;
        /* Colonne: 4.x, 5.x, 6.x, 7.x, 8.x, 9.x, 10.x */
        grid-template-columns: repeat(7, 1fr); 
        gap: 2px;
        width: 100%;
        margin-top: 5px;
        border-radius: 8px;
        overflow: hidden;
        border: 1px solid var(--input-bg);
    }
    .vote-button {
        padding: 5px 0;
        border: none;
        background: var(--input-bg);
        color: var(--secondary-accent);
        font-weight: 600;
        font-size: 0.8rem;
        cursor: pointer;
        transition: background 0.1s, color 0.1s, transform 0.1s;
        line-height: 1;
        /* Per la doppia riga, la prima riga è il voto intero */
        grid-row: 1;
    }
    /* Posizionamento dei mezzi voti */
    .vote-button.half-point {
        grid-row: 2;
    }

    /* Stile per il voto intero (top row) */
    .vote-button:nth-child(even) {
        /* Voti .5 */
        background: var(--input-bg); 
    }
    .vote-button:nth-child(odd) {
        /* Voti interi */
        background: var(--panel-bg);
    }

    /* Stile Selezionato */
    .vote-button.selected {
        background: var(--accent-color) !important;
        color: black;
        font-weight: 800;
        transform: scale(1.05);
    }
    
    /* Voto 10.0 (ultima colonna, copre entrambe le righe) */
    .vote-10-0 {
        grid-column: 7;
        grid-row: 1 / span 2; 
        font-size: 1rem;
        background: var(--success-color) !important;
        color: black !important;
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

    /* Area Risultati (stili precedenti inalterati) */
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
                    <span class="player-name">{player.name}</span>
                    
                    <div class="touch-bar-grid">
                        {#each possibleVotes as vote (vote)}
                            {#if vote < 10.0}
                                <button 
                                    class="vote-button"
                                    class:selected={player.vote === vote}
                                    class:half-point={vote % 1 !== 0}
                                    on:click={() => player.vote = vote}
                                    style="grid-column: {Math.floor(vote - 3)};"
                                >
                                    {vote % 1 === 0 ? Math.floor(vote) : '.5'}
                                </button>
                            {:else}
                                <button 
                                    class="vote-button vote-10-0"
                                    class:selected={player.vote === vote}
                                    on:click={() => player.vote = vote}
                                >
                                    {vote.toFixed(1)}
                                </button>
                            {/if}
                        {/each}
                    </div>
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
