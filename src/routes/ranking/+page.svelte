<script>
    import TopNavBar from '$lib/components/TopNavBar.svelte';
    import BottomNavBar from '$lib/components/BottomNavBar.svelte';
    import { fly } from 'svelte/transition';

    // Dati simulati per la classifica
    const rankingData = [
        { position: 1, team: 'Scarpa FC', points: 45, played: 18, wins: 15, draws: 0, losses: 3 },
        { position: 2, team: 'Red Devils', points: 39, played: 18, wins: 12, draws: 3, losses: 3 },
        { position: 3, team: 'I Leoni', points: 30, played: 18, wins: 9, draws: 3, losses: 6 },
        { position: 4, team: 'FC Prova', points: 28, played: 18, wins: 8, draws: 4, losses: 6 },
        { position: 5, team: 'Gli Ultimi', points: 15, played: 18, wins: 5, draws: 0, losses: 13 },
    ];
</script>

<style>
    /* Stili generali del container - Rispettano il layout mobile-first */
    .app-container {
        max-width: 450px;
        margin: 0 auto;
        background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
        min-height: 100vh;
        color: white;
        padding: 0 16px;
        padding-bottom: 70px; /* Spazio per la BottomNavBar */
    }

    .header-section {
        padding: 20px 0;
        text-align: center;
        margin-bottom: 20px;
    }

    h1 {
        font-size: 2rem;
        font-weight: 800;
        color: #f59e0b; /* Accento colore */
    }

    /* Stili per la Tabella Classifica */
    .ranking-table {
        background: #1f2331; /* Sfondo scuro per il blocco */
        border-radius: 12px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.4);
        overflow: hidden; /* Importante per gli angoli arrotondati */
        width: 100%;
    }

    /* Riga Header della Tabella */
    .table-header {
        display: grid;
        grid-template-columns: 0.5fr 3fr 0.8fr 0.8fr; /* Posizione | Squadra | Punti | Giocate */
        padding: 12px 15px;
        background: #334155;
        font-weight: 700;
        font-size: 0.85rem;
        text-transform: uppercase;
        color: #94a3b8;
    }

    /* Singola Riga della Classifica */
    .table-row {
        display: grid;
        grid-template-columns: 0.5fr 3fr 0.8fr 0.8fr;
        padding: 15px;
        border-bottom: 1px solid #334155;
        align-items: center;
        font-size: 0.95rem;
    }

    .table-row:last-child {
        border-bottom: none;
    }

    .team-name {
        font-weight: 600;
        color: #f8fafc;
        white-space: nowrap; /* Evita il wrap del nome */
        overflow: hidden;
        text-overflow: ellipsis;
    }

    .position {
        font-weight: 700;
        font-size: 1.1rem;
        color: #70d8ff; /* Colore azzurro di accento */
    }

    .position-1 {
        color: gold; /* Primo posto */
        transform: scale(1.1);
    }
    .position-2 { color: silver; } /* Secondo posto */
    .position-3 { color: #cd7f32; } /* Terzo posto (Bronzo) */

    .points {
        font-weight: 700;
        color: #38b44a; /* Punti in verde */
        text-align: right;
    }
    
    .played {
        color: #b0b8c6;
        text-align: center;
    }
</style>

<svelte:head>
    <title>Scarpa Inside | Classifica</title>
</svelte:head>

<div class="app-container">
    <TopNavBar />

    <div class="header-section" transition:fly={{ y: -50, duration: 500 }}>
        <h1>Classifica Torneo</h1>
        <p style="color: #94a3b8; font-size: 0.9rem;">Dati aggiornati (Simulati)</p>
    </div>

    <div class="ranking-table" transition:fly={{ y: 50, duration: 600 }}>
        <div class="table-header">
            <div>Pos</div>
            <div>Squadra</div>
            <div style="text-align: right;">Punti</div>
            <div style="text-align: center;">Giocate</div>
        </div>

        {#each rankingData as row (row.position)}
            <div class="table-row">
                <div class="position" class:position-1={row.position === 1} class:position-2={row.position === 2} class:position-3={row.position === 3}>
                    {row.position}
                </div>
                <div class="team-name">{row.team}</div>
                <div class="points">{row.points}</div>
                <div class="played">{row.played}</div>
            </div>
        {/each}
    </div>
    
    <BottomNavBar />
</div>
