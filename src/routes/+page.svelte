<script>
    import TopNavBar from '$lib/components/TopNavBar.svelte';
    import BottomNavBar from '$lib/components/BottomNavBar.svelte';
    import { fade, fly } from 'svelte/transition';
    import { page } from '$app/stores'; // Importato per gestire la rotta corrente

    // --- LOGICA MODALE EVENTI INIZIO ---

    let isModalOpen = false;
    let selectedEvent = null;
    let viewMode = 'list'; // 'list' o 'field'

    // Dati dell'evento live simulato
    const eventData = {
        title: "Partita Settimanale - Squadre",
        participants: [
            // Squadra 1 (Rossa)
            { id: 1, name: 'Mario Rossi', team: 1, color: '#FF4136', role: 'Attaccante', rating: 8.5 },
            { id: 2, name: 'Luca Verdi', team: 1, color: '#FF4136', role: 'Difensore', rating: 7.2 },
            { id: 3, name: 'Giulio Neri', team: 1, color: '#FF4136', role: 'Centrocampista', rating: 6.9 },
            { id: 4, name: 'Marco Bianchi', team: 1, color: '#FF4136', role: 'Portiere', rating: 9.0 },
            { id: 5, name: 'Paolo Gialli', team: 1, color: '#FF4136', role: 'Attaccante', rating: 7.8 },

            // Squadra 2 (Blu)
            { id: 6, name: 'Andrea Blu', team: 2, color: '#0074D9', role: 'Attaccante', rating: 7.5 },
            { id: 7, name: 'Simone Azzurro', team: 2, color: '#0074D9', role: 'Difensore', rating: 8.0 },
            { id: 8, name: 'Davide Marino', team: 2, color: '#0074D9', role: 'Centrocampista', rating: 7.1 },
            { id: 9, name: 'Pietro Oceano', team: 2, color: '#0074D9', role: 'Portiere', rating: 7.9 },
            { id: 10, name: 'Emanuele Cielo', team: 2, color: '#0074D9', role: 'Difensore', rating: 6.5 },
        ]
    };

    // Raggruppa i giocatori per squadra
    $: teams = eventData.participants.reduce((acc, player) => {
        if (!acc[player.team]) {
            acc[player.team] = {
                color: player.color,
                players: []
            };
        }
        acc[player.team].players.push(player);
        return acc;
    }, {});

    // Funzione per aprire la modale
    function openParticipantsModal(eventInfo) {
        selectedEvent = eventInfo;
        isModalOpen = true;
    }

    // Funzioni per la modale
    function closeModal() {
        isModalOpen = false;
    }
    function handleBackdropClick(event) {
        if (event.target.classList.contains('modal-backdrop')) {
            closeModal();
        }
    }
    // --- LOGICA MODALE EVENTI FINE ---
</script>

<style>
    /* ------------------------------------- */
    /* Stili Generali e Card Homepage */
    /* ------------------------------------- */
    .app-container {
        max-width: 450px;
        margin: 0 auto;
        min-height: 100vh;
        color: var(--text-color);
        padding: 0 16px;
        padding-bottom: 80px; /* Spazio per la BottomNavBar */
    }

    /* Stili Home/Dashboard */
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
        grid-column: 1 / -1; /* Occupa tutta la larghezza */
        border-left: 5px solid var(--accent-color);
        cursor: pointer;
        transition: transform 0.2s;
        text-align: left; /* Per farla sembrare un bottone ma con layout card */
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

    /* ------------------------------------- */
    /* Stili Modale Eventi */
    /* ------------------------------------- */
    .modal-backdrop {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.7);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 1000;
    }
    .modal-content {
        background: var(--bg-color);
        border-radius: 15px;
        width: 90%;
        max-width: 600px;
        max-height: 90%;
        overflow-y: auto;
        padding: 20px;
        position: relative;
    }
    .close-button {
        position: absolute;
        top: 10px;
        right: 10px;
        background: none;
        border: none;
        font-size: 1.5rem;
        color: var(--secondary-accent);
        cursor: pointer;
    }
    .modal-content h3 {
        margin-top: 0;
        color: var(--accent-color);
        border-bottom: 1px solid var(--panel-bg);
        padding-bottom: 10px;
        margin-bottom: 20px;
    }

    /* Stili Layout Partecipanti */
    .view-toggle {
        display: flex;
        background: var(--panel-bg);
        border-radius: 8px;
        margin-bottom: 20px;
        overflow: hidden;
    }
    .view-toggle button {
        flex: 1;
        padding: 10px;
        border: none;
        background: transparent;
        color: var(--secondary-accent);
        font-weight: 600;
        cursor: pointer;
        transition: background 0.2s, color 0.2s;
    }
    .view-toggle button.active {
        background: var(--accent-color);
        color: black;
    }

    /* Stile Lista (List View) */
    .team-section {
        margin-bottom: 25px;
    }
    .team-title {
        font-size: 1.2rem;
        font-weight: 800;
        margin-bottom: 15px;
        padding-bottom: 5px;
        border-bottom: 2px solid var(--panel-bg);
    }
    .player-card {
        background: var(--input-bg);
        border-radius: 8px;
        padding: 10px;
        margin-bottom: 8px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        /* v-bind non è supportato qui, usiamo variabili CSS inline */
        border-left: 4px solid var(--team-list-color); 
    }
    .player-info {
        font-weight: 600;
    }
    .player-meta {
        font-size: 0.8rem;
        color: var(--secondary-accent);
    }
    .player-rating {
        font-weight: 900;
        color: var(--success-color);
    }

    /* Stile Campo (Field View) */
    .field-view {
        position: relative;
        background-color: #378b29; /* Verde campo */
        background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%"><rect width="100%" height="100%" fill="%23378b29"/><line x1="50%" y1="0" x2="50%" y2="100%" stroke="white" stroke-width="2"/><circle cx="50%" cy="50%" r="10%" stroke="white" stroke-width="2" fill="none"/><rect x="0" y="25%" width="15%" height="50%" stroke="white" stroke-width="2" fill="none"/><rect x="85%" y="25%" width="15%" height="50%" stroke="white" stroke-width="2" fill="none"/></svg>');
        background-repeat: no-repeat;
        background-size: 100% 100%;
        border: 5px solid white;
        border-radius: 10px;
        height: 350px; 
        margin-top: 20px;
    }

    .team-name-badge {
        position: absolute;
        top: 10px;
        padding: 5px 10px;
        border-radius: 5px;
        font-weight: 700;
        font-size: 0.9rem;
        color: white;
        z-index: 10;
    }
    .team-1-badge { background-color: #FF4136; left: 10px; }
    .team-2-badge { background-color: #0074D9; right: 10px; }


    .player-position-marker {
        position: absolute;
        width: 60px;
        text-align: center;
        transform: translate(-50%, -50%); 
        cursor: pointer;
    }
    .player-marker-dot {
        width: 35px;
        height: 35px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        margin: 0 auto 3px;
        color: white;
        font-weight: 800;
        font-size: 0.9rem;
        border: 2px solid white;
        box-shadow: 0 2px 5px rgba(0, 0, 0, 0.5);
    }
    .player-marker-name {
        font-size: 0.7rem;
        color: white;
        text-shadow: 0 0 3px black;
    }
    
    /* Posizioni (simulazione) */
    .pos-1-1 { top: 50%; left: 90%; } 
    .pos-1-2 { top: 25%; left: 70%; } 
    .pos-1-3 { top: 50%; left: 65%; } 
    .pos-1-4 { top: 75%; left: 70%; } 
    .pos-1-5 { top: 50%; left: 45%; } 
    .pos-2-1 { top: 50%; left: 10%; } 
    .pos-2-2 { top: 25%; left: 30%; } 
    .pos-2-3 { top: 50%; left: 35%; } 
    .pos-2-4 { top: 75%; left: 30%; } 
    .pos-2-5 { top: 50%; left: 55%; }
    
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
            on:click={() => openParticipantsModal({ title: 'Partita Settimanale', date: 'Sabato 2 Nov, 20:00', confirmed: 10, total: 10, location: 'Campo A' })}
        >
            <div class="card-title">Prossimo Evento Live</div>
            <p class="card-text">Partita Settimanale • Campo A</p>
            <span class="confirmation-status">10 / 10 Giocatori Confermati!</span>
        </button>

        <div class="card">
            <div class="card-title">Ultima Presenza</div>
            <p class="card-text">100% (8/8 partite)</p>
        </div>

        <div class="card">
            <div class="card-title">Prossimo Avversario</div>
            <p class="card-text">Team Avversario Forte</p>
        </div>
        
    </div>
    
    {#if isModalOpen}
        <div 
            class="modal-backdrop" 
            transition:fade={{ duration: 300 }} 
            on:click={handleBackdropClick} 
            role="dialog" 
            aria-modal="true"
        >
            <div class="modal-content panel" transition:fly={{ y: 100, duration: 400 }}>
                <button class="close-button" on:click={closeModal} aria-label="Chiudi Modale">
                    &times;
                </button>
                
                <h3>Partecipanti: {selectedEvent?.title || 'Dettagli Evento'}</h3>

                <div class="view-toggle">
                    <button 
                        class:active={viewMode === 'list'} 
                        on:click={() => viewMode = 'list'}
                    >
                        Lista Giocatori
                    </button>
                    <button 
                        class:active={viewMode === 'field'} 
                        on:click={() => viewMode = 'field'}
                    >
                        Campo da Gioco
                    </button>
                </div>
                
                {#if viewMode === 'list'}
                    {#each Object.entries(teams) as [teamId, team]}
                        <section class="team-section">
                            <h4 class="team-title" style="color: {team.color};">Squadra {teamId}</h4>
                            
                            {#each team.players as player}
                                <div class="player-card" style="--team-list-color: {player.color};">
                                    <div class="player-info">
                                        {player.name}
                                        <div class="player-meta">
                                            Ruolo: {player.role}
                                        </div>
                                    </div>
                                    <div class="player-rating">{player.rating.toFixed(1)}</div>
                                </div>
                            {/each}
                        </section>
                    {/each}
                {/if}

                {#if viewMode === 'field'}
                    <div class="field-view">
                        <div class="team-name-badge team-1-badge">Squadra 1 (Rossa)</div>
                        <div class="team-name-badge team-2-badge">Squadra 2 (Blu)</div>

                        {#each eventData.participants as player (player.id)}
                            {@const posClass = `pos-${player.team}-${player.id % 5 + 1}`} 
                            <div class="player-position-marker {posClass}">
                                <div class="player-marker-dot" style="background-color: {player.color};">
                                    {player.rating.toFixed(1)}
                                </div>
                                <div class="player-marker-name">{player.name.split(' ')[0]}</div>
                            </div>
                        {/each}
                    </div>
                    <div class="player-meta" style="margin-top: 10px;">
                        Nota: La posizione dei giocatori è una simulazione per il layout.
                    </div>
                {/if}
            </div>
        </div>
    {/if}

    <BottomNavBar />
</div>
