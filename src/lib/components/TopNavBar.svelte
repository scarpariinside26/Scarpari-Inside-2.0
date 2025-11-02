<script>
    import { page } from '$app/stores';
    
    // Nome del file logo fornito. ASSICURATI CHE IL NOME SIA CORRETTO E IL FILE SIA IN /static
    const LOGO_SRC = "/Scarpari Inside simplelogo_2023.png"; 
    
    // Stato fittizio per le notifiche
    let unreadNotifications = 2;

    function navigate(path) {
        alert(`Vai alla sezione: ${path}`);
    }
    
    function showNotifications() {
        alert('Visualizza il dettaglio delle notifiche.');
        unreadNotifications = 0; // Azzera il badge al click
    }
</script>

<style>
    /* ------------------------------------- */
    /* Stili Top Nav Bar (Contenitore) */
    /* ------------------------------------- */
    .top-nav-bar {
        position: fixed;
        top: 0;
        left: 50%;
        transform: translateX(-50%);
        width: 100%;
        max-width: 450px;
        height: 70px; 
        background: var(--panel-bg);
        box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0 16px;
        z-index: 500;
        border-bottom-left-radius: 20px;
        border-bottom-right-radius: 20px;
    }
    
    /* Contenitori per l'allineamento degli elementi */
    .side-group {
        display: flex;
        align-items: center;
        gap: 8px;
    }

    /* Stile per i pulsanti compatti di servizio */
    .service-button {
        background: var(--input-bg);
        color: var(--secondary-accent);
        border: none;
        padding: 6px 10px;
        border-radius: 8px;
        font-weight: 600;
        font-size: 0.75rem;
        cursor: pointer;
        transition: background 0.2s;
        white-space: nowrap; /* Evita che il testo vada a capo */
    }
    .service-button:hover {
        background: var(--bg-color);
        color: var(--text-color);
    }

    /* Stile per il pulsante Indietro (sinistra) */
    .back-button {
        background: none;
        border: none;
        color: var(--secondary-accent);
        cursor: pointer;
        padding: 0;
        display: flex;
        align-items: center;
        font-size: 1rem;
        font-weight: 600;
        transition: color 0.2s;
        height: 30px;
        width: 30px;
        justify-content: center;
    }
    .back-button:hover {
        color: var(--text-color);
    }

    /* ------------------------------------- */
    /* Logo Principale Centrato e Notifiche */
    /* ------------------------------------- */
    .center-content {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        position: absolute; 
        left: 50%;
        transform: translateX(-50%);
        height: 100%;
        gap: 2px;
    }
    
    .app-logo {
        height: 35px;
        width: auto;
    }
    
    /* Campana Notifiche Centrata */
    .notification-area {
        position: relative;
        cursor: pointer;
        color: var(--secondary-accent);
        transition: color 0.2s;
        font-size: 1.2rem;
    }
    .notification-area:hover {
        color: var(--accent-color);
    }
    .notification-badge {
        position: absolute;
        top: -5px;
        right: -5px;
        background: var(--error-color);
        color: white;
        border-radius: 50%;
        width: 14px;
        height: 14px;
        font-size: 0.7rem;
        font-weight: 700;
        display: flex;
        align-items: center;
        justify-content: center;
        line-height: 1;
        transform: scale(0.9);
    }

</style>

<div class="top-nav-bar">
    <div class="side-group">
        {#if $page.url.pathname !== '/'}
            <button class="back-button" on:click={() => window.history.back()} aria-label="Torna indietro">
                ⬅️
            </button>
        {:else}
            <button class="service-button" on:click={() => navigate('/posts')}>
                📝 POST
            </button>
        {/if}
        
        <button class="service-button" on:click={() => navigate('/polls')}>
            📊 SONDAGGI
        </button>
    </div>

    <div class="center-content">
        <img src={LOGO_SRC} alt="Logo Scarpa Inside" class="app-logo" on:click={() => window.location.href = '/'} style="cursor: pointer;"/>
        
        <div class="notification-area" on:click={showNotifications}>
            🔔
            {#if unreadNotifications > 0}
                <div class="notification-badge">
                    {unreadNotifications > 9 ? '9+' : unreadNotifications}
                </div>
            {/if}
        </div>
    </div>
    
    <div class="side-group">
        <button class="service-button" on:click={() => navigate('/payments')}>
            💰 PAGAMENTI
        </button>
        <button class="service-button" on:click={() => navigate('/settings')} style="padding: 6px 8px; font-size: 1rem;">
            ⚙️
        </button>
    </div>
</div>

<div style="height: 70px;"></div>
