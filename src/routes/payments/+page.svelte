<script>
    import TopNavBar from '$lib/components/TopNavBar.svelte';
    import { fly, slide } from 'svelte/transition';
    import { quintOut } from 'svelte/easing';

    // Dati simulati dei giocatori
    let players = [
        { id: 1, name: 'Mario Rossi', present: true, payment: 10, method: 'cash', late: false, yellowCard: false, completed: false },
        { id: 2, name: 'Andrea Bianchi', present: true, payment: 10, method: 'digital', late: false, yellowCard: false, completed: false },
        { id: 3, name: 'Luca Verdi', present: true, payment: 10, method: 'cash', late: false, yellowCard: false, completed: false },
        { id: 4, name: 'Simone Neri', present: false, payment: 10, method: 'cash', late: false, yellowCard: false, completed: false },
    ];

    // Simula i dati della partita
    const matchInfo = {
        date: '25/09/2025',
        opponent: 'Squadra Avversaria',
        costPerPlayer: 10.00
    };

    /**
     * Completa la riga del giocatore, spostandola in basso
     * @param {number} id - ID del giocatore
     */
    function completeTracking(id) {
        players = players.map(p => {
            if (p.id === id && p.present) {
                // Imposta 'completed' a true per attivare la transizione
                return { ...p, completed: true };
            }
            return p;
        });

        // Dopo un breve ritardo per la transizione, sposta l'elemento completato in fondo all'array
        setTimeout(() => {
            const completedPlayer = players.find(p => p.id === id && p.completed);
            
            if (completedPlayer) {
                // Filtra gli elementi non completati e li mette in testa
                const incompletePlayers = players.filter(p => p.id !== id && !p.completed);
                
                // Ricrea l'array con i completati in fondo
                players = [...incompletePlayers, completedPlayer];
            }
        }, 600); // 600ms per la transizione
    }
    
    // Filtra i giocatori da visualizzare: incompleti sopra, completati sotto
    $: visiblePlayers = [...players].sort((a, b) => (a.completed === b.completed ? 0 : a.completed ? 1 : -1));

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
        border-left: 5px solid var(--panel-bg);
        display: grid;
        grid-template-columns: 1fr;
        gap: 10px;
        transition: all 0.5s ease-in-out;
    }
    
    .player-row.completed {
        /* Stile per la riga completata */
        opacity: 0.6;
        border-left-color: var(--success-color);
    }

    .player-name-section {
        display: flex;
        justify-content: space-between;
        align-items: center;
        font-size: 1.1rem;
        font-weight: 700;
        color: var(--text-color-bright);
    }

    .present-toggle {
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

    .actions-grid {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 10px;
        padding-top: 10px;
        border-top: 1px solid var(--panel-bg);
    }

    /* Stile Toggle Buttons (Ritardo, Cartellino) */
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
    }
    .action-toggle.active {
        color: black;
    }
    .action-toggle.late.active {
        background: var(--warning-color);
    }
    .action-toggle.card.active {
        background: var(--danger-color);
    }
    
    /* Stile Toggle Pagamento */
    .payment-method-toggle {
        grid-column: span 3; /* Occupa tutta la larghezza */
        display: flex;
        background: var(--panel-bg);
        border-radius: 8px;
        overflow: hidden;
    }
    .payment-method-toggle button {
        flex: 1;
        padding: 8px;
        border: none;
        background: transparent;
        color: var(--secondary-accent);
        font-weight: 600;
        cursor: pointer;
        transition: background 0.2s, color 0.2s;
    }
    .payment-method-toggle button.active {
        background: var(--accent-color);
        color: black;
    }
    
    /* Pulsante Completa */
    .complete-button-container {
        grid-column: span 3;
        text-align: center;
        padding-top: 10px;
    }
    .complete-button {
        background: var(--success-color);
        color: black;
        border: none;
        padding: 10px 20px;
        border-radius: 25px;
        font-weight: 700;
        cursor: pointer;
        transition: background 0.2s;
    }
    .complete-button:disabled {
        background: var(--secondary-accent);
        opacity: 0.5;
        cursor: not-allowed;
    }
    .complete-button:hover:not(:disabled) {
        background: var(--success-color-glow);
    }
    
    /* Intestazione per le transizioni completate */
    .completed-section-title {
        margin-top: 30px;
        font-size: 1.3rem;
        font-weight: 700;
        color: var(--secondary-accent);
        padding-bottom: 5px;
        border-bottom: 1px dashed var(--input-bg);
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
        {#each visiblePlayers as player (player.id)}
            <div 
                class="player-row" 
                class:completed={player.completed}
                in:slide={{ duration: 300 }}
                out:slide={{ duration: 500, easing: quintOut }}
            >
                <div class="player-name-section">
                    <span>{player.name}</span>
                    <div 
                        class="present-toggle" 
                        class:is-present={player.present} 
                        on:click={() => player.present = !player.present}
                    >
                        {#if player.present}
                            ✓
                        {/if}
                    </div>
                </div>

                {#if player.present}
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

                        <div class="action-toggle" style="justify-content: flex-start; opacity: 0;"></div>
                        
                        <div class="payment-method-toggle">
                            <button 
                                class:active={player.method === 'cash'} 
                                on:click={() => player.method = 'cash'}
                                disabled={player.completed}
                            >
                                Contanti
                            </button>
                            <button 
                                class:active={player.method === 'digital'} 
                                on:click={() => player.method = 'digital'}
                                disabled={player.completed}
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
                            {:else}
                                <div class="status-Pagato" style="font-weight:700; color:var(--success-color)">REGISTRATO</div>
                            {/if}
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
