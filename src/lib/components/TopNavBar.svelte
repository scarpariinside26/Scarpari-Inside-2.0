<script>
    import { page } from '$app/stores';
</script>

<style>
    /* Altezza Fissa per la Top Bar (uguale alla Bottom NavBar: 70px) */
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
    
    /* Contenitore per il pulsante Indietro */
    .left-content {
        width: 40px; /* Larghezza fissa per il pulsante/spacer */
        display: flex;
        justify-content: flex-start;
        align-items: center;
    }

    /* Stile per il Contenitore del Logo Immagine (Ora al centro assoluto) */
    .app-logo-container {
        position: absolute; 
        left: 50%;
        transform: translateX(-50%);
        /* Aggiustiamo un po' la larghezza massima per evitare che venga coperto dai pulsanti */
        max-width: calc(100% - 100px); /* 100% - (40px sinistro + 40px destro + padding) */
        height: 100%; /* Occupa l'intera altezza della navbar */
        display: flex;
        justify-content: center;
        align-items: center;
    }
    .app-logo {
        height: 50px; /* Altezza massima per il logo */
        width: auto; /* Mantieni le proporzioni */
        object-fit: contain; /* Assicurati che l'intera immagine sia visibile */
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
        height: 40px;
        width: 40px;
        justify-content: center;
    }
    .back-button:hover {
        color: var(--text-color);
    }
    
    /* Spacer vuoto a destra */
    .right-spacer {
        width: 40px; 
    }
</style>

<div class="top-nav-bar">
    <div class="left-content">
        {#if $page.url.pathname !== '/'}
            <button class="back-button" on:click={() => window.history.back()} aria-label="Torna indietro">
                ⬅️
            </button>
        {:else}
            <div class="spacer" style="width: 40px;"></div>
        {/if}
    </div>

    <div class="app-logo-container">
        <img src="/logo.png" alt="Scarpa Inside Logo" class="app-logo"/>
    </div>
    
    <div class="right-spacer"></div>
</div>

<div style="height: 70px;"></div>
