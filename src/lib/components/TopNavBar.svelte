<script>
    import { page } from '$app/stores';
    
    function navigate(path) {
        alert(`Vai alla sezione: ${path}`);
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
        white-space: nowrap; 
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

    <div style="flex-grow: 1;"></div>
    
    <div class="side-group">
        <button class="service-button" on:click={() => navigate('/payments')}>
            💰 PAGAMENTI
        </button>
        
        <button class="service-button" on:click={() => navigate('/events/upcoming')}>
            📅 EVENTI
        </button>
    </div>
</div>

<div style="height: 70px;"></div>
