<script>
    import { fly } from 'svelte/transition';
    import { goto } from '$app/navigation';

    // 🎯 STATO GLOBALE - Sostituirai con backend
    let mockEvents = [
        { 
            id: 'event-001', 
            day: 'Martedì', 
            title: 'Prova: Partita', 
            date: '01/11/2025', 
            time: '12:42', 
            is_active: false, 
            status: 'In attesa di Setup', 
            section: 'Questa settimana',
            discordInviteLink: 'https://discord.gg/tuo-invite-001',
            hasDiscordChat: true,
            onlinePlayers: 8,
            participants: ['Marco', 'Luca', 'Giulia', 'Paolo']
        },
        { 
            id: 'event-002', 
            day: 'Venerdì', 
            title: 'Test: Partita', 
            date: '02/11/2025', 
            time: '12:42', 
            is_active: true, 
            status: 'PARTITA ATTIVA', 
            section: 'Domani',
            discordInviteLink: 'https://discord.gg/tuo-invite-002', 
            hasDiscordChat: true,
            onlinePlayers: 12,
            participants: ['Andrea', 'Simone', 'Francesca', 'Riccardo', 'Elena']
        },
        { 
            id: 'event-003', 
            day: 'Martedì', 
            title: 'Torneo 1', 
            date: '08/11/2025', 
            time: '20:00', 
            is_active: false, 
            status: 'In attesa di Setup', 
            section: 'Prossima settimana',
            discordInviteLink: null,
            hasDiscordChat: false,
            onlinePlayers: 0,
            participants: []
        },
    ];

    // 🎯 STATO PER MODIFICA EVENTO
    let editingEvent = null;
    let showEditModal = false;

    function getEventsBySection(events) {
        return events.reduce((acc, event) => {
            if (!acc[event.section]) {
                acc[event.section] = [];
            }
            acc[event.section].push(event);
            return acc;
        }, {});
    }

    const sections = getEventsBySection(mockEvents);

    // 🎯 FUNZIONI ESISTENTI
    function startMatch(eventId) {
        alert(`Setup avviato per l'evento ${eventId}.`);
        // Aggiorna stato evento
        mockEvents = mockEvents.map(event => 
            event.id === eventId ? { ...event, is_active: true, status: 'PARTITA ATTIVA' } : event
        );
    }

    function cleanupMatch(eventId) {
        alert(`Cleanup avviato per l'evento ${eventId}.`);
        // Aggiorna stato evento
        mockEvents = mockEvents.map(event => 
            event.id === eventId ? { ...event, is_active: false, status: 'In attesa di Setup' } : event
        );
    }
    
    function manageEvent(eventId) {
        goto(`/match/${eventId}`);
    }

    // 🆕 FUNZIONI MODIFICA EVENTO
    function editEvent(event) {
        editingEvent = { ...event }; // Copia l'evento
        showEditModal = true;
    }

    function saveEvent() {
        if (editingEvent) {
            // Aggiorna l'evento nell'array
            mockEvents = mockEvents.map(event => 
                event.id === editingEvent.id ? editingEvent : event
            );
            closeEditModal();
        }
    }

    function closeEditModal() {
        showEditModal = false;
        editingEvent = null;
    }

    // 🆕 FUNZIONE DISCORD
    function openDiscordChat(event) {
        if (event.discordInviteLink) {
            window.open(event.discordInviteLink, '_blank');
        } else {
            alert('Chat Discord non ancora disponibile per questo evento');
        }
    }

    // 🆕 FUNZIONE AGGIUNGI PARTECIPANTE
    function addParticipant(eventId, participantName) {
        if (participantName.trim()) {
            mockEvents = mockEvents.map(event => 
                event.id === eventId 
                    ? { ...event, participants: [...event.participants, participantName.trim()] }
                    : event
            );
        }
    }

    // 🆕 FUNZIONE RIMUOVI PARTECIPANTE
    function removeParticipant(eventId, participantIndex) {
        mockEvents = mockEvents.map(event => 
            event.id === eventId 
                ? { 
                    ...event, 
                    participants: event.participants.filter((_, index) => index !== participantIndex) 
                  }
                : event
        );
    }
</script>

<style>
    /* ⚠️ MANTIENI TUTTI I TUOI STILI ESISTENTI */
    .event-card {
        background-color: var(--panel-bg);
        border: 1px solid #4a4a75;
        border-radius: 8px;
        padding: 15px;
        margin-bottom: 30px; 
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
        display: block !important; 
        width: 100%;
    }

    .section-title {
        color: var(--accent-color-glow);
        font-weight: bold;
        margin-top: 25px;
        margin-bottom: 10px;
        border-bottom: 1px solid var(--accent-color);
        padding-bottom: 5px;
    }
    
    .event-card-inner {
        display: grid !important; 
        grid-template-areas: 
            "details"
            "actions";
        grid-template-columns: 1fr;
        gap: 15px; 
    }
    
    .event-details {
        grid-area: details;
        font-size: 0.9em;
        padding-bottom: 15px;
        border-bottom: 1px dashed #4a4a75;
    }

    .event-details strong {
        color: var(--text-color-bright);
    }
    
    .event-actions {
        grid-area: actions;
        display: flex !important; 
        flex-direction: column !important; 
        gap: 8px; 
        min-width: 100%; 
        margin-top: 5px;
    }

    .match-status {
        font-weight: bold;
        color: var(--warning-color); 
        margin-bottom: 5px;
    }
    .active-status {
        color: var(--success-color);
    }

    .btn-action {
        width: 100%; 
    }

    /* 🆕 STILI AGGIUNTI */
    .discord-badge {
        display: inline-flex;
        align-items: center;
        gap: 6px;
        background: var(--success-color);
        color: white;
        padding: 4px 10px;
        border-radius: 12px;
        font-size: 0.8em;
        text-decoration: none;
        margin-left: 10px;
        cursor: pointer;
        transition: all 0.2s ease;
    }

    .discord-badge:hover {
        background: var(--primary-color);
        transform: scale(1.05);
    }

    .discord-badge.inactive {
        background: var(--text-muted);
        cursor: not-allowed;
    }

    .btn-discord {
        background: #5865F2 !important;
        color: white !important;
        border: none !important;
    }

    .btn-discord:hover {
        background: #4752C4 !important;
    }

    .online-count {
        font-size: 0.8em;
        color: var(--success-color);
        margin-top: 5px;
    }

    /* 🆕 STILI PARTECIPANTI */
    .participants-section {
        margin-top: 10px;
        padding-top: 10px;
        border-top: 1px dashed #4a4a75;
    }

    .participants-list {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
        margin: 8px 0;
    }

    .participant-tag {
        background: var(--bg-secondary);
        padding: 4px 8px;
        border-radius: 12px;
        font-size: 0.8em;
        display: flex;
        align-items: center;
        gap: 4px;
    }

    .remove-participant {
        background: none;
        border: none;
        color: var(--error-color);
        cursor: pointer;
        padding: 0;
        font-size: 0.9em;
    }

    .add-participant {
        display: flex;
        gap: 8px;
        margin-top: 8px;
    }

    .add-participant input {
        flex: 1;
        padding: 4px 8px;
        border: 1px solid var(--border-light);
        border-radius: 4px;
        background: var(--bg-primary);
        color: var(--text-primary);
    }

    /* 🆕 MODALE MODIFICA */
    .modal-overlay {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.7);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 1000;
    }

    .modal-content {
        background: var(--panel-bg);
        padding: 20px;
        border-radius: 8px;
        width: 90%;
        max-width: 500px;
        max-height: 80vh;
        overflow-y: auto;
    }

    .form-group {
        margin-bottom: 15px;
    }

    .form-group label {
        display: block;
        margin-bottom: 5px;
        font-weight: bold;
    }

    .form-group input, .form-group select {
        width: 100%;
        padding: 8px;
        border: 1px solid var(--border-light);
        border-radius: 4px;
        background: var(--bg-primary);
        color: var(--text-primary);
    }

    .modal-actions {
        display: flex;
        gap: 10px;
        justify-content: flex-end;
        margin-top: 20px;
    }
</style>

<svelte:head>
    <title>Scarpa Inside | Dashboard</title>
</svelte:head>

<div class="content-header" transition:fly={{ y: -50, duration: 500 }}>
    <h1>Le partite del torneo.</h1>
</div>

<div class="event-list-container"> 
    {#each Object.entries(sections) as [sectionTitle, events]}
        <h2 class="section-title">{sectionTitle}</h2>
        
        {#each events as event (event.id)}
            <div class="event-card" transition:fly={{ x: 50, duration: 500 }}>
                <div class="event-card-inner">
                    <div class="event-details">
                        <p style="font-size: 1.2em; font-weight: bold; color: var(--accent-color);">{event.day}</p>
                        <p style="font-size: 1.1em; font-weight: bold; margin-bottom: 5px;">
                            {event.title}
                            {#if event.is_active}
                                <span style="color: var(--success-color); font-size: 0.8em; margin-left: 5px;">(Attiva)</span>
                            {/if}
                            
                            {/* BADGE DISCORD */}
                            {#if event.hasDiscordChat}
                                <span class="discord-badge" on:click={() => openDiscordChat(event)}>
                                    💬 Chat
                                    {#if event.onlinePlayers > 0}
                                        <span>({event.onlinePlayers})</span>
                                    {/if}
                                </span>
                            {:else}
                                <span class="discord-badge inactive">
                                    💬 Presto
                                </span>
                            {/if}
                        </p>
                        <p>
                            Data: <strong>{event.date}</strong> alle <strong>{event.time}</strong>
                        </p>
                        <p class="{event.is_active ? 'active-status' : 'match-status'}">
                            Stato: {event.status}
                        </p>

                        {/* CONTATORE ONLINE */}
                        {#if event.onlinePlayers > 0}
                            <p class="online-count">
                                🟢 {event.onlinePlayers} giocatori in chat
                            </p>
                        {/if}

                        {/* 🆕 SEZIONE PARTECIPANTI */}
                        <div class="participants-section">
                            <strong>Partecipanti ({event.participants.length}):</strong>
                            <div class="participants-list">
                                {#each event.participants as participant, index}
                                    <div class="participant-tag">
                                        {participant}
                                        <button class="remove-participant" on:click={() => removeParticipant(event.id, index)}>
                                            ✕
                                        </button>
                                    </div>
                                {/each}
                            </div>
                            <div class="add-participant">
                                <input 
                                    type="text" 
                                    placeholder="Aggiungi partecipante..."
                                    on:keydown={(e) => {
                                        if (e.key === 'Enter') {
                                            addParticipant(event.id, e.target.value);
                                            e.target.value = '';
                                        }
                                    }}
                                />
                                <button class="btn-action" on:click={() => {
                                    const input = event.target.previousElementSibling;
                                    addParticipant(event.id, input.value);
                                    input.value = '';
                                }}>+</button>
                            </div>
                        </div>
                    </div>
                    
                    <div class="event-actions">
                        {/* 🆕 BOTTONE MODIFICA */}
                        <button class="btn-action btn-primary" on:click={() => editEvent(event)}>
                            ✏️ Modifica Evento
                        </button>

                        <button class="btn-action btn-primary" on:click={() => manageEvent(event.id)}>
                            ⚙️ Gestisci Evento
                        </button>
                        
                        {/* BOTTONE DISCORD */}
                        {#if event.hasDiscordChat}
                            <button class="btn-action btn-discord" on:click={() => openDiscordChat(event)}>
                                💬 Apri Chat Discord
                            </button>
                        {/if}
                        
                        {#if !event.is_active}
                            <button class="btn-action btn-success" on:click={() => startMatch(event.id)}>
                                🚀 Avvia Partita
                            </button>
                        {:else}
                            <button class="btn-action btn-danger" on:click={() => cleanupMatch(event.id)}>
                                🧹 Pulisci Partita
                            </button>
                        {/if}
                    </div>
                </div>
            </div>
        {/each}
    {/each}
</div>

<!-- 🆕 MODALE MODIFICA EVENTO -->
{#if showEditModal && editingEvent}
    <div class="modal-overlay" on:click={closeEditModal}>
        <div class="modal-content" on:click|stopPropagation>
            <h2>Modifica Evento</h2>
            
            <div class="form-group">
                <label>Titolo:</label>
                <input 
                    type="text" 
                    bind:value={editingEvent.title}
                />
            </div>
            
            <div class="form-group">
                <label>Giorno:</label>
                <select bind:value={editingEvent.day}>
                    <option value="Lunedì">Lunedì</option>
                    <option value="Martedì">Martedì</option>
                    <option value="Mercoledì">Mercoledì</option>
                    <option value="Giovedì">Giovedì</option>
                    <option value="Venerdì">Venerdì</option>
                    <option value="Sabato">Sabato</option>
                    <option value="Domenica">Domenica</option>
                </select>
            </div>
            
            <div class="form-group">
                <label>Data:</label>
                <input 
                    type="text" 
                    bind:value={editingEvent.date}
                    placeholder="GG/MM/AAAA"
                />
            </div>
            
            <div class="form-group">
                <label>Ora:</label>
                <input 
                    type="text" 
                    bind:value={editingEvent.time}
                    placeholder="HH:MM"
                />
            </div>
            
            <div class="form-group">
                <label>Link Discord:</label>
                <input 
                    type="text" 
                    bind:value={editingEvent.discordInviteLink}
                    placeholder="https://discord.gg/..."
                />
            </div>
            
            <div class="modal-actions">
                <button class="btn-action" on:click={closeEditModal}>Annulla</button>
                <button class="btn-action btn-success" on:click={saveEvent}>Salva</button>
            </div>
        </div>
    </div>
{/if}
