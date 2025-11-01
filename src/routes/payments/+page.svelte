<script>
    import TopNavBar from '$lib/components/TopNavBar.svelte';
    import { slide, fly } from 'svelte/transition';
    import { quintOut } from 'svelte/easing';

    // Colore primario della maglia (simulato)
    const TEAM_COLOR = '#00CED1'; // Blu ciano (come un colore accentuato)
    const SUCCESS_COLOR = 'var(--success-color)';

    // Dati simulati dei giocatori
    let players = [
        { id: 1, name: 'Mario Rossi', present: true, payment: 10, method: 'cash', late: false, yellowCard: false, completed: false, timestamp: null, collapsed: false },
        { id: 2, name: 'Andrea Bianchi', present: true, payment: 10, method: 'digital', late: false, yellowCard: false, completed: false, timestamp: null, collapsed: false },
        { id: 3, name: 'Luca Verdi', present: true, payment: 10, method: 'cash', late: false, yellowCard: false, completed: false, timestamp: null, collapsed: false },
        { id: 4, name: 'Simone Neri', present: false, payment: 10, method: 'cash', late: false, yellowCard: false, completed: false, timestamp: null, collapsed: false },
        { id: 5, name: 'Paolo Gialli', present: true, payment: 10, method: 'cash', late: false, yellowCard: false, completed: false, timestamp: null, collapsed: false },
    ];

    // Simula i dati della partita
    const matchInfo = {
        date: '25/09/2025',
        opponent: 'Squadra Avversaria',
        costPerPlayer: 10.00
    };
    
    // Funzione per formattare il timestamp
    function getTimestamp() {
        const now = new Date();
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        const seconds = String(now.getSeconds()).padStart(2, '0');
        return `${hours}:${minutes}:${seconds}`;
    }

    /**
     * Completa la riga del giocatore, aggiunge timestamp e la collassa.
     * @param {number} id - ID del giocatore
     */
    function completeTracking(id) {
        players = players.map(p => {
            if (p.id === id && p.present) {
                return { 
                    ...p, 
                    completed: true, 
                    timestamp: getTimestamp(),
                    collapsed: true // Chiudi automaticamente
                };
            }
            return p;
        });
        
        // Ordina immediatamente in modo che i completati vadano in fondo
        players = sortAndArrangePlayers(players);
    }

    /**
     * Riporta il giocatore allo stato incompleto per la correzione.
     * @param {number} id - ID del giocatore
     */
    function uncompleteTracking(id) {
        players = players.map(p => {
            if (p.id === id) {
                return { ...p, completed: false, timestamp: null, collapsed: false };
            }
            return p;
        });
        
        // Riordina per riportare il giocatore in cima
        players = sortAndArrangePlayers(players);
    }

    /**
     * Gestisce l'apertura/chiusura della scheda completata.
     * @param {number} id - ID del giocatore
     */
    function toggleCollapse(id) {
        players = players.map(p => {
            if (p.id === id && p.completed) {
                return { ...p, collapsed: !p.collapsed };
            }
            return p;
        });
    }

    /**
     * Ordina alfabeticamente e sposta i completati in fondo.
     * @param {Array} list - Lista dei giocatori
     */
    function sortAndArrangePlayers(list) {
        const incomplete = list
            .filter(p => !p.completed)
            .sort((a, b) => a.name.localeCompare(b.name));
            
        const completed = list
            .filter(p => p.completed)
            .sort((a, b) => a.name.localeCompare(b.name));
            
        return [...incomplete, ...completed];
    }
    
    // Ordina i giocatori iniziali all'avvio
    players = sortAndArrangePlayers(players);
    
</script>

<style>
    .app-container {
        max-width: 450px;
        margin: 0 auto;
        min-height: 100vh;
        color: var(--text-color);
        padding: 0 16px;
        padding-bottom: 20px;
    }

    /* Stili Header Partita */
    .match-header {
        background: var(--panel-bg);
        border-radius: 12px;
        padding: 15px;
        margin: 20px 0;
        text-align: center;
        border-bottom: 3px solid var(--accent-color);
    }
    .match-title {
        font-size: 1.5rem;
        font-weight: 800;
        color: var(--text-color-bright);
    }
    .match-details {
        font-size: 0.9rem;
        color: var(--secondary-accent);
        margin-top: 5px;
    }

    /* Lista e Elementi Giocatore */
    .player-list {
        display: flex;
        flex-direction: column;
        gap: 15px;
        margin-top: 20px;
    }

    .player-row {
        background: var(--input-bg);
        padding: 15px;
        border-radius: 12px;
        /* Usa il colore della maglia come bordo principale */
        border-left: 5px solid v-bind('TEAM_COLOR'); 
        display: grid;
        grid-template-columns: 1fr;
        gap: 10px;
        cursor: default; /* Impostazione di default */
        overflow: hidden; /* Importante per la chiusura slide */
    }
    
    .player-row.completed {
        opacity: 0.8;
        cursor: pointer; /* Abilita il click per riaprire */
        border-left-color: v-bind('SUCCESS_COLOR'); /* Cambia colore quando completato */
        transition: all 0.3s ease; /* Transizione per l'opacità/bordo */
    }

    .player-row:not(.completed):hover {
        background: var(--panel-bg);
    }

    .player-name-section {
        display: flex;
        justify-content: space-between;
        align-items: center;
        font-size: 1.1rem;
        font-weight: 700;
        color: var(--text-color-bright);
        /* Se collassato, l'altezza della riga è determinata da questa sezione */
    }
    
    .status-info {
        display: flex;
        gap: 10px;
        align-items: center;
    }
    
    .timestamp {
        font-size: 0.65rem; /* Carattere molto piccolo */
        color: var(--secondary-accent);
        font-weight: 400;
    }

    .present-toggle {
        /* ... stili del toggle ... */
        width: 20px;
        height: 20px;
        border-radius: 50%;
        border: 2px solid var(--secondary-accent);
        display: inline-flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        transition: all 0.2s;
    }
    .present-toggle.is-present {
        background: var(--success-color);
        border-color: var(--success-color);
    }

    /* Contenuto Collassabile */
    .collapsible-content {
        padding-top: 10px;
        border-top: 1px solid var(--panel-bg);
    }
    
    /* Grid di Azioni */
    .actions-grid {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 10px;
    }

    /* Stili Toggle Buttons (Ritardo, Cartellino, Pagamento) */
    .action-toggle {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 8px;
        padding: 8px;
        border-radius: 8px;
        cursor: pointer;
        font-size: 0.85rem;
        font-weight: 600;
        background: var(--panel-bg);
        color: var(--secondary-accent);
        transition: background 0.2s, color 0.2s;
        min-height: 40px;
    }
    .action-toggle.active { color: black; }
    .action-toggle.late.active { background: var(--warning-color); }
    .action-toggle.card.active { background: var(--danger-color); }
    
    .payment-method-toggle { grid-column: span 3; display: flex; background: var(--panel-bg); border-radius: 8px; overflow: hidden; }
    .payment-method-toggle button {
        flex: 1; padding: 8px; border: none; background: transparent; 
        color: var(--secondary-accent); font-weight: 600; cursor: pointer; transition: background 0.2s, color 0.2s;
    }
    .payment-method-toggle button.active { background: var(--accent-color); color: black; }
    
    /* Pulsante Completa */
    .complete-button-container { grid-column: span 3; text-align: center; padding-top: 10px; }
    .complete-button {
        background: var(--success-color); color: black; border: none; padding: 10px 20px;
        border-radius: 25px; font-weight: 700; cursor: pointer; transition: background 0.2s;
    }
    .complete-button:disabled { background: var(--secondary-accent); opacity: 0.5; cursor: not-allowed; }
    .complete-button:hover:not(:disabled) { background: var(--success-color-glow); }
    
    /* Intestazione per le transizioni completate */
    .completed-section-title {
        margin-top: 30px; font-size: 1.3rem; font-weight: 700; color: var(--secondary-accent);
        padding-bottom: 5px; border-bottom: 1px dashed var(--input-bg);
    }

</style>

<svelte:head>
    <title>Scarpa Inside | Gestione Partita</title>
</svelte:head>

<div class="app-container">
    <TopNavBar />

    <h1 class="page-title" transition:fly={{ y: -50, duration: 500 }}>
        Tracker Partita
    </h1>
    
    <div class="match-header" transition:fly={{ y: 50, duration: 500, delay: 100 }}>
        <div class="match-title">VS {matchInfo.opponent}</div>
        <div class="match-details">{matchInfo.date} • Quota: {matchInfo.costPerPlayer.toFixed(2)} €</div>
    </div>

    <h2 class="section-title">Traccia Giocatori</h2>
    
    <div class="player-list">
        {#each players as player (player.id)}
            <div 
                class="player-row" 
                class:completed={player.completed}
                in:slide={{ duration: 400 }}
                out:slide={{ duration: 600, easing: quintOut }}
                on:click|self={player.completed ? () => toggleCollapse(player.id) : null}
            >
                <div class="player-name-section">
                    <span>{player.name}</span>
                    <div class="status-info">
                        {#if player.timestamp}
                            <span class="timestamp">Registrato alle {player.timestamp}</span>
                        {/if}
                        
                        {#if !player.completed}
                            <div 
                                class="present-toggle" 
                                class:is-present={player.present} 
                                on:click={() => player.present = !player.present}
                            >
                                {#if player.present}
                                    ✓
                                {/if}
                            </div>
                        {:else}
                            <span style="font-size: 0.85rem; color: {SUCCESS_COLOR};">
                                {player.method === 'cash' ? '💵 CONTANTI' : '💳 DIGITALE'}
                            </span>
                        {/if}
                    </div>
                </div>

                {#if player.present && (!player.completed || !player.collapsed)}
                    <div class="collapsible-content" transition:slide>
                        <div class="actions-grid">
                            
                            <button 
                                class="action-toggle late" 
                                class:active={player.late}
                                on:click={() => player.late = !player.late}
                                disabled={player.completed && player.collapsed}
                            >
                                Ritardo
                                {#if player.late} <span>🔥</span> {/if}
                            </button>
                            
                            <button 
                                class="action-toggle card" 
                                class:active={player.yellowCard}
                                on:click={() => player.yellowCard = !player.yellowCard}
                                disabled={player.completed && player.collapsed}
                            >
                                Cartellino
                                {#if player.yellowCard} <span>🟨</span> {/if}
                            </button>

                            {#if player.completed}
                                <button 
                                    class="action-toggle" 
                                    style="background: var(--danger-color); color: black;"
                                    on:click={() => uncompleteTracking(player.id)}
                                >
                                    Correzione
                                </button>
                            {:else}
                                <div class="action-toggle" style="justify-content: flex-start; opacity: 0; min-height: 0;"></div>
                            {/if}
                            
                            <div class="payment-method-toggle">
                                <button 
                                    class:active={player.method === 'cash'} 
                                    on:click={() => player.method = 'cash'}
                                >
                                    Contanti
                                </button>
                                <button 
                                    class:active={player.method === 'digital'} 
                                    on:click={() => player.method = 'digital'}
                                >
                                    Digitale
                                </button>
                            </div>
                            
                            <div class="complete-button-container">
                                {#if !player.completed}
                                    <button 
                                        class="complete-button" 
                                        on:click={() => completeTracking(player.id)}
                                    >
                                        REGISTRA PAGAMENTO
                                    </button>
                                {/if}
                            </div>
                        </div>
                    </div>
                {/if}
            </div>
        {/each}
    </div>
    
    {#if players.filter(p => p.completed).length > 0}
        <h2 class="completed-section-title" transition:fly={{ duration: 300, delay: 500 }}>
            Giocatori Registrati
        </h2>
    {/if}

</div>
