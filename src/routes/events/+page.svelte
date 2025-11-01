<script>
    import TopNavBar from '$lib/components/TopNavBar.svelte';
    import { fade, fly } from 'svelte/transition';

    let isModalOpen = false;
    let selectedEvent = null;

    // Dati evento simulati
    const events = [
        { id: 1, title: "Partita Settimanale", date: "Sabato 2 Nov, 20:00", confirmed: 10, total: 10, location: "Campo A" },
        { id: 2, title: "Torneo Amichevole", date: "Domenica 10 Nov, 16:00", confirmed: 6, total: 12, location: "Campo B" },
    ];

    // Dati simulati dei giocatori e delle squadre per l'evento
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
    
    // Funzione per aprire la modale (visualizza i partecipanti)
    function openParticipantsModal(event) {
        selectedEvent = event;
        isModalOpen = true;
    }

    // Variabile per alternare tra la visualizzazione lista e campo
    let viewMode = 'list'; // 'list' o 'field'

    // Funzioni per la modale (per risolvere i warning a11y)
    function closeModal() {
        isModalOpen = false;
    }
    function handleBackdropClick(event) {
        if (event.target.classList.contains('modal-backdrop')) {
            closeModal();
        }
    }
</script>

<style>
    /* ------------------------------------- */
    /* Stili Generali Pagina */
    /* ------------------------------------- */
    .app-container {
        max-width: 450px;
        margin: 0 auto;
        min-height: 100vh;
        color: var(--text-color);
        padding: 0 16px;
        padding-bottom: 20px;
    }

    /* Stili Card Evento */
    .event-list {
        display: flex;
        flex-direction: column;
        gap: 15px;
        margin-top: 20px;
    }
    .event-card {
        background: var(--panel-bg);
        border-radius: 12px;
        padding: 15px;
        cursor: pointer;
        transition: transform 0.2s, box-shadow 0.2s;
        border-left: 5px solid var(--accent-color);
    }
    .event-card:hover {
        transform: translateY(-2px);
        box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
    }
    .event-title {
        font-size: 1.2rem;
        font-weight: 700;
        color: var(--text-color-bright);
    }
    .event-details {
        font-size: 0.85rem;
        color: var(--secondary-accent);
        margin-top: 5px;
    }
    .confirmation-status {
        font-weight: 700;
        color: var(--success-color);
    }

    /* ------------------------------------- */
    /* Stili Modale (Aperta) */
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
        /* Risoluzione a11y: Uso un pulsante per il click sullo sfondo */
        /* Non si può usare un <button> come backdrop per motivi di layout, usiamo `aria-modal` */
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
    
    /* ------------------------------------- */
    /* Stili Layout Partecipanti */
    /* ------------------------------------- */
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
        border-left: 4px solid var(--team-list-color); /* Verrà iniettato */
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
        height: 350px; /* Altezza fissa per la visualizzazione */
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
        transform: translate(-50%, -50%); /* Centra il marker sulla posizione */
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

    /* Posizioni per Team 1 (Destra) - Simulazione 3-1-1 */
    .pos-1-1 { top: 50%; left: 90%; } /* Portiere */
    .pos-1-2 { top: 25%; left: 70%; } /* Difesa D */
    .pos-1-3 { top: 50%; left: 65%; } /* Difesa C */
    .pos-1-4 { top: 75%; left: 70%; } /* Difesa S */
    .pos-1-5 { top: 50%; left: 45%; } /* Centrocampo */
    .pos-1-6 { top: 25%; left: 25%; } /* Attacco D */
    .pos-1-7 { top: 75%; left: 25%; } /* Attacco S */
    
    /* Posizioni per Team 2 (Sinistra) - Simulazione 3-1-1 */
    .pos-2-1 { top: 50%; left: 10%; } /* Portiere */
    .pos-2-2 { top: 25%; left: 30%; } /* Difesa D */
    .pos-2-3 { top: 50%; left: 35%; } /* Difesa C */
    .pos-2-4 { top: 75%; left: 30%; } /* Difesa S */
    .pos-2-5 { top: 50%; left: 55%; } /* Centrocampo */
    .pos-2-6 { top: 25%; left: 75%; } /* Attacco D */
    .pos-2-7 { top: 75%; left: 75%; } /* Attacco S */

</style>

<svelte:head>
    <title>Scarpa Inside | Eventi</title>
</svelte:head>

<div class="app-container">
    <TopNavBar />

    <h1 class="page-title" transition:fly={{ y: -50, duration: 500 }}>
        Lista Eventi
    </h1>

    <div class="event-list">
        {#each events as event (event.id)}
            <button 
                class="event-card panel" 
                on:click={() => openParticipantsModal(event)}
            >
                <div class="event-title">{event.title}</div>
                <div class="event-details">
                    {event.date} • {event.location}
                    <span class="confirmation-status">({event.confirmed}/{event.total} Confermati)</span>
                </div>
            </button>
        {/each}
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
                
                <h3>Partecipanti: {selectedEvent.title}</h3>

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
                        Clicca sul pallino per vedere i dettagli del giocatore (non implementato).
                    </div>
                {/if}
            </div>
        </div>
    {/if}
</div>
