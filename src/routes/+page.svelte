<!-- src/routes/+page.svelte -->
<script>
  import { liveMatches, upcomingMatches, teamStats } from '$lib/data/mockData';
  import MatchCard from '$lib/components/MatchCard.svelte';
  import StatsCard from '$lib/components/StatsCard.svelte';
  import NavBar from '$lib/components/NavBar.svelte';
</script>

<div class="app-container">
  <NavBar />
  
  <!-- HERO SECTION - ClutchTime Style -->
  <section class="hero">
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

  <!-- LIVE MATCHES - Dunkra Style -->
  <section class="live-section">
    <h2 class="section-title">Partite in Corso</h2>
    <div class="matches-grid">
      {#each liveMatches as match}
        <MatchCard {match} />
      {/each}
    </div>
  </section>

  <!-- STATS CARDS - Scorify Style -->
  <section class="stats-section">
    <h2 class="section-title">Statistiche Squadra</h2>
    <div class="stats-grid">
      {#each teamStats as stat}
        <StatsCard {stat} />
      {/each}
    </div>
  </section>

  <!-- UPCOMING MATCHES -->
  <section class="upcoming-section">
    <div class="section-header">
      <h2 class="section-title">Prossime Partite</h2>
      <button class="view-all">Vedi Tutte</button>
    </div>
    <div class="upcoming-list">
      {#each upcomingMatches as match}
        <div class="upcoming-match">
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
</div>

<style>
  .app-container {
    max-width: 400px;
    margin: 0 auto;
    background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
    min-height: 100vh;
    color: white;
    padding: 0 16px;
  }

  .hero {
    text-align: center;
    padding: 32px 0 24px;
    border-bottom: 1px solid #334155;
  }

  .team-name {
    font-size: 2.5rem;
    font-weight: 900;
    background: linear-gradient(135deg, #f59e0b 0%, #ef4444 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    margin-bottom: 16px;
  }

  .live-badge {
    display: inline-block;
    background: #ef4444;
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
    background: #f59e0b;
    color: black;
    border: none;
    padding: 8px 16px;
    border-radius: 20px;
    font-weight: 600;
  }

  .sport-inactive {
    background: #334155;
    color: #94a3b8;
    border: none;
    padding: 8px 16px;
    border-radius: 20px;
    font-weight: 500;
  }

  .section-title {
    font-size: 1.3rem;
    font-weight: 700;
    margin: 24px 0 16px;
    color: #f8fafc;
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

  .view-all {
    background: none;
    border: 1px solid #f59e0b;
    color: #f59e0b;
    padding: 6px 12px;
    border-radius: 12px;
    font-size: 0.8rem;
  }

  .upcoming-list {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  .upcoming-match {
    background: #1e293b;
    padding: 16px;
    border-radius: 12px;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
</style>
