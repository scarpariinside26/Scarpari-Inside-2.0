<script>
    export let data; 
    
    const BOT_VERCEL_URL = 'https://scarpari-inside-20.vercel.app'; 
    
    // Correzione errore sintassi Svelte/Vite
    const SUCCESS_COLOR = 'var(--success-color)';
    const DEFAULT_COLOR = '#ccc'; 

    let processingEventId = null;

    async function handleMatchAction(eventId, action, channelId = null) {
        processingEventId = eventId;
        
        const endpoint = action === 'setup' ? 'match-setup' : 'match-cleanup';
        
        try {
            const response = await fetch(`${BOT_VERCEL_URL}/api/${endpoint}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    eventId: eventId,
                    matchOwnerId: data.loggedInUserId, 
                    channelId: channelId 
                })
            });

            const result = await response.json();

            if (response.ok) {
                alert(`✅ Azione '${action.toUpperCase()}' completata!`);
            } else {
                // L'errore del server ora dovrebbe apparire qui se non è un errore di rete
                alert(`❌ Errore in '${action.toUpperCase()}': ${result.detail || result.error || 'Errore sconosciuto.'}`);
            }

        } catch (e) {
            alert(`❌ Errore di rete: Impossibile connettersi a ${BOT_VERCEL_URL}. Questo potrebbe essere un problema CORS.`);
        } finally {
            processingEventId = null;
        }
    }
</script>

<style>
    .event-list { display: grid; gap: 15px; margin-top: 20px; }
    .event-card { padding: 15px; display: flex; justify-content: space-between; align-items: center; }
    .event-info h3 { margin: 0 0 5px 0; color: var(--text-color); border: none; padding: 0; }
    .event-info p { margin: 0; color: rgba(224, 224, 255, 0.7); font-size: 0.9em; }
    .action-buttons { display: flex; gap: 10px; flex-shrink: 0; }
    .btn-vote { background-color: #5555ff; color: white; }
    .btn-vote:hover { background-color: #4444dd; }
</style>

<div class="panel">
    <h1>Dashboard Eventi</h1>
    <p>Interfaccia per avviare, votare e terminare le partite del torneo.</p>
</div>

<div class="event-list">
    {#each data.events as event}
        <div class="event-card card">
            <div class="event-info">
                <p style="font-size: 0.8em; color: var(--accent-color); margin-bottom: 5px;">{event.status_text}</p>
                <h3>{event.title}</h3>
                <p>Data: {new Date(event.date_time).toLocaleDateString()} alle {new Date(event.date_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                
                <p style="margin-top: 5px; font-weight: bold; color: {event.is_active ? SUCCESS_COLOR : DEFAULT_COLOR}">
                    Stato: {event.is_active ? 'PARTITA ATTIVA' : 'In attesa di Setup'}
                </p>
            </div>
            
            <div class="action-buttons">
                <a href="/match/{event.id}">
                    <button class="btn-vote">Vota / Visualizza Roster</button>
                </a>

                {#if event.is_owner}
                    {#if !event.is_active}
                        <button 
                            on:click={() => handleMatchAction(event.id, 'setup')}
                            disabled={processingEventId === event.id}
                            class="btn-success"
                        >
                            {processingEventId === event.id ? 'Avviando...' : 'Avvia Partita (Setup)'}
                        </button>
                    {:else}
                        <button 
                            on:click={() => handleMatchAction(event.id, 'cleanup', event.channel_id)}
                            disabled={processingEventId === event.id}
                            class="btn-danger"
                        >
                            {processingEventId === event.id ? 'Pulendo...' : 'Pulisci Partita (Cleanup)'}
                        </button>
                    {/if}
                {/if}
            </div>
        </div>
    {/each}
</div>
