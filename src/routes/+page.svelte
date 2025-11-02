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
    let isMatchFinished = true; // Imposta su TRUE per mostrare il pulsante Vota
    let unreadNotifications = 2; 
    
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

    // --- Dati Fittizi per Modale (omessi per brevità) ---
    const availableLocations = ['Campo A', 'Campo B', 'Campo C', 'Stadio Comunale'];
    const availableDurations = [60, 90, 120];
    const availableTimes = Array.from({ length: 10 }, (_, i) => {
        const hour = 18 + Math.floor(i / 2);
        const minute = (i % 2) * 30;
        return `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;
    });

    function openEditModal(event) { event.stopPropagation(); showEditModal = true; }
    function closeEditModal() { showEditModal = false; }
    function toggleEventExpansion() { isEventExpanded = !isEventExpanded; }
    function handleAdminAction(action) { alert(`Azione amministrativa: ${action} per l'evento ${liveEvent.title}`); closeEditModal(); }
    function startVoting() { goto('/vote'); }
    
    function goToGeneralChat() { alert('Naviga alla Chat Generale.'); }
    function showNotifications() { 
        alert('Visualizza il dettaglio delle notifiche.'); 
        unreadNotifications = 0; 
    }

</script>

<style>
    .app-container {
        max-width: 450px;
        margin: 0 auto;
        min-height: 100vh;
        color: var(--text-color);
        padding: 0 16px;
        padding-top: 70px; 
        padding-bottom: 80px; 
    }
    
    /* Blocco Logo/Cornice */
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
        position: relative;
    }
    .logo-side-button:hover {
        background: var(--bg-color);
        color: var(--text-color);
    }
    .logo-area .placeholder {
        min-width: 40px; 
        flex-shrink: 0;
    }
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

    /* Griglia Dashboard (Contiene Card Evento e 4 Squadre) */
    .dashboard-grid {
        display: grid;
        grid-template-columns: 1fr 1fr; /* Le 4 card delle squadre si allineano correttamente qui */
        gap: 15px;
    }
    .card {
        background: var(--panel-bg);
        border-radius: 12px;
        padding: 15px;
        box-shadow: 0 4px 10px rgba(0, 0, 0, 0.4);
        text-align: left;
        overflow: hidden;
    }
    
    /* Votazioni Pulsante - Contenitore per centratura al fondo */
    .voting-button-bottom-wrapper {
        width: 100%;
        margin-top: 25px; /* Spazio dopo le card delle squadre */
        display: flex;
        justify-content: center; /* Centra il pulsante all'interno */
        padding-bottom: 5px;
    }
    .voting-button {
        /* Stile per pulsante sottile e centrato */
        background: var(--warning-color);
        color: black;
        font-weight: 700;
        font-size: 0.9rem;
        padding: 5px 15px;
        height: 25px; 
        display: flex;
        align-items: center;
        justify-content: center;
        border: none;
        border-radius: 12px;
        cursor: pointer;
        box-shadow: 0 2px 5px rgba(0, 0, 0, 0.3);
        transition: background 0.2s;
        /* Limita la larghezza per renderlo più snello */
        max-width: 300px; 
        width: 100%;
    }
    .voting-button:hover {
        background: var(--warning-color-dark);
    }
    
    /* Stili Card Evento (non modificati) */
    .event-live-card-wrapper { grid-column: 1 / -1; transition: transform 0.2s; }
    .event-summary { border-left: 5px solid var(--accent-color); cursor: pointer; padding: 10px 15px; background: var(--panel-bg); border-radius: 12px; transition: border-radius 0.3s; }
    .event-live-card-wrapper.expanded .event-summary { border-bottom-left-radius: 0; border-bottom-right-radius: 0; }
    .card-content { display: flex; justify-content: space-between; align-items: flex-start; }
    .card-title { font-size: 1.1rem; font-weight: 800; color: var(--text-color-bright); margin-bottom: 5px; }
    .card-text { font-size: 0.85rem; color: var(--secondary-accent); }
    .confirmation-status { font-weight: 700; color: var(--success-color); margin-top: 5px; display: block; }
    .compact-controls { display: flex; flex-direction: column; gap: 5px; }
    .compact-controls a, .compact-controls button { text-decoration: none; padding: 8px; width: 35px; height: 35px; border-radius: 6px; font-size: 0.9rem; font-weight: 700; transition: background 0.2s; cursor: pointer; display: flex; justify-content: center; align-items: center; }
    .discord-link-compact { background: #7289da; color: white; }
    .edit-button-compact { background: var(--accent-color); color: black; border: none; }
    .team-name { font-weight: 800; font-size: 0.9rem; color: var(--team-color); margin-bottom: 5px; text-align: center; border-bottom: 2px solid var(--team-color); padding-bottom: 3px; }
    .team-players-list { font-size: 0.75rem; list-style: none; padding: 0; margin: 0; }
    .player-entry { display: flex; justify-content: space-between; line-height: 1.5; }
    .player-entry-rating { font-weight: 700; color: var(--success-color); }
    
    /* Stili Modale (omessi per brevità) */
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

    {#if isMatchFinished}
        <div class="voting-button-bottom-wrapper" transition:fly={{ y: -10, duration: 300 }}>
            <button class="voting-button" on:click={startVoting}>
                ⭐ VOTA I GIOCATORI DELLA PARTITA! ⭐
            </button>
        </div>
    {/if}

    <BottomNavBar />
</div>

{#if showEditModal}
    <div class="edit-modal-backdrop" transition:fade={{ duration: 300 }} on:click={closeEditModal}>
        <div class="edit-modal-content panel" role="dialog" aria-modal="true" on:click|stopPropagation transition:fly={{ y: 50, duration: 400, easing: quartOut }}>
            <button class="close-button" on:click={closeEditModal}>×</button>
            <h3>Modifica: {liveEvent.title}</h3>
            
            <div class="form-group">
                <label for="event-location">Luogo</label>
                <select id="event-location">
                    <option value={liveEvent.location}>{liveEvent.location}</option>
                    {#each availableLocations.filter(loc => loc !== liveEvent.location) as loc}
                        <option value={loc}>{loc}</option>
                    {/each}
                </select>
            </div>
            
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
