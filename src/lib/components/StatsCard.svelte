<script>
  export let stat;
</script>

<div class="stats-card">
  <div class="stat-value">{stat.value}</div>
  <div class="stat-title">{stat.title}</div>
  <div class="stat-trend">📈 {stat.trend}</div>
</div>

<style>
  .stats-card {
    background: #1e293b;
    padding: 16px;
    border-radius: 12px;
    text-align: center;
    border: 1px solid #334155;
  }
  
  .stat-value {
    font-size: 1.5rem;
    font-weight: 900;
    color: #f59e0b;
    margin-bottom: 4px;
  }
  
  .stat-title {
    font-size: 0.8rem;
    color: #94a3b8;
    margin-bottom: 8px;
  }
  
  .stat-trend {
    font-size: 0.7rem;
    color: #10b981;
  }
</style>
