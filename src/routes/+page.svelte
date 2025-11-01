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
    
    /* 🚀 CORREZIONE: Layout verticale forzato per tutti gli schermi */
    .event-card-inner {
        /* Non usiamo Grid o Flex, usiamo solo blocchi per impilare */
        display: block !important; 
        padding: 0;
    }
    
    .event-details {
        /* Area dei dettagli */
        padding-bottom: 15px;
        border-bottom: 1px dashed #4a4a75;
        margin-bottom: 15px;
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
        /* FORZATURA TOTALE: SEMPRE una colonna */
        display: flex !important; 
        flex-direction: column !important; 
        gap: 10px; 
        min-width: 100%; 
    }

    /* Stili per il badge di stato */
    .status-badge {
        font-weight: bold;
        padding: 8px 10px;
        border-radius: 6px;
        text-align: center;
        margin-bottom: 10px;
        color: #ffffff; 
        font-size: 1em;
    }
    .status-active { background-color: #38b44a; } /* Verde - IN CORSO */
    .status-completed { background-color: #2b70b4; } /* Blu - Completato */
    .status-pending { background-color: #f7931e; } /* Arancione - In attesa */

    .btn-action {
        width: 100%; 
        font-weight: 600;
        padding: 10px;
    }
    
    /* Media query rimossa: il layout è sempre verticale */
</style>

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
