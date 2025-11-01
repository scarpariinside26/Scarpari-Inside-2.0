<script>
    import TopNavBar from '$lib/components/TopNavBar.svelte';
    import BottomNavBar from '$lib/components/BottomNavBar.svelte';

    const rankingData = [
        { id: 4, name: 'Giulia Gialli', rating: 9.1, pos: 1 },
        { id: 2, name: 'Daniele Costa', rating: 8.2, pos: 2 },
        { id: 1, name: 'Alessandro Bianchi', rating: 7.5, pos: 3 },
        { id: 5, name: 'Luca Rossi', rating: 7.0, pos: 4 },
        { id: 3, name: 'Fabio Esposito', rating: 6.8, pos: 5 },
    ];
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
    .ranking-table {
        margin-top: 20px;
        width: 100%;
        border-collapse: collapse;
    }
    .ranking-table th, .ranking-table td {
        padding: 12px 10px;
        text-align: left;
        border-bottom: 1px solid var(--panel-bg);
    }
    .ranking-table th {
        color: var(--secondary-accent);
        font-size: 0.9rem;
        font-weight: 600;
    }
    .ranking-row {
        cursor: pointer;
        transition: background 0.2s;
    }
    .ranking-row:hover {
        background: var(--panel-bg);
    }
    .pos-cell {
        font-weight: 900;
        font-size: 1.1rem;
        width: 10%;
    }
    .rating-cell {
        font-weight: 800;
        color: var(--success-color);
        width: 20%;
        text-align: right;
    }
</style>

<div class="app-container">
    <TopNavBar />
    <h1 class="page-title">🏆 Classifica (Voti Medi)</h1>
    
    <table class="ranking-table">
        <thead>
            <tr>
                <th>Pos.</th>
                <th>Giocatore</th>
                <th style="text-align: right;">Voto</th>
            </tr>
        </thead>
        <tbody>
            {#each rankingData as player (player.id)}
                <tr class="ranking-row" on:click={() => alert(`Vai al Profilo di ${player.name} per le statistiche!`)}>
                    <td class="pos-cell">{player.pos}</td>
                    <td>{player.name}</td>
                    <td class="rating-cell">{player.rating.toFixed(1)}</td>
                </tr>
            {/each}
        </tbody>
    </table>
    
    <BottomNavBar />
</div>
