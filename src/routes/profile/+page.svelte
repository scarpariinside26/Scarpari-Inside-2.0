<script>
    import TopNavBar from '$lib/components/TopNavBar.svelte';
    import BottomNavBar from '$lib/components/BottomNavBar.svelte';
    import { fly } from 'svelte/transition';

    // Dati simulati del profilo (Assumiamo l'utente sia Mario Rossi)
    const userProfile = {
        name: 'Mario Rossi',
        number: 10,
        role: 'Attaccante',
        email: 'mario.rossi@scarpafc.it',
        joined: '2023-09-01',
    };

    // Statistiche personali simulate
    const stats = [
        { label: 'Goal Totali', value: 12, accent: 'var(--success-color)' },
        { label: 'Partite Giocate', value: 18, accent: 'var(--secondary-accent)' },
        { label: 'Assist', value: 5, accent: 'var(--accent-color)' },
        { label: 'Cartellini Gialli', value: 2, accent: 'var(--warning-color)' },
        { label: 'Media Voto', value: 7.8, accent: 'var(--text-color-bright)' },
    ];

    function handleLogout() {
        alert("Logout effettuato! (Azione simulata)");
        // In un'app reale: reindirizzamento alla pagina di login
        // goto('/login'); 
    }
</script>

<style>
    /* Stili generali del container - Rispettano il layout mobile-first */
    .app-container {
        max-width: 450px;
        margin: 0 auto;
        background: linear-gradient(135deg, var(--bg-color) 0%, #1e293b 100%);
        min-height: 100vh;
        color: var(--text-color);
        padding: 0 16px;
        padding-bottom: 70px; /* Spazio per la BottomNavBar */
    }

    .profile-header {
        text-align: center;
        padding: 30px 0 20px;
        background-color: var(--panel-bg);
        border-radius: 0 0 12px 12px;
        margin: 0 -16px 20px -16px; /* Estende ai bordi del container */
        box-shadow: 0 4px 10px rgba(0, 0, 0, 0.4);
    }

    .profile-icon {
        background: var(--accent-color);
        color: black;
        width: 80px;
        height: 80px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 3rem;
        font-weight: 900;
        margin: 0 auto 10px;
        border: 4px solid var(--accent-color-glow);
    }
    
    .profile-name {
        font-size: 1.8rem;
        font-weight: 900;
        color: var(--text-color-bright);
        margin-bottom: 5px;
    }

    .profile-meta {
        color: var(--secondary-accent);
        font-size: 1rem;
    }

    /* Sezione Statistiche a Griglia */
    .stats-grid {
        display: grid;
        grid-template-columns: 1fr 1fr; /* 2 colonne per mobile */
        gap: 15px;
        margin-bottom: 30px;
    }

    .stat-card {
        background-color: var(--panel-bg);
        border-radius: 12px;
        padding: 15px;
        text-align: center;
        box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
    }

    .stat-value {
        font-size: 2rem;
        font-weight: 900;
        line-height: 1.1;
    }
    .stat-label {
        font-size: 0.8rem;
        font-weight: 500;
        color: var(--text-color);
    }

    /* Sezione Dettagli e Azioni */
    .details-list {
        margin-top: 20px;
        margin-bottom: 30px;
    }
    .detail-item {
        background: var(--input-bg);
        padding: 12px;
        border-radius: 8px;
        margin-bottom: 8px;
        display: flex;
        justify-content: space-between;
        font-size: 0.95rem;
    }
    .detail-label {
        color: var(--secondary-accent);
    }
    .detail-value {
        font-weight: 600;
        color: var(--text-color-bright);
    }
</style>

<svelte:head>
    <title>Scarpa Inside | Mio Profilo</title>
</svelte:head>

<div class="app-container">
    <TopNavBar />

    <div class="profile-header" transition:fly={{ y: -50, duration: 500 }}>
        <div class="profile-icon">
            {userProfile.number}
        </div>
        <h1 class="profile-name">{userProfile.name}</h1>
        <p class="profile-meta">{userProfile.role} | Iscritto il: {userProfile.joined}</p>
    </div>

    <div class="content-area" style="padding-top: 0;">
        <h2 class="section-title">Statistiche Personali</h2>
        
        <div class="stats-grid">
            {#each stats as stat (stat.label)}
                <div class="stat-card" transition:fly={{ y: 50, duration: 500, delay: 100 }}>
                    <div class="stat-value" style="color: {stat.accent};">{stat.value}</div>
                    <div class="stat-label">{stat.label.toUpperCase()}</div>
                </div>
            {/each}
        </div>

        <h2 class="section-title">Informazioni Account</h2>
        <div class="details-list">
            <div class="detail-item">
                <span class="detail-label">Email:</span>
                <span class="detail-value">{userProfile.email}</span>
            </div>
            <div class="detail-item">
                <span class="detail-label">Ruolo (Admin/Player):</span>
                <span class="detail-value">Player</span>
            </div>
        </div>

        <button class="btn-primary" on:click={() => alert('Apertura Modifica Profilo')} style="width: 100%; margin-bottom: 10px;">
            Modifica Profilo
        </button>
        <button class="btn-danger" on:click={handleLogout} style="width: 100%;">
            Logout
        </button>
    </div>
    
    <BottomNavBar />
</div>
