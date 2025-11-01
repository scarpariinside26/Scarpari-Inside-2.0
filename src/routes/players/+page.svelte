<script>
    import TopNavBar from '$lib/components/TopNavBar.svelte';
    import BottomNavBar from '$lib/components/BottomNavBar.svelte';

    let expandedPlayerId = null; // ID del giocatore la cui scheda è espansa

    const players = [
        { id: 1, name: 'Alessandro Bianchi', role: 'Difensore', tel: '333-1234567', rating: 7.5, presence: '90%' },
        { id: 2, name: 'Daniele Costa', role: 'Attaccante', tel: '333-2345678', rating: 8.2, presence: '100%' },
        { id: 3, name: 'Fabio Esposito', role: 'Centrocampista', tel: '333-3456789', rating: 6.8, presence: '75%' },
        { id: 4, name: 'Giulia Gialli', role: 'Portiere', tel: '333-4567890', rating: 9.1, presence: '80%' },
        { id: 5, name: 'Luca Rossi', role: 'Difensore', tel: '333-5678901', rating: 7.0, presence: '95%' },
    ];

    // Ordina i giocatori alfabeticamente
    players.sort((a, b) => a.name.localeCompare(b.name));

    function toggleExpand(id) {
        expandedPlayerId = expandedPlayerId === id ? null : id;
    }
</script>

<style>
    .app-container {
        max-width: 450px;
        margin: 0 auto;
        min-height: 100vh;
        color: var(--text-color);
        padding: 0 16px;
        padding-bottom: 80px; 
    }
    .player-list {
        margin-top: 20px;
    }
    .player-card {
        background: var(--panel-bg);
        border-radius: 12px;
        margin-bottom: 10px;
        overflow: hidden;
        transition: all 0.3s ease-out;
    }
    .player-summary {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 15px;
        cursor: pointer;
    }
    .player-info {
        flex-grow: 1;
    }
    .player-name {
        font-weight: 800;
        font-size: 1.1rem;
    }
    .player-role {
        font-size: 0.85rem;
        color: var(--secondary-accent);
    }
    .call-button {
        background: var(--success-color);
        color: black;
        border: none;
        padding: 8px 12px;
        border-radius: 8px;
        font-weight: 700;
        margin-left: 15px;
        cursor: pointer;
    }
    .player-details {
        padding: 0 15px;
        max-height: 0;
        overflow: hidden;
        transition: max-height 0.4s ease-in-out, padding 0.4s ease-in-out;
        background: var(--input-bg);
        border-top: 1px solid var(--panel-bg);
    }
    .player-details.expanded {
        max-height: 200px; /* Abbastanza grande per contenere il contenuto */
        padding: 15px;
    }
    .detail-item {
        margin-bottom: 5px;
        font-size: 0.9rem;
    }
    .detail-item strong {
        color: var(--text-color-bright);
    }
</style>

<div class="app-container">
    <TopNavBar />
    <h1 class="page-title">👤 Elenco Giocatori</h1>
    
    <div class="player-list">
        {#each players as player (player.id)}
            <div class="player-card">
                <div class="player-summary" on:click={() => toggleExpand(player.id)}>
                    <div class="player-info">
                        <div class="player-name">{player.name}</div>
                        <div class="player-role">Ruolo: {player.role}</div>
                    </div>
                    <a href={`tel:${player.tel}`} class="call-button" on:click|stopPropagation>
                        📞 Chiama
                    </a>
                </div>
                
                <div 
                    class="player-details" 
                    class:expanded={expandedPlayerId === player.id}
                >
                    <div class="detail-item"><strong>Telefono:</strong> {player.tel}</div>
                    <div class="detail-item"><strong>Media Voti:</strong> {player.rating.toFixed(1)}</div>
                    <div class="detail-item"><strong>Presenza (Stagione):</strong> {player.presence}</div>
                    <div class="detail-item">
                        <a href="/profile?id={player.id}" style="color: var(--accent-color); font-weight: 700; text-decoration: none;">
                            Vedi Statistiche Complete
                        </a>
                    </div>
                </div>
            </div>
        {/each}
    </div>
    
    <BottomNavBar />
</div>
