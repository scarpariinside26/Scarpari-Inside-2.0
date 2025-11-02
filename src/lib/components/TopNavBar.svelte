<script>
    import { page } from '$app/stores';
    
    // Nome del file logo fornito
    const LOGO_SRC = "/Scarpari Inside simplelogo_2023.png"; 
    
    function navigate(path) {
        alert(`Vai alla sezione: ${path}`);
        // In un'app reale: goto(path);
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
        gap: 8px; /* Spazio tra i pulsanti/icone */
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
    }
    .service-button:hover {
        background: var(--bg-color);
        color: var(--text-color);
    }

    /* Stile per il pulsante Indietro */
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
    /* Stili Logo Centrale Rialzato (Uguale alla Bottom Bar) */
    /* ------------------------------------- */
    .center-logo-container {
        position: absolute; /* Rimuove dal flusso normale */
        left: 50%;
        transform: translateX(-50%);
        width: 60px; 
        height: 70px; /* Altezza della navbar */
        display: flex;
        justify-content: center;
        align-items: flex-start;
        pointer-events: none; /* Permette i click sugli elementi sottostanti */
    }
    .center-logo-button {
        position: absolute;
        bottom: -25px; 
        width: 60px;
        height: 60px;
        border-radius: 50%;
        background: var(--bg-color); 
        border: 4px solid var(--panel-bg); 
        box-shadow: 0 4px 10px rgba(0, 0, 0, 0.5);
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        transition: transform 0.2s;
        z-index: 501; 
        pointer-events: auto; /* Riacquisisce gli eventi per il pulsante */
    }
    .center-logo-button:hover {
        transform: scale(1.05);
    }

    .app-logo {
        height: 40px; 
        width: auto;
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

    <div class="center-logo-container">
        <div 
            class="center-logo-button" 
            on:click={() => window.location.href = '/'} 
            aria-label="Vai alla Homepage"
        >
            <img src={LOGO_SRC} alt="Logo Scarpa Inside" class="app-logo"/>
        </div>
    </div>
    
    <div class="side-group">
        <button class="service-button" on:click={() => navigate('/payments')}>
            💰 PAGAMENTI
        </button>
        <button class="service-button" on:click={() => navigate('/notifications')} style="padding: 6px 8px; font-size: 1rem;">
            🔔
        </button>
    </div>
</div>

<div style="height: 70px;"></div>
