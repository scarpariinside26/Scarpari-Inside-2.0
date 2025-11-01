<script>
    import { page } from '$app/stores';
    import { eventStore } from '$lib/stores/eventStore.js';
    import { fade, fly } from 'svelte/transition';
    import { quartOut } from 'svelte/easing';
    
    // Sottoscriviti allo store per conoscere lo stato della modale
    let storeState;
    eventStore.subscribe(value => {
        storeState = value;
    });

    // --- LOGICA MODALE EVENTI INIZIO ---

    let viewMode = 'list'; 

    // Dati simulati dei giocatori e delle squadre (usati per la lista)
    const detailedEventData = {
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
    $: teams = detailedEventData.participants.reduce((acc, player) => {
        if (!acc[player.team]) {
            acc[player.team] = {
                color: player.color,
                players: []
            };
        }
        acc[player.team].players.push(player);
        return acc;
    }, {});

    function closeModal() {
        eventStore.closeModal();
    }
    function handleBackdropClick(event) {
        if (event.target.classList.contains('modal-backdrop')) {
            closeModal();
        }
    }
    
    function openCreateEventFlow() {
        closeModal();
        alert("Avvia la procedura per 'Creare un nuovo Evento'.");
        // Qui potresti reindirizzare a /events/create
    }

    function openEditEventFlow() {
        closeModal();
        // In un'app reale passeresti l'ID dell'evento
        alert(`Avvia la modifica per l'evento: ${$eventStore.eventData?.title}`);
        // Qui potresti reindirizzare a /events/edit/{id}
    }

    // --- LOGICA MODALE EVENTI FINE ---
</script>

<style>
    /* ------------------------------------- */
    /* Stili Bottom Nav Bar */
    /* ------------------------------------- */
    .bottom-nav-bar {
        position: fixed;
        bottom: 0;
        left: 50%;
        transform: translateX(-50%);
        width: 100%;
        max-width: 450px;
        height: 70px;
        background: var(--panel-bg);
        box-shadow: 0 -5px 15px rgba(0, 0, 0, 0.3);
        display: flex;
        justify-content: space-around;
        align-items: center;
        z-index: 500;
        border-top-left-radius: 20px;
        border-top-right-radius: 20px;
    }
    .nav-item {
        flex: 1;
        text-align: center;
        padding: 5px;
        color: var(--secondary-accent);
        font-size: 0.75rem;
        font-weight: 600;
        text-decoration: none;
        display: flex;
        flex-direction: column;
        align-items: center;
        transition: color 0.2s;
        cursor: pointer;
    }
    .nav-item.active {
        color: var(--accent-color);
    }
    .nav-icon {
        font-size: 1.5rem;
        margin-bottom: 2px;
    }

    /* Stile Bottone Centrale Rialzato - Semplificato */
    .center-button-container {
        position: relative;
        display: flex;
        justify-content: center;
        width: 60px;
        height: 100%;
    }
    .center-button {
        position: absolute;
        top: -25px; 
        width: 60px;
        height: 60px;
        border-radius: 50%;
        background: var(--accent-color);
        color: black;
        box-shadow: 0 4px 10px rgba(0, 0, 0, 0.5);
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 2rem;
        font-weight: 900;
        border: 4px solid var(--bg-color); 
        cursor: pointer;
        transition: background 0.2s, transform 0.2s;
    }
    .center-button:hover {
        background: var(--success-color-glow);
        transform: scale(1.05);
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
        z-index: 1001; 
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
    .modal-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        border-bottom: 1px solid var(--panel-bg);
        padding-bottom: 10px;
        margin-bottom: 20px;
    }
    .modal-header h3 {
        margin: 0;
        color: var(--accent-color);
    }

    /* Stili Lista (List View) */
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

    /* Stili Azioni e Discord */
    .discord-link {
        display: block;
        text-align: center;
        padding: 10px;
        margin: 15px 0;
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

    .action-buttons {
        display: flex;
        gap: 10px;
        margin-top: 20px;
    }
    .action-buttons button {
        flex: 1;
        padding: 12px;
        border: none;
        border-radius: 8px;
        font-weight: 700;
        cursor: pointer;
    }
    .action-buttons .edit {
        background: var(--accent-color);
        color: black;
    }
    .action-buttons .create {
        background: var(--primary-color);
        color: white;
    }

</style>

<div class="bottom-nav-bar">
    <a href="/" class="nav-item" class:active={$page.url.pathname === '/'}>
        <span class="nav-icon">📊</span> Dashboard
    </a>
    <a href="/stats" class="nav-item" class:active={$page.url.pathname.startsWith('/stats')}>
        <span class="nav-icon">🏆</span> Statistiche
    </a>
    
    <div class="center-button-container">
        <a href="/" class="center-button" aria-label="Azione Principale">
            +
        </a>
    </div>
    
    <a href="/events" class="nav-item" class:active={$page.url.pathname.startsWith('/events')}>
        <span class="nav-icon">🗓️</span> Eventi
    </a>
    <a href="/profile" class="nav-item" class:active={$page.url.pathname.startsWith('/profile')}>
        <span class="nav-icon">⚙️</span> Profilo
    </a>
</div>

{#if $eventStore.isOpen}
    <div 
        class="modal-backdrop" 
        transition:fade={{ duration: 300 }} 
        on:click={handleBackdropClick} 
        role="dialog" 
        aria-modal="true"
    >
        <div class="modal-content panel" transition:fly={{ y: 100, duration: 400, easing: quartOut }}>
            <button class="close-button" on:click={closeModal} aria-label="Chiudi Modale">
                &times;
            </button>
            
            <div class="modal-header">
                <h3>Dettagli: {$eventStore.eventData?.title || 'Evento'}</h3>
                
                <div style="display: flex; gap: 8px;">
                    <button on:click={openEditEventFlow} title="Modifica Evento" style="background: none; border: none; font-size: 1.2rem; color: var(--accent-color);">🖊️</button>
                    <button on:click={openCreateEventFlow} title="Crea Nuovo Evento" style="background: none; border: none; font-size: 1.2rem; color: var(--success-color);">➕</button>
                </div>
            </div>

            <a href={$eventStore.eventData?.discordLink} target="_blank" class="discord-link">
                📣 Vai alla Chat Discord
            </a>
            
            <div style="text-align: center; margin-bottom: 20px;">
                <p style="font-weight: 600;">Lista Giocatori</p>
            </div>
            
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
            
            <button 
                on:click={closeModal} 
                style="width: 100%; padding: 12px; background: var(--success-color); border: none; border-radius: 8px; font-weight: 700; color: black; margin-top: 20px;"
            >
                CHIUDI
            </button>
        </div>
    </div>
{/if}
