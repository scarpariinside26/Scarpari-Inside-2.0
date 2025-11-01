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
    <h1 class="page-title">👤 Elenco Giocatori</h1>
    <p>Qui andrà l'elenco dei giocatori, ordinato alfabeticamente, con la scheda espandibile, pulsante di chiamata e la logica di voto.</p>
    <BottomNavBar />
</div>
