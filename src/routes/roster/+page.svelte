<script>
    import TopNavBar from '$lib/components/TopNavBar.svelte';
    import BottomNavBar from '$lib/components/BottomNavBar.svelte';
    import { fly } from 'svelte/transition';

    // Dati simulati dei giocatori
    const players = [
        { id: 1, name: 'Mario Rossi', role: 'Attaccante', number: 10, status: 'Active', goals: 12 },
        { id: 2, name: 'Marco Verdi', role: 'Difensore', number: 4, status: 'Active', goals: 1 },
        { id: 3, name: 'Luca Bianchi', role: 'Portiere', number: 1, status: 'Active', goals: 0 },
        { id: 4, name: 'Giulio Neri', role: 'Centrocampista', number: 8, status: 'Injured', goals: 5 },
        { id: 5, name: 'Andrea Gialli', role: 'Difensore', number: 22, status: 'Inactive', goals: 0 },
    ];

    function getStatusBadgeClass(status) {
        switch (status) {
            case 'Active': return 'status-active';
            case 'Injured': return 'status-danger';
            case 'Inactive': return 'status-warning';
            default: return 'status-active';
        }
    }
</script>

<style>
    /* Stili importati da app.css non devono essere ripetuti qui */
    
    .header-section {
        padding: 20px 0;
        text-align: center;
        margin-bottom: 20px;
    }

    h1 {
        /* Usa la variabile d'accento per coerenza */
        color: var(--secondary-accent);
        font-weight: 800;
        font-size: 2rem;
    }

    /* Stile della Card Giocatore (Ispirato al design dark) */
    .player-card {
        background-color: var(--panel-bg);
        border: 1px solid var(--input-bg);
        border-radius: 12px;
        padding: 15px;
        margin-bottom: 15px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
    }

    .player-info {
        flex-grow: 1;
    }

    .player-name {
        font-size: 1.2rem;
        font-weight: 700;
        color: var(--text-color-bright);
        margin-bottom: 4px;
    }

    .player-details {
        font-size: 0.9rem;
        color: var(--text-color);
    }
    
    .player-details span {
        font-weight: 600;
        color: var(--secondary-accent);
    }

    /* Badge Stato Giocatore */
    .status-badge {
        padding: 5px 10px;
        border-radius: 6px;
        font-size: 0.8rem;
        font-weight: 700;
        color: black;
        text-transform: uppercase;
        white-space: nowrap;
        margin-left: 10px;
    }

    .status-active { background-color: var(--success-color); }
    .status-danger { background-color: var(--danger-color); }
    .status-warning { background-color: var(--warning-color); }
    
    /* Box Statistiche a Lato */
    .player-stats {
        text-align: right;
        min-width: 60px;
    }

    .stats-number {
        font-size: 1.8rem;
        font-weight: 900;
        color: var(--accent-color);
        line-height: 1;
    }

    .stats-label {
        font-size: 0.7rem;
        color: var(--text-color);
        margin-top: -5px;
        display: block;
    }

</style>

<svelte:head>
    <title>Scarpa Inside | Roster Giocatori</title>
</svelte:head>

<div class="app-container">
    <TopNavBar />

    <div class="content-area">
        <div class="header-section" transition:fly={{ y: -50, duration: 500 }}>
            <h1>Squadra (Roster)</h1>
            <p style="color: var(--text-color);">Gestione e Statistiche Rapide.</p>
        </div>

        <section class="roster-list">
            {#each players as player (player.id)}
                <div class="player-card" transition:fly={{ x: 50, duration: 500, delay: player.id * 50 }}>
                    <div class="player-info">
                        <div class="player-name">{player.number} - {player.name}</div>
                        <div class="player-details">
                            Ruolo: <span>{player.role}</span> 
                            <span class="status-badge {getStatusBadgeClass(player.status)}">
                                {player.status}
                            </span>
                        </div>
                    </div>
                    
                    <div class="player-stats">
                        <span class="stats-number">{player.goals}</span>
                        <span class="stats-label">GOAL</span>
                    </div>
                </div>
            {/each}
        </section>
    </div>
    
    <BottomNavBar />
</div>
