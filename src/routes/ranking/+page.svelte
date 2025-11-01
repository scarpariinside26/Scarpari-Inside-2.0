<script>
    import TopNavBar from '$lib/components/TopNavBar.svelte';
    import BottomNavBar from '$lib/components/BottomNavBar.svelte';
</script>

<style>
    .app-container {
        max-width: 450px;
        margin: 0 auto;
        min-height: 100vh;
        color: var(--text-color);
        padding: 0 16px;
        padding-bottom: 80px; 
    }
</style>

<div class="app-container">
    <TopNavBar />
    <h1 class="page-title">🏆 Classifica</h1>
    <p>Qui andrà la classifica generale, ordinata per posizione/voto, che reindirizza al profilo del giocatore al click.</p>
    <BottomNavBar />
</div>
