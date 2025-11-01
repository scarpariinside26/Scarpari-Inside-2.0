<script>
    import { fly } from 'svelte/transition';
    import { goto } from '$app/navigation';

    // Dati simulati per gli eventi (usati per popolare la dashboard)
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
        alert(`Setup avviato per l'evento ${eventId}. Qui andrà la fetch POST API.`);
        // Qui andrà la chiamata fetch al tuo /api/match-setup/+server.js
        // Dopo la risposta, ricaricare i dati.
    }

    function cleanupMatch(eventId) {
        alert(`Cleanup avviato per l'evento ${eventId}. Qui andrà la fetch POST API.`);
        // Qui andrà la chiamata fetch al tuo /api/match-cleanup/+server.js
    }
    
    function viewRoster(eventId) {
        // Naviga alla pagina di dettaglio evento/voto
        goto(`/match/${eventId}`); 
    }
</script>

<style>
    .event-card {
        background-color: var(--panel-bg);
        border: 1px solid #4a4a75;
        border-radius: 8px;
        padding: 15px;
        margin-bottom: 15px;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
    }

    .section-title {
        color: var(--accent-color-glow);
        font-weight: bold;
        margin-top: 25px;
        margin-bottom: 10px;
        border-bottom: 1px solid var(--accent-color);
        padding-bottom: 5px;
    }
    
    /* Nuovo contenitore per l'allineamento verticale */
    .event-card-inner {
        display: flex;
        flex-direction: column; /* Stack verticale su mobile di default */
        gap: 15px; 
    }
    
    .event-details {
        flex-grow: 1;
        font-size: 0.9em;
    }

    .event-details strong {
        color: var(--text-color-bright);
    }
    
    .event-actions {
        display: flex;
        flex-direction: column; /* Impila i pulsanti */
        gap: 8px; 
        min-width: 180px; /* Larghezza minima per i pulsanti */
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
        width: 100%; /* I pulsanti occupano l'intera larghezza */
    }

    /* Desktop: Allineamento Orizzontale */
    @media (min-width: 769px) {
        .event-card-inner {
            flex-direction: row; /* Torna all'orizzontale su desktop */
            justify-content: space-between;
            align-items: center;
        }
        .event-actions {
            flex-direction: row; /* Pulsanti affiancati su desktop */
        }
    }
</style>

<svelte:head>
    <title>Scarpa Inside | Dashboard</title>
</svelte:head>

<div class="content-header" transition:fly={{ y: -50, duration: 500 }}>
    <h1>Le partite del torneo.</h1>
</div>

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
                    <button class="btn-action btn-primary" on:click={() => viewRoster(event.id)}>
                        Vota / Visualizza Roster
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
