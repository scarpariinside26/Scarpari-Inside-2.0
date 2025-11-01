<script>
    import TopNavBar from '$lib/components/TopNavBar.svelte';
    import BottomNavBar from '$lib/components/BottomNavBar.svelte';
    import { eventStore } from '$lib/stores/eventStore.js'; 
    import { fade } from 'svelte/transition';
    
    // --- DATI FITTIZI EVENTO LIVE COMPLETO ---
    const liveEvent = { 
        id: 99, 
        title: 'Partita Settimanale', 
        date: 'Sabato 2 Nov, 20:00', 
        confirmed: 16, 
        total: 16, 
        location: 'Campo A',
        discordLink: 'https://discord.gg/partita-live-scarpari',
        teams: [
            // Squadra 1 (Rossa)
            { id: 1, name: 'Team Rosso', color: '#FF4136', players: [
                { name: 'Mario Rossi', role: 'Att', rating: 8.5 },
                { name: 'Giulio Neri', role: 'Cen', rating: 6.9 },
                { name: 'Marco Bianchi', role: 'Por', rating: 9.0 },
                { name: 'Paolo Gialli', role: 'Att', rating: 7.8 },
            ]},
            // Squadra 2 (Blu)
            { id: 2, name: 'Team Blu', color: '#0074D9', players: [
                { name: 'Andrea Blu', role: 'Att', rating: 7.5 },
                { name: 'Simone Azzurro', role: 'Dif', rating: 8.0 },
                { name: 'Davide Marino', role: 'Cen', rating: 7.1 },
                { name: 'Pietro Oceano', role: 'Por', rating: 7.9 },
            ]},
            // Squadra 3 (Verde)
            { id: 3, name: 'Team Verde', color: '#2ECC40', players: [
                { name: 'Elena Verdi', role: 'Dif', rating: 6.5 },
                { name: 'Franco Bruno', role: 'Att', rating: 7.0 },
                { name: 'Laura Rosa', role: 'Cen', rating: 8.1 },
                { name: 'Nicola Viola', role: 'Dif', rating: 7.3 },
            ]},
            // Squadra 4 (Gialla)
            { id: 4, name: 'Team Giallo', color: '#FFDC00', players: [
                { name: 'Oscar Argento', role: 'Att', rating: 8.8 },
                { name: 'Sara Bronzo', role: 'Dif', rating: 6.9 },
                { name: 'Tobia Nero', role: 'Cen', rating: 7.7 },
                { name: 'Ugo Oro', role: 'Dif', rating: 7.4 },
            ]}
        ]
    };

    let showEditModal = false;

    /**
     * Funzione per aprire la Modale di Modifica Evento
     */
    function openEditModal() {
        showEditModal = true;
    }
    
    function closeEditModal() {
        showEditModal = false;
    }

    function handleAdminAction(action) {
        alert(`Azione amministrativa: ${action} per l'evento ${liveEvent.title}`);
        closeEditModal();
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
        grid-template-columns: 1fr 1fr; /* Manteniamo 2 colonne */
        gap: 15px;
        margin-top: 20px;
    }
    .card {
        background: var(--panel-bg);
        border-radius: 12px;
        padding: 15px;
        box-shadow: 0 4px 10px rgba(0, 0, 0, 0.4);
        text-align: left;
    }
    
    /* Card Evento Live */
    .event-live-card {
        grid-column: 1 / -1; 
        border-left: 5px solid var(--accent-color);
        cursor: pointer;
        transition: transform 0.2s;
        padding-top: 10px;
        padding-bottom: 10px;
        position: relative;
    }
    .event-live-card:hover {
        transform: translateY(-2px);
    }
    .card-content {
        display: flex;
        justify-content: space-between;
        align-items: center;
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
    .confirmation-status {
        font-weight: 700;
        color: var(--success-color);
        margin-top: 5px;
        display: block;
    }
    
    /* Link Discord compatto nella card */
    .discord-link-compact {
        background: #7289da; /* Colore Discord */
        color: white;
        text-decoration: none;
        padding: 6px 10px;
        border-radius: 6px;
        font-size: 0.8rem;
        font-weight: 700;
        transition: background 0.2s;
    }
    .discord-link-compact:hover {
        background: #677bc4;
    }

    /* --- Schede Squadre --- */
    .team-card {
        border-top: 5px solid var(--team-color);
        padding: 10px;
    }
    .team-name {
        font-weight: 800;
        font-size: 0.9rem;
        color: var(--team-color);
        margin-bottom: 5px;
        text-align: center;
    }
    .team-players-list {
        font-size: 0.75rem;
        list-style: none;
        padding: 0;
        margin: 0;
    }
    .player-entry {
        display: flex;
        justify-content: space-between;
        line-height: 1.4;
    }
    .player-entry-meta {
        color: var(--secondary-accent);
        font-weight: 500;
    }
    .player-entry-rating {
        font-weight: 700;
        color: var(--success-color);
    }

    /* --- Modale di Modifica (Nuova) --- */
    .edit-modal-backdrop {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.8);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 2000;
    }
    .edit-modal-content {
        background: var(--bg-color);
        border-radius: 15px;
        width: 90%;
        max-width: 400px;
        padding: 20px;
        z-index: 2001;
    }
    .edit-modal-content h3 {
        margin-top: 0;
        color: var(--accent-color);
        border-bottom: 1px solid var(--panel-bg);
        padding-bottom: 10px;
        margin-bottom: 20px;
    }
    .form-group {
        margin-bottom: 15px;
    }
    .form-group label {
        display: block;
        margin-bottom: 5px;
        font-weight: 600;
    }
    .form-group input, .form-group select {
        width: 100%;
        padding: 10px;
        border-radius: 8px;
        border: 1px solid var(--panel-bg);
        background: var(--input-bg);
        color: var(--text-color);
    }
    .action-button {
        width: 100%;
        padding: 12px;
        border: none;
        border-radius: 8px;
        font-weight: 700;
        cursor: pointer;
        margin-top: 10px;
    }
    .save-button { background: var(--success-color); color: black; }
    .cancel-button { background: var(--warning-color); color: black; }
    .delete-button { background: var(--error-color); color: white; margin-top: 20px; }

</style>

<svelte:head>
    <title>Scarpa Inside | Home</title>
</svelte:head>

<div class="app-container">
    <TopNavBar />

    <h1 class="page-title">Dashboard</h1>

    <div class="dashboard-grid">

        <div class="card event-live-card" on:click={openEditModal} role="button" tabindex="0">
            <div class="card-content">
                <div>
                    <div class="card-title">{liveEvent.title}</div>
                    <p class="card-text">📍 {liveEvent.location} • ⏰ {liveEvent.date}</p>
                </div>
                
                <a href={liveEvent.discordLink} target="_blank" class="discord-link-compact" on:click|stopPropagation>
                    📣 Discord
                </a>
            </div>
            <span class="confirmation-status">{liveEvent.confirmed} / {liveEvent.total} Giocatori Assegnati!</span>
        </div>

        {#each liveEvent.teams as team (team.id)}
            <div class="card team-card" style="--team-color: {team.color};">
                <div class="team-name">{team.name}</div>
                <ul class="team-players-list">
                    {#each team.players as player}
                        <li class="player-entry">
                            <span>{player.name}</span>
                            <span class="player-entry-meta">{player.role}</span>
                            <span class="player-entry-rating">{player.rating.toFixed(1)}</span>
                        </li>
                    {/each}
                </ul>
            </div>
        {/each}
        
    </div>

    <BottomNavBar />
</div>

{#if showEditModal}
    <div class="edit-modal-backdrop" transition:fade={{ duration: 300 }} on:click={closeEditModal}>
        <div class="edit-modal-content panel" role="dialog" aria-modal="true" on:click|stopPropagation>
            <button class="close-button" on:click={closeEditModal}>&times;</button>
            <h3>Modifica: {liveEvent.title}</h3>
            
            <div class="form-group">
                <label for="event-title">Nome Evento</label>
                <input id="event-title" type="text" value={liveEvent.title}>
            </div>
            
            <div class="form-group">
                <label for="event-location">Luogo</label>
                <input id="event-location" type="text" value={liveEvent.location}>
            </div>
            
            <div class="form-group">
                <label for="event-time">Data e Ora</label>
                <input id="event-time" type="text" value={liveEvent.date}>
            </div>
            
            <div class="form-group">
                <label for="event-duration">Durata (min)</label>
                <input id="event-duration" type="number" value="90">
            </div>

            <button class="action-button save-button" on:click={() => handleAdminAction('Salva Modifiche')}>
                💾 SALVA MODIFICHE
            </button>
            
            <button class="action-button cancel-button" on:click={() => handleAdminAction('Annulla Evento')}>
                ❌ ANNULLA EVENTO
            </button>

            <button class="action-button delete-button" on:click={() => handleAdminAction('Elimina Evento')}>
                🗑️ ELIMINA (Storico)
            </button>
        </div>
    </div>
{/if}
