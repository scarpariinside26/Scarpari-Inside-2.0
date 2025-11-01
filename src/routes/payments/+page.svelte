<script>
    import TopNavBar from '$lib/components/TopNavBar.svelte';
    import { slide, fly } from 'svelte/transition';
    import { quintOut } from 'svelte/easing';

    // Colore primario della maglia (simulato)
    const TEAM_COLOR_HEX = '#00CED1'; // Blu ciano (per il bordo)
    const SUCCESS_COLOR = 'var(--success-color)';

    // Dati simulati dei giocatori (Manteniamo i tuoi dati di prova)
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
    /* ------------------------------------- */
    /* Variabili CSS Locali */
    /* ------------------------------------- */
    /* La variabile --team-color sarà definita inline nell'HTML */
    :root {
        /* Definisci il colore di successo per lo stile locale */
        --local-success-color: var(--success-color, #4CAF50);
    }

    .app-container {
        max-width: 450px;
        margin: 0 auto;
        min-height: 100vh;
        color: var(--text-color);
        padding: 0 16px;
        padding-bottom: 20px;
    }

    /* Stili Lista e Elementi Giocatore */
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
        /* ✅ CORREZIONE BORDO: Legge la variabile CSS impostata inline nell'HTML */
        border-left: 5px solid var(--team-color); 
        display: grid;
        grid-template-columns: 1fr;
        gap: 10px;
        cursor: default;
        overflow: hidden; 
        transition: border-left-color 0.3s ease; /* Transizione per il cambio colore */
    }
    
    .player-row.completed {
        opacity: 0.8;
        cursor: pointer; 
        /* ✅ CORREZIONE BORDO: Usa il colore di successo locale quando completato */
        border-left-color: var(--local-success-color); 
    }
    
    /* Intestazione Riga (non cambia altezza) */
    .player-name-section {
        display: flex;
        justify-content: space-between;
        align-items: center;
        font-size: 1.1rem;
        font-weight: 700;
        color: var(--text-color-bright);
    }
    
    /* Contenuto Collassabile (gestito da slide) */
    .collapsible-content {
        /* Rimosso padding-top e border-top da qui per non interferire con la transizione slide */
        transition: padding-top 0.3s ease;
    }
    .collapsible-content-inner {
        padding-top: 10px;
        border-top: 1px solid var(--panel-bg);
    }

    /* Il resto degli stili rimane invariato */
    
    .status-info { display: flex; gap: 10px; align-items: center; }
    .timestamp { font-size: 0.65rem; color: var(--secondary-accent); font-weight: 400; }
    .present-toggle { width: 20px; height: 20px; border-radius: 50%; border: 2px solid var(--secondary-accent); display: inline-flex; align-items: center; justify-content: center; cursor: pointer; transition: all 0.2s; }
    .present-toggle.is-present { background: var(--success-color); border-color: var(--success-color); }
    .actions-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; }
    .action-toggle { display: flex; align-items: center; justify-content: center; gap: 8px; padding: 8px; border-radius: 8px; cursor: pointer; font-size: 0.85rem; font-weight: 600; background: var(--panel-bg); color: var(--secondary-accent); transition: background 0.2s, color 0.2s; min-height: 40px; }
    .action-toggle.active { color: black; }
    .action-toggle.late.active { background: var(--warning-color); }
    .action-toggle.card.active { background: var(--danger-color); }
    .payment-method-toggle { grid-column: span 3; display: flex; background: var(--panel-bg); border-radius: 8px; overflow: hidden; }
    .payment-method-toggle button { flex: 1; padding: 8px; border: none; background: transparent; color: var(--secondary-accent); font-weight: 600; cursor: pointer; transition: background 0.2s, color 0.2s; }
    .payment-method-toggle button.active { background: var(--accent-color); color: black; }
    .complete-button-container { grid-column: span 3; text-align: center; padding-top: 10px; }
    .complete-button { background: var(--success-color); color: black; border: none; padding: 10px 20px; border-radius: 25px; font-weight: 700; cursor: pointer; transition: background 0.2s; }
    .complete-button:disabled { background: var(--secondary-accent); opacity: 0.5; cursor: not-allowed; }
    .complete-button:hover:not(:disabled) { background: var(--success-color-glow); }
    .completed-section-title { margin-top: 30px; font-size: 1.3rem; font-weight: 700; color: var(--secondary-accent); padding-bottom: 5px; border-bottom: 1px dashed var(--input-bg); }

</style>

<svelte:head>
    <title>Scarpa Inside | Gestione Partita</title>
</svelte:head>

<div class="app-container">
    <TopNavBar />

    <h1 class="page-title" transition:fly={{ y: -50, duration: 500 }}>
        Tracker Partita
    </h1>
    
    <h2 class="section-title">Traccia Giocatori</h2>
    
    <div class="player-list">
        {#each players as player (player.id)}
            <div 
                class="player-row" 
                class:completed={player.completed}
                in:slide={{ duration: 400 }}
                out:slide={{ duration: 600, easing: quintOut }}
                on:click|self={player.completed ? () => toggleCollapse(player.id) : null}
                style="--team-color: {TEAM_COLOR_HEX};" 
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
                                on:click|stopPropagation={() => player.present = !player.present}
                            >
                                {#if player.present}
                                    ✓
                                {/if}
                            </div>
                        {:else}
                            <span style="font-size: 0.85rem; color: var(--local-success-color);">
                                {player.method === 'cash' ? '💵 CONTANTI' : '💳 DIGITALE'}
                            </span>
                        {/if}
                    </div>
                </div>

                {#if player.present && (!player.completed || !player.collapsed)}
                    <div class="collapsible-content" transition:slide>
                        <div class="collapsible-content-inner">
                            <div class="actions-grid">
                                
                                <button 
                                    class="action-toggle late" 
                                    class:active={player.late}
                                    on:click={() => player.late = !player.late}
                                >
                                    Ritardo
                                    {#if player.late} <span>🔥</span> {/if}
                                </button>
                                
                                <button 
                                    class="action-toggle card" 
                                    class:active={player.yellowCard}
                                    on:click={() => player.yellowCard = !player.yellowCard}
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
                                        Correggi
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
                    </div>
                {/if}
            </div>
        {/each}
    </div>
    
    </div>
