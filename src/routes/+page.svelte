<script>
    import { fly } from 'svelte/transition';
    import { goto } from '$app/navigation';

    // Dati simulati per gli eventi 
    const mockEvents = [
        { id: 'event-001', day: 'Martedì', title: 'Prova: Partita', date: '01/11/2025', time: '12:42', is_active: false, status: 'In attesa di Setup', section: 'Questa settimana' },
        { id: 'event-002', day: 'Venerdì', title: 'Test: Partita', date: '02/11/2025', time: '12:42', is_active: true, status: 'PARTITA ATTIVA', section: 'Domani' },
        { id: 'event-003', day: 'Martedì', title: 'Torneo 1', date: '08/11/2025', time: '20:00', is_active: false, status: 'In attesa di Setup', section: 'Prossima settimana' },
    ];

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

    function startMatch(eventId) {
        alert(`Setup avviato per l'evento ${eventId}.`);
    }

    function cleanupMatch(eventId) {
        alert(`Cleanup avviato per l'evento ${eventId}.`);
    }
    
    // 🚀 NUOVA FUNZIONE: Gestisce la modifica/navigazione avanzata
    function manageEvent(eventId) {
        // In un'app reale, qui reindirizzeremmo a una rotta per la modifica dell'evento:
        // goto(`/event/edit/${eventId}`);
        alert(`Azione: Apri Form di Modifica per l'evento ${eventId}.`);
        
        // Manteniamo la navigazione alla rotta match/ per il momento, come richiesto
        goto(`/match/${eventId}`); 
    }
</script>

<style>
    /* ⚠️ STILI DI BASE E FORZATURE PER IL LAYOUT (Mantenuti per evitare il problema cache) */
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
    
    /* STRUTTURA INTERNA: Grid per un layout a due aree verticali (FORZATO) */
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
                        </p>
                        <p>
                            Data: <strong>{event.date}</strong> alle <strong>{event.time}</strong>
                        </p>
                        <p class="{event.is_active ? 'active-status' : 'match-status'}">
                            Stato: {event.status}
                        </p>
                    </div>
                    
                    <div class="event-actions">
                        <button class="btn-action btn-primary" on:click={() => manageEvent(event.id)}>
                            Modifica / Gestisci Evento
                        </button>
                        
                        {#if !event.is_active}
                            <button class="btn-action btn-success" on:click={() => startMatch(event.id)}>
                                Avvia Partita
                            </button>
                        {:else}
                            <button class="btn-action btn-danger" on:click={() => cleanupMatch(event.id)}>
                                Pulisci Partita
                            </button>
                        {/if}
                    </div>
                </div>
            </div>
        {/each}
    {/each}
</div>
