<script>
    import { page } from '$app/stores';

    const managementItems = [
        { path: '/events', icon: '🗓️', label: 'Gestione Eventi' },
        { path: '/posts', icon: '📰', label: 'Notizie & Post' },
        { path: '/payments', icon: '💳', label: 'Registro Pagamenti' },
        { path: '/polls', icon: '📊', label: 'Sondaggi' },
    ];
    
    // Nuove sezioni richieste
    const personalItems = [
        { path: '/profile', icon: '👤', label: 'Il Mio Profilo' },
        { path: '/roster', icon: '👥', label: 'Giocatori (Roster)' },
        { path: '/settings', icon: '⚙️', label: 'Impostazioni' },
        { path: '/report', icon: '🚨', label: 'Segnalazioni Admin' },
    ];
    
    let isMobileMenuOpen = false;

    // Chiude il menu quando si clicca su una voce (necessario per mobile)
    function closeMenu() {
        if (typeof window !== 'undefined' && window.innerWidth < 768) {
            isMobileMenuOpen = false;
        }
    }
</script>

<style>
    .sidebar {
        width: 250px;
        min-height: 100vh;
        background-color: var(--sidebar-bg); 
        padding: 20px 0;
        box-shadow: 2px 0 5px rgba(0, 0, 0, 0.2);
        
        /* 1. Posizionamento fisso ESSENZIALE */
        position: fixed; 
        left: 0;
        top: 0;
        z-index: 1000;
        transition: transform 0.3s ease-in-out;
    }

    .menu-section-title {
        color: #888;
        font-size: 0.9em;
        padding: 15px 20px 5px;
        text-transform: uppercase;
        font-weight: bold;
    }

    .menu-item {
        display: flex;
        align-items: center;
        padding: 12px 20px;
        color: var(--text-color);
        text-decoration: none;
        font-weight: 500;
        transition: background-color 0.2s, color 0.2s;
        border-left: 5px solid transparent;
    }

    .menu-item:hover {
        background-color: var(--accent-color-light); 
    }

    .menu-item.active {
        background-color: var(--accent-color); 
        border-left: 5px solid var(--accent-color-glow); 
        color: var(--text-color-bright);
    }

    .menu-item span {
        margin-left: 10px;
    }
    
    /* Responsive Mobile: Nasconde la sidebar e mostra il toggle */
    .menu-toggle {
        position: fixed;
        top: 15px;
        left: 15px;
        z-index: 1001;
        font-size: 24px;
        cursor: pointer;
        color: var(--accent-color-glow);
        display: none; /* Nascosto su desktop */
    }

    @media (max-width: 768px) {
        .menu-toggle {
            display: block; /* Visibile su mobile */
        }
        .sidebar {
            /* Nasconde la sidebar fuori dallo schermo su mobile */
            transform: translateX(-100%); 
            width: 80%;
        }
        .sidebar.open {
            /* La mostra quando isMobileMenuOpen è true */
            transform: translateX(0); 
            box-shadow: 5px 0 10px rgba(0, 0, 0, 0.5);
        }
    }
</style>

<div class="menu-toggle" on:click={() => isMobileMenuOpen = !isMobileMenuOpen}>
    {isMobileMenuOpen ? '✕' : '☰'}
</div>

<nav class="sidebar" class:open={isMobileMenuOpen}>
    <h2 style="padding: 0 20px 10px; color: var(--accent-color-glow);">Gestione Scarpa</h2>
    
    <div class="menu-section-title">Amministrazione</div>
    {#each managementItems as item}
        <a 
            href={item.path} 
            class="menu-item" 
            class:active={$page.url.pathname === item.path}
            on:click={closeMenu}
        >
            {item.icon} <span>{item.label}</span>
        </a>
    {/each}
    
    <div class="menu-section-title">Area Personale</div>
    {#each personalItems as item}
        <a 
            href={item.path} 
            class="menu-item" 
            class:active={$page.url.pathname === item.path}
            on:click={closeMenu}
        >
            {item.icon} <span>{item.label}</span>
        </a>
    {/each}
    
    <div class="menu-section-title" style="margin-top: 15px;">Utilità</div>
    <a 
        href="/" 
        class="menu-item" 
        class:active={$page.url.pathname === '/'}
        on:click={closeMenu}
    >
        🏠 <span>Dashboard Principale</span>
    </a>
</nav>

{#if isMobileMenuOpen && typeof window !== 'undefined' && window.innerWidth < 768}
    <div 
        class="overlay" 
        on:click={closeMenu} 
        style="position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0, 0, 0, 0.5); z-index: 999;"
    ></div>
{/if}
