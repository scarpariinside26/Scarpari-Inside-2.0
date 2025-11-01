<script>
    // NON importare app.css qui, è gestito in +layout.svelte

    // Componenti e dati richiesti
    import { liveMatches, upcomingMatches, teamStats } from '$lib/data/mockData';
    import MatchCard from '$lib/components/MatchCard.svelte';
    import StatsCard from '$lib/components/StatsCard.svelte';
    import TopNavBar from '$lib/components/TopNavBar.svelte';
    import BottomNavBar from '$lib/components/BottomNavBar.svelte';
    import { goto } from '$app/navigation';
    import { fly } from 'svelte/transition'; // Aggiunto per le transizioni

    // Funzione per la gestione del click sull'evento (corrisponde all'azione di modifica)
    function handleEditEvent(matchId) {
        alert(`Azione: Apri Form di Modifica per l'evento ${matchId}.`);
        goto(`/event/edit/${matchId}`); // Navigazione simulata
    }
</script>

<style>
    /* Stili generali del container - usa le variabili globali da app.css */
    .app-container {
        max-width: 450px; /* Larghezza mobile */
        margin: 0 auto;
        /* Rimosso lo sfondo gradiente da qui, ora è gestito da :global(body) in app.css */
        min-height: 100vh;
        color: var(--text-color);
        padding: 0 16px;
        padding-bottom: 70px; /* Spazio per la BottomNavBar */
    }

    /* ---------------- HERO SECTION ---------------- */
    .hero {
        text-align: center;
        padding: 32px 0 24px;
        border-bottom: 1px solid var(--input-bg);
    }

    .team-name {
        font-size: 2.5rem;
        font-weight: 900;
        /* Uso del gradiente Svelte per un effetto moderno */
        background: linear-gradient(135deg, var(--accent-color) 0%, var(--danger-color) 100%);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        margin-bottom: 16px;
    }

    .live-badge {
        display: inline-block;
        background: var(--danger-color);
        color: white;
        padding: 4px 12px;
        border-radius: 20px;
        font-size: 0.8rem;
        font-weight: 700;
        animation: pulse 2s infinite;
    }

    @keyframes pulse {
        0%, 100% { opacity: 1; }
        50% { opacity: 0.7; }
    }

    .sport-selector {
        display: flex;
        gap: 8px;
        justify-content: center;
        margin-top: 20px;
    }

    .sport-active {
        background: var(--accent-color);
        color: black;
        border: none;
        padding: 8px 16px;
        border-radius: 20px;
        font-weight: 600;
    }

    .sport-inactive {
        background: var(--input-bg);
        color: var(--text-color);
        border: none;
        padding: 8px 16px;
        border-radius: 20px;
        font-weight: 500;
    }
    
    /* ---------------- SEZIONI ---------------- */
    .section-title {
        /* Usa lo stile globale in app.css, ma se vuoi override lo puoi fare qui */
        color: var(--secondary-accent);
        font-size: 1.3rem;
        font-weight: 700;
        margin: 24px 0 16px;
    }

    .matches-grid {
        display: flex;
        flex-direction: column;
        gap: 12px;
    }

    .stats-grid {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 12px;
    }

    .section-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    /* ---------------- UPCOMING MATCHES (Gestione Eventi) ---------------- */
    .upcoming-list {
        display: flex;
        flex-direction: column;
        gap: 12px;
    }

    /* 🚀 Importante: Usiamo un BUTTON per l'accessibilità */
    button.upcoming-match {
        background: var(--panel-bg);
        padding: 16px;
        border-radius: 12px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        border: 1px solid var(--input-bg);
        transition: background-color 0.2s;
        cursor: pointer;
        
        /* Resetta lo stile di default del browser per i button */
        width: 100%; 
        text-align: left;
        color: var(--text-color);
    }
    button.upcoming-match:hover {
        background: var(--input-bg); /* Effetto hover scuro */
    }

    .match-date {
        font-weight: 700;
        color: var(--secondary-accent);
        min-width: 60px;
    }
    .match-teams {
        flex-grow: 1;
        text-align: center;
    }
    .vs {
        margin: 0 10px;
        color: var(--warning-color);
        font-weight: 600;
    }
    .match-time {
        font-weight: 500;
        min-width: 50px;
        text-align: right;
    }
    .team {
        font-weight: 600;
        color: var(--text-color-bright);
    }
</style>

<svelte:head>
    <title>Scarpa Inside | Home</title>
</svelte:head>

<div class="app-container">
    <TopNavBar />
    
    <section class="hero" transition:fly={{ y: -50, duration: 500 }}>
        <div class="hero-content">
            <h1 class="team-name">SCARPARI FC</h1>
            <div class="live-badge">LIVE</div>
        </div>
        <div class="sport-selector">
            <button class="sport-active">Calcetto</button>
            <button class="sport-inactive">Tornei</button>
            <button class="sport-inactive">Allenamenti</button>
        </div>
    </section>

    <section class="live-section">
        <h2 class="section-title">Partite in Corso</h2>
        <div class="matches-grid">
            {#each liveMatches as match}
                <MatchCard {match} />
            {/each}
        </div>
    </section>

    <section class="stats-section">
        <h2 class="section-title">Statistiche Squadra</h2>
        <div class="stats-grid">
            {#each teamStats as stat}
                <StatsCard {stat} />
            {/each}
        </div>
    </section>

    <section class="upcoming-section">
        <div class="section-header">
            <h2 class="section-title">Prossimi Eventi (Gestione)</h2>
        </div>
        <div class="upcoming-list">
            {#each upcomingMatches as match}
                <button class="upcoming-match" on:click={() => handleEditEvent(match.id)} transition:fly={{ y: 50, duration: 500 }}>
                    <div class="match-date">{match.date}</div>
                    <div class="match-teams">
                        <span class="team">{match.homeTeam}</span>
                        <span class="vs">VS</span>
                        <span class="team">{match.awayTeam}</span>
                    </div>
                    <div class="match-time">{match.time}</div>
                </button>
            {/each}
        </div>
    </section>
    
    <BottomNavBar /> 
</div>
