<script>
  export let match;
</script>

<div class="match-card">
  <div class="match-header">
    <span class="league">{match.league}</span>
    <div class="live-indicator"></div>
  </div>
  
  <div class="teams-container">
    <div class="team">
      <div class="team-logo">{match.teams.home.logo}</div>
      <span class="team-name">{match.teams.home.name}</span>
    </div>
    
    <div class="score">
      <div class="score-main">{match.score}</div>
      <div class="match-status">{match.quarter}</div>
    </div>
    
    <div class="team">
      <span class="team-name">{match.teams.away.name}</span>
      <div class="team-logo">{match.teams.away.logo}</div>
    </div>
  </div>
</div>

<style>
  .match-card {
    background: linear-gradient(135deg, #1e293b 0%, #334155 100%);
    border-radius: 16px;
    padding: 16px;
    border: 1px solid #475569;
  }

  .match-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 12px;
  }

  .league {
    font-size: 0.8rem;
    color: #94a3b8;
  }

  .live-indicator {
    width: 8px;
    height: 8px;
    background: #ef4444;
    border-radius: 50%;
    animation: pulse 2s infinite;
  }

  .teams-container {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .team {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
  }

  .team-logo {
    font-size: 1.5rem;
  }

  .team-name {
    font-size: 0.9rem;
    font-weight: 600;
  }

  .score {
    text-align: center;
  }

  .score-main {
    font-size: 1.5rem;
    font-weight: 900;
    color: #f59e0b;
  }

  .match-status {
    font-size: 0.7rem;
    color: #94a3b8;
    margin-top: 4px;
  }
</style>
