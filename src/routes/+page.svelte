<script>
    import TopNavBar from '$lib/components/TopNavBar.svelte';
    import BottomNavBar from '$lib/components/BottomNavBar.svelte';
    import { fly } from 'svelte/transition';
    import { eventStore } from '$lib/stores/eventStore.js'; 
    
    // Logica per l'evento live
    const liveEvent = { 
        id: 99, 
        title: 'Partita Settimanale', 
        date: 'Sabato 2 Nov, 20:00', 
        confirmed: 10, 
        total: 10, 
        location: 'Campo A',
        // Aggiungiamo un link Discord fittizio
        discordLink: 'https://discord.gg/partita-live-scarpari' 
    };

    /**
     * Funzione per aprire la Modale Eventi tramite lo Store.
     */
    function openEventModal() {
        eventStore.openModal(liveEvent);
    }
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
    .dashboard-grid {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 15px;
        margin-top: 20px;
    }
    .card {
        background: var(--panel-bg);
        border-radius: 12px;
        padding: 15px;
        box-shadow: 0 4px 10px rgba(0, 0, 0, 0.4);
    }
    .card-title {
        font-size: 1.1rem;
        font-weight: 800;
        color: var(--text-color-bright);
        margin-bottom: 5px;
    }
    .card-text {
        font-size: 0.85rem;
        color: var(--secondary-accent);
    }

    /* Stile Card Evento Live */
    .event-live-card {
        grid-column: 1 / -1; 
        border-left: 5px solid var(--accent-color);
        cursor: pointer; 
        transition: transform 0.2s;
        text-align: left;
        margin-bottom: 10px; /* Spazio prima del link Discord */
    }
    .event-live-card:hover {
        transform: translateY(-2px);
    }
    .confirmation-status {
        font-weight: 700;
        color: var(--success-color);
        margin-top: 5px;
        display: block;
    }
    
    /* Stili Link Discord */
    .discord-link {
        display: block;
        grid-column: 1 / -1;
        text-align: center;
        padding: 10px;
        margin-bottom: 20px;
        background: #7289da; /* Colore Discord */
        color: white;
        text-decoration: none;
        border-radius: 8px;
        font-weight: 700;
        transition: background 0.2s;
    }
    .discord-link:hover {
        background: #677bc4;
    }
</style>

<svelte:head>
    <title>Scarpa Inside | Home</title>
</svelte:head>

<div class="app-container">
    <TopNavBar />

    <h1 class="page-title">Dashboard</h1>

    <div class="dashboard-grid">

        <button 
            class="card event-live-card" 
            on:click={openEventModal}
        >
            <div class="card-title">Prossimo Evento Live</div>
            <p class="card-text">{liveEvent.title} • {liveEvent.location}</p>
            <span class="confirmation-status">{liveEvent.confirmed} / {liveEvent.total} Giocatori Confermati!</span>
        </button>
        
        {#if liveEvent.discordLink}
            <a href={liveEvent.discordLink} target="_blank" class="discord-link">
                📣 Chat Discord Partita
            </a>
        {/if}

        <div class="card">
            <div class="card-title">Ultima Presenza</div>
            <p class="card-text">100% (8/8 partite)</p>
        </div>

        <div class="card">
            <div class="card-title">Prossimo Avversario</div>
            <p class="card-text">Team Avversario Forte</p>
        </div>
        
    </div>

    <BottomNavBar />
</div>
