<script>
    import TopNavBar from '$lib/components/TopNavBar.svelte';
    import { fly } from 'svelte/transition';
</script>

<style>
    .app-container {
        max-width: 450px;
        margin: 0 auto;
        min-height: 100vh;
        color: var(--text-color);
        padding: 0 16px;
        padding-bottom: 20px;
    }
    .note {
        margin-top: 50px;
        text-align: center;
        color: var(--secondary-accent);
    }
</style>

<svelte:head>
    <title>Scarpa Inside | Eventi (Gestione)</title>
</svelte:head>

<div class="app-container">
    <TopNavBar />

    <h1 class="page-title" transition:fly={{ y: -50, duration: 500 }}>
        Gestione Eventi
    </h1>
    
    <p class="note">
        La Modale di visualizzazione dell'evento è stata spostata sulla Homepage.<br>
        Questa pagina può essere utilizzata in futuro per creare e modificare nuovi eventi.
    </p>
</div>
