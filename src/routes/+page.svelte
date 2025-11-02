<script>
    import TopNavBar from '$lib/components/TopNavBar.svelte';
    import BottomNavBar from '$lib/components/BottomNavBar.svelte';
    import { fade } from 'svelte/transition';
    import { fly, slide } from 'svelte/transition';
    import { quartOut } from 'svelte/easing';
    import { goto } from '$app/navigation'; 
    
    // --- VARIABILI DI STATO ---
    let showEditModal = false;
    let isEventExpanded = false;
    let isMatchFinished = true; 
    let unreadNotifications = 2; // Stato per la campana notifiche laterale
    
    const isAdmin = true; 
    const LOGO_SRC = "/Scarpari Inside simplelogo_2023.png"; 

    // --- DATI FITTIZI EVENTO LIVE COMPLETO (omessi per brevità) ---
     const liveEvent = { 
        id: 99, 
        title: 'Partita Settimanale', 
        date: 'Sabato 2 Nov, 20:00', 
        time: '20:00',
        duration: 90,
        confirmed: 16, 
        total: 16, 
        location: 'Campo A',
        locationLink: 'https://maps.app.goo.gl/campoa', 
        description: 'Partita regolare valida per la classifica di stagione. Presentarsi in loco 15 minuti prima per il riscaldamento.',
        discordLink: 'https://discord.gg/partita-live-scarpari',
        teams: [
            // ... (teams come prima) ...
             { id: 1, name: 'Team Rosso', color: '#FF4136', players: [
                { name: 'Mario Rossi', role: 'Att', rating: 8.5 },
                { name: 'Giulio Neri', role: 'Cen', rating: 6.9 },
                { name: 'Marco Bianchi', role: 'Por', rating: 9.0 },
                { name: 'Paolo Gialli', role: 'Att', rating: 7.8 },
            ]},
            { id: 2, name: 'Team Blu', color: '#0074D9', players: [
                { name: 'Andrea Blu', role: 'Att', rating: 7.5 },
                { name: 'Simone Azzurro', role: 'Dif', rating: 8.0 },
                { name: 'Davide Marino', role: 'Cen', rating: 7.1 },
                { name: 'Pietro Oceano', role: 'Por', rating: 7.9 },
            ]}
        ]
    };

    // ... (Dati Fittizi Modale inalterati) ...

    function openEditModal(event) { event.stopPropagation(); showEditModal = true; }
    function closeEditModal() { showEditModal = false; }
    function toggleEventExpansion() { isEventExpanded = !isEventExpanded; }
    function handleAdminAction(action) { alert(`Azione amministrativa: ${action} per l'evento ${liveEvent.title}`); closeEditModal(); }
    function startVoting() { goto('/vote'); }
    
    // Funzioni per i nuovi pulsanti di cornice
    function goToGeneralChat() { alert('Naviga alla Chat Generale.'); }
    function showNotifications() { 
        alert('Visualizza il dettaglio delle notifiche.'); 
        unreadNotifications = 0; // Azzera il badge
    }

</script>

<style>
    /* ... (Stili base app-container) ... */
    .app-container {
        max-width: 450px;
        margin: 0 auto;
        min-height: 100vh;
        color: var(--text-color);
        padding: 0 16px;
        padding-top: 70px; 
        padding-bottom: 80px; 
    }
    
    /* Blocco Logo/Cornice (Contiene Chat, Logo e Notifiche) */
    .logo-area {
        display: flex;
        justify-content: space-between; 
        align-items: center;
        padding: 15px 0; 
        margin-top: -15px; 
        position: relative;
    }
    .main-logo {
        height: 90px;
        width: auto;
        opacity: 0.95;
    }
    
    /* Stili per i pulsanti laterali */
    .logo-side-button {
        background: var(--input-bg);
        color: var(--secondary-accent);
        border: none;
        padding: 10px 12px;
        border-radius: 8px;
        font-weight: 600;
        font-size: 0.9rem;
        cursor: pointer;
        transition: background 0.2s;
        white-space: nowrap; 
        text-decoration: none;
        display: flex;
        align-items: center;
        justify-content: center;
        height: 40px; 
        position: relative; /* Per il badge notifiche */
    }
    .logo-side-button:hover {
        background: var(--bg-color);
        color: var(--text-color);
    }
    
    /* Spaziatori per bilanciare la griglia (opzionale, ma aiuta) */
    .logo-area .placeholder {
        min-width: 40px; 
        flex-shrink: 0;
    }

    /* Badge Notifiche */
    .notification-badge {
        position: absolute;
        top: -5px; 
        right: -5px; 
        background: var(--error-color);
        color: white;
        border-radius: 50%;
        width: 14px;
        height: 14px;
        font-size: 0.7rem;
        font-weight: 700;
        display: flex;
        align-items: center;
        justify-content: center;
        line-height: 1;
        transform: scale(0.9);
    }

    /* ... (Il resto degli stili rimane inalterato: dashboard-grid, voting-button, compact-controls, etc.) ... */
    .dashboard-grid {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 15px;
    }
    .voting-button {
        grid-column: 1 / -1; 
        background: var(--warning-color);
        color: black;
        font-weight: 700;
        font-size: 0.9rem;
        padding: 5px 10px;
        height: 25px; 
        display: flex;
        align-items: center;
        justify-content: center;
        border: none;
        border-radius: 12px;
        cursor: pointer;
        box-shadow: 0 2px 5px rgba(0, 0, 0, 0.3);
        transition: background 0.2s;
        margin-top: 5px;
        margin-bottom: 10px;
    }
    /* ... (Omesso il resto degli stili per brevità) ... */
</style>

<svelte:head>
    <title>Scarpa Inside | Home</title>
</svelte:head>

<div class="app-container">
    <TopNavBar />

    <div class="logo-area">
        <button class="logo-side-button placeholder" on:click={goToGeneralChat} title="Chat Generale">
            Chat
        </button>

        <img src={LOGO_SRC} alt="Scarpa Inside Logo" class="main-logo"/>
        
        <button class="logo-side-button placeholder" on:click={showNotifications} title="Notifiche">
            🔔
            {#if unreadNotifications > 0}
                <div class="notification-badge">
                    {unreadNotifications > 9 ? '9+' : unreadNotifications}
                </div>
            {/if}
        </button>
    </div>

    {#if isMatchFinished}
        <button class="voting-button" on:click={startVoting}>
            ⭐ VOTA I GIOCATORI DELLA PARTITA! ⭐
        </button>
    {/if}

    <div class="dashboard-grid">

        <div class="event-live-card-wrapper" class:expanded={isEventExpanded}>
            <div class="event-summary" on:click={toggleEventExpansion} role="button" tabindex="0">
                <div class="card-content">
                    <div>
                        <div class="card-title">{liveEvent.title}</div>
                        <p class="card-text">📍 {liveEvent.location} • ⏰ {liveEvent.time}</p>
                    </div>
                    
                    <div class="compact-controls">
                         {#if isAdmin}
                            <button class="edit-button-compact" on:click={openEditModal} title="Modifica Evento">
                                🖊️
                            </button>
                        {/if}
                        <a href={liveEvent.discordLink} target="_blank" class="discord-link-compact" on:click|stopPropagation title="Chat Discord Evento">
                            <span style="font-size: 1.1rem;">🗨️</span>
                        </a>
                    </div>
                </div>
                <span class="confirmation-status">{liveEvent.confirmed} / {liveEvent.total} Giocatori Assegnati!</span>
            </div>
            
            {#if isEventExpanded}
                <div class="event-details-content" transition:slide={{ duration: 300 }}>
                    <div class="detail-row">
                        <strong>Luogo:</strong> 
                        <a href={liveEvent.locationLink} target="_blank" style="color: var(--accent-color); text-decoration: none;">{liveEvent.location} (Vai su Maps 🗺️)</a>
                    </div>
                    <div class="detail-row"><strong>Orario:</strong> {liveEvent.date} alle {liveEvent.time}</div>
                    <div class="detail-row"><strong>Durata Stimata:</strong> {liveEvent.duration} minuti</div>

                    <p class="description-text">
                        <strong>Descrizione:</strong><br>{liveEvent.description}
                    </p>
                </div>
            {/if}
        </div>

        {#each liveEvent.teams as team (team.id)}
            <div class="card team-card" style="--team-color: {team.color}; border-top: 5px solid {team.color};">
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
        <div class="edit-modal-content panel" role="dialog" aria-modal="true" on:click|stopPropagation transition:fly={{ y: 50, duration: 400, easing: quartOut }}>
            <button class="close-button" on:click={closeEditModal}>×</button>
            <h3>Modifica: {liveEvent.title}</h3>
            
            <button class="action-button save-button" on:click={() => handleAdminAction('Salva Modifiche Evento')}>
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
