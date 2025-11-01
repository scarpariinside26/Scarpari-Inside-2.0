<script>
    import { fly } from 'svelte/transition';
    import { goto } from '$app/navigation';

    // Dati simulati per gli eventi 
    const mockEvents = [
        { id: 'event-001', day: 'Martedì', title: 'Prova: Partita', date: '01/11/2025', time: '12:42', is_active: false, status: 'In attesa', section: 'Questa settimana' },
        { id: 'event-002', day: 'Venerdì', title: 'Test: Partita', date: '02/11/2025', time: '12:42', is_active: true, status: 'IN CORSO', section: 'Domani' },
        { id: 'event-003', day: 'Martedì', title: 'Torneo 1', date: '08/11/2025', time: '20:00', is_active: false, status: 'Completato', section: 'Prossima settimana' },
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
    
    function manageEvent(eventId) {
        alert(`Azione: Apri Form di Modifica per l'evento ${eventId}.`);
        goto(`/match/${eventId}`); 
    }

    function getStatusClass(status) {
        switch (status) {
            case 'IN CORSO': return 'status-active';
            case 'Completato': return 'status-completed';
            case 'In attesa':
            default: return 'status-pending';
        }
    }
</script>

<style>
    /* 🎨 NUOVI STILI PER IL DESIGN DARK */
    .event-card {
        background: #1f2331; /* Sfondo scuro per contrasto */
        border: 1px solid #4a4a75;
        border-radius: 12px; /* Angoli più arrotondati */
        padding: 20px;
        margin-bottom: 25px; 
        box-shadow: 0 6px 15px rgba(0, 0, 0, 0.4); /* Ombreggiatura più intensa */
        display: block !important; 
        width: 100%;
        transition: transform 0.2s;
    }
    .event-card:hover {
        transform: translateY(-2px); /* Effetto hover leggero */
        box-shadow: 0 8px 20px rgba(0, 0, 0, 0.5);
    }
    
    .section-title {
        color: #70d8ff; /* Accento Azzurro */
        font-weight: 600;
        margin-top: 30px;
        margin-bottom: 15px;
        border-bottom: 1px solid #4a4a75;
        padding-bottom: 8px;
    }
    
    /* GRIGLIA A DUE COLONNE PER L'INFORMAZIONE */
    .event-card-inner {
        display: grid !important; 
        grid-template-areas: 
            "details actions";
        grid-template-columns: 2fr 1fr; /* Dettagli più spazio, Azioni meno */
        gap: 20px; 
        align-items: center;
    }
    
    .event-details {
        grid-area: details;
        padding-right: 20px;
    }

    .event-details p {
        margin: 5px 0;
        color: #b0b8c6;
    }

    .event-details strong {
        color: var(--text-color-bright);
    }
    
    /* AREA AZIONI E STATO */
    .event-actions {
        grid-area: actions;
        display: flex !important; 
        flex-direction: column !important; 
        gap: 10px; 
        min-width: 100%; 
    }

    /* Stili per il badge di stato ispirati al design */
    .status-badge {
        font-weight: bold;
        padding: 6px 10px;
        border-radius: 6px;
        text-align: center;
        margin-bottom: 10px;
        color: #ffffff; 
        font-size: 0.9em;
    }
    .status-active { background-color: #38b44a; } /* Verde - In corso */
    .status-completed { background-color: #2b70b4; } /* Blu - Completato */
    .status-pending { background-color: #f7931e; } /* Arancione - In attesa */

    .btn-action {
        width: 100%; 
        font-weight: 600;
        padding: 10px;
    }

    /* 📱 MEDIA QUERY per Mobile (ritorniamo al layout verticale) */
    @media (max-width: 700px) {
        .event-card-inner {
            grid-template-areas: 
                "details"
                "actions";
            grid-template-columns: 1fr;
        }
        .event-details {
            padding-right: 0;
            border-bottom: 1px dashed #4a4a75;
            padding-bottom: 15px;
            margin-bottom: 10px;
        }
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
                        <p style="font-size: 1.3em; font-weight: bold; color: var(--text-color-bright); margin-bottom: 10px;">
                            {event.title} - {event.day}
                        </p>
                        <p>
                            Data: <strong>{event.date}</strong> alle <strong>{event.time}</strong>
                        </p>
                        <p>
                            ID Evento: <strong>{event.id}</strong>
                        </p>
                    </div>
                    
                    <div class="event-actions">
                         <div class="status-badge {getStatusClass(event.status)}">
                            STATO: {event.status.toUpperCase()}
                        </div>
                        
                        <button class="btn-action btn-primary" on:click={() => manageEvent(event.id)}>
                            Modifica / Gestisci Evento
                        </button>
                        
                        {#if event.status === 'In attesa'}
                            <button class="btn-action btn-success" on:click={() => startMatch(event.id)}>
                                Avvia Partita
                            </button>
                        {:else if event.status === 'IN CORSO'}
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
