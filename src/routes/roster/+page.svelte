<script>
    import { fly } from 'svelte/transition';
    const mockPlayers = [
        { id: 1, name: 'Player Alfa', discord: '@alfa_d', phone: '+393331112233', rating: 88, status: 'Online' },
        { id: 2, name: 'Player Beta', discord: '@beta_d', phone: '+393334445566', rating: 92, status: 'Offline' },
        { id: 3, name: 'Player Gamma', discord: '@gamma_d', phone: '+393337778899', rating: 75, status: 'Online' },
    ];

    function handleCall(phoneNumber) {
        // Usa l'API standard per la telefonia mobile/desktop
        window.location.href = `tel:${phoneNumber}`;
    }
</script>

<style>
    .player-card { display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px; padding: 15px; }
    .player-info { display: flex; flex-direction: column; }
    .player-info strong { color: var(--accent-color-glow); }
    .player-actions { display: flex; gap: 10px; align-items: center; }
    .rating-badge { padding: 5px 10px; border-radius: 4px; font-weight: bold; background: #6000c0; }
    
    /* Mobile: Più compatto */
    @media (max-width: 600px) {
        .player-card { flex-direction: column; align-items: flex-start; }
        .player-actions { margin-top: 10px; width: 100%; justify-content: space-between; }
        .rating-badge { order: -1; }
    }
</style>

<h1 transition:fly={{ y: -50, duration: 500 }}>Roster Giocatori 👥</h1>

<div transition:fly={{ y: 50, duration: 500 }}>
    {#each mockPlayers as player (player.id)}
        <div class="panel player-card">
            <div class="player-info">
                <strong>{player.name}</strong>
                <p>Discord: {player.discord} | Telefono: {player.phone}</p>
                <span style="color: {player.status === 'Online' ? 'var(--success-color)' : '#999'}">{player.status}</span>
            </div>
            
            <div class="player-actions">
                <span class="rating-badge">Rating: {player.rating}</span>
                <button 
                    class="btn-success" 
                    on:click={() => handleCall(player.phone)}
                >
                    📞 Chiama d'Emergenza
                </button>
            </div>
        </div>
    {/each}
</div>
