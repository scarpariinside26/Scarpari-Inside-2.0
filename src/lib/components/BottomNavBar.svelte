<script>
    import { page } from '$app/stores';
    import { fade, fly } from 'svelte/transition';
    import { quartOut } from 'svelte/easing';
    
    // --- LOGICA MENU AZIONE CENTRALE ---
    let showActionMenu = false; 

    function toggleActionMenu() {
        showActionMenu = !showActionMenu;
    }

    function openCreateEventFlow(type) {
        showActionMenu = false;
        alert(`Avvia la procedura per 'Creare un nuovo Evento ${type}'.`);
    }

</script>

<style>
    /* ------------------------------------- */
    /* Stili Bottom Nav Bar */
    /* ------------------------------------- */
    .bottom-nav-bar {
        position: fixed;
        bottom: 0;
        left: 50%;
        transform: translateX(-50%);
        width: 100%;
        max-width: 450px;
        height: 70px;
        background: var(--panel-bg);
        box-shadow: 0 -5px 15px rgba(0, 0, 0, 0.3);
        display: flex;
        justify-content: space-around;
        align-items: center;
        z-index: 500;
        border-top-left-radius: 20px;
        border-top-right-radius: 20px;
    }
    .nav-item {
        flex: 1;
        text-align: center;
        padding: 5px;
        color: var(--secondary-accent);
        font-size: 0.75rem;
        font-weight: 600;
        text-decoration: none;
        display: flex;
        flex-direction: column;
        align-items: center;
        transition: color 0.2s;
        cursor: pointer;
    }
    .nav-item.active {
        color: var(--accent-color);
    }
    .nav-icon {
        font-size: 1.5rem;
        margin-bottom: 2px;
    }

    /* Stile Bottone Centrale Rialzato */
    .center-button-container {
        position: relative;
        display: flex;
        justify-content: center;
        width: 60px;
        height: 100%;
    }
    .center-button {
        position: absolute;
        top: -25px; 
        width: 60px;
        height: 60px;
        border-radius: 50%;
        background: var(--accent-color);
        color: black;
        box-shadow: 0 4px 10px rgba(0, 0, 0, 0.5);
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 2rem;
        font-weight: 900;
        border: 4px solid var(--bg-color); 
        cursor: pointer;
        transition: background 0.2s, transform 0.2s;
    }
    .center-button:hover {
        background: var(--success-color-glow);
        transform: scale(1.05);
    }
    .center-button.menu-active {
        transform: rotate(45deg); 
        background: var(--warning-color);
    }

    /* ------------------------------------- */
    /* Stili Menu Azione Centrale */
    /* ------------------------------------- */
    .action-menu-overlay {
        position: fixed;
        bottom: 70px;
        left: 0;
        width: 100%;
        height: calc(100% - 70px);
        z-index: 499; 
    }
    .action-menu {
        position: fixed;
        bottom: 85px; 
        left: 50%;
        transform: translateX(-50%);
        width: 200px;
        background: var(--panel-bg);
        border-radius: 12px;
        box-shadow: 0 4px 15px rgba(0, 0, 0, 0.4);
        padding: 10px;
        display: flex;
        flex-direction: column;
        gap: 8px;
        z-index: 501;
    }
    .action-menu button {
        background: var(--bg-color);
        color: var(--text-color);
        padding: 10px;
        border: none;
        border-radius: 8px;
        font-weight: 600;
        cursor: pointer;
        transition: background 0.2s;
    }
    .action-menu button:hover {
        background: var(--input-bg);
    }

</style>

{#if showActionMenu}
    <div class="action-menu-overlay" transition:fade={{ duration: 150 }} on:click={() => showActionMenu = false}></div>
    <div class="action-menu" transition:fly={{ y: 20, duration: 200, easing: quartOut }}>
        <button on:click={() => openCreateEventFlow('Sportivo')}>⚽ Crea Evento Sportivo</button>
        <button on:click={() => openCreateEventFlow('Social')}>🥂 Crea Evento Social</button>
    </div>
{/if}

<div class="bottom-nav-bar">
    <a href="/" class="nav-item" class:active={$page.url.pathname === '/'}>
        <span class="nav-icon">🏠</span> HOME
    </a>
    
    <a href="/players" class="nav-item" class:active={$page.url.pathname.startsWith('/players')}>
        <span class="nav-icon">👤</span> GIOCATORI
    </a>
    
    <div class="center-button-container">
        <button 
            class="center-button" 
            class:menu-active={showActionMenu}
            on:click={toggleActionMenu}
            aria-label="Crea Nuovo Evento"
        >
            +
        </button>
    </div>
    
    <a href="/ranking" class="nav-item" class:active={$page.url.pathname.startsWith('/ranking')}>
        <span class="nav-icon">🏆</span> CLASSIFICA
    </a>
    
    <a href="/profile" class="nav-item" class:active={$page.url.pathname.startsWith('/profile')}>
        <span class="nav-icon">⚙️</span> PROFILO
    </a>
</div>
