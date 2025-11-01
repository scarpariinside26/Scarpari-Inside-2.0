<script>
    // ⚠️ Assicurati che questi percorsi siano corretti e che i componenti esistano
    import { liveMatches, teamStats } from '$lib/data/mockData';
    import MatchCard from '$lib/components/MatchCard.svelte';
    import StatsCard from '$lib/components/StatsCard.svelte';
    // NUOVI COMPONENTI DI NAVIGAZIONE
    import TopNavBar from '$lib/components/TopNavBar.svelte';
    import BottomNavBar from '$lib/components/BottomNavBar.svelte';
    import { goto } from '$app/navigation'; // Aggiunto per la navigazione
    
    // Dati evento aggiornati per la Home
    const upcomingMatches = [
        { id: 'm-004', date: '01 Nov', time: '21:00', homeTeam: 'Scarpa FC', awayTeam: 'Red Devils' },
        { id: 'm-005', date: '05 Nov', time: '19:30', homeTeam: 'Scarpa FC', awayTeam: 'FC Prova' },
    ];

    function handleEditEvent(matchId) {
        alert(`Azione: Apri Form di Modifica per l'evento ${matchId}.`);
        goto(`/event/edit/${matchId}`); // Navigazione simulata
    }
</script>

<style>
    /* ... (Manteniamo i tuoi stili esistenti per il momento) ... */
    .app-container {
        max-width: 450px; /* Leggermente allargato per mobile */
        margin: 0 auto;
        background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
        min-height: 100vh;
        color: white;
        padding: 0 16px;
        padding-bottom: 70px; /* Spazio per la BottomNavBar */
    }

    /* Stili aggiornati per l'Upcoming Match Card (Ora cliccabile/modificabile) */
    .upcoming-match {
        background: #1e293b;
        padding: 16px;
        border-radius: 12px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        border: 1px solid #334155;
        transition: background-color 0.2s;
        cursor: pointer; /* Indica che è cliccabile */
    }
    .upcoming-match:hover {
        background: #273449; /* Effetto hover */
    }
    
    /* ... (Lasciamo tutti gli altri stili invariati) ... */
</style>

<div class="app-container">
    <TopNavBar />
    
    <section class="hero">
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
                <div class="upcoming-match" on:click={() => handleEditEvent(match.id)}>
                    <div class="match-date">{match.date}</div>
                    <div class="match-teams">
                        <span class="team">{match.homeTeam}</span>
                        <span class="vs">VS</span>
                        <span class="team">{match.awayTeam}</span>
                    </div>
                    <div class="match-time">{match.time}</div>
                </div>
            {/each}
        </div>
    </section>
    
    <BottomNavBar /> 
</div>
