<script>
    import { page } from '$app/stores';

    const menuItems = [
        { path: '/events', icon: '🗓️', label: 'Gestione Eventi' },
        { path: '/posts', icon: '📰', label: 'Notizie & Post' },
        { path: '/payments', icon: '💳', label: 'Registro Pagamenti' },
        { path: '/polls', icon: '📊', label: 'Sondaggi' },
        { path: '/', icon: '🏠', label: 'Dashboard Principale' }, // La tua rotta principale
    ];

    let isMobileMenuOpen = false;

    function closeMenu() {
        if (window.innerWidth < 768) {
            isMobileMenuOpen = false;
        }
    }
</script>

<style>
    .sidebar {
        width: 250px;
        min-height: 100vh;
        background-color: var(--sidebar-bg); /* Sfondo scuro per Sidebar */
        padding: 20px 0;
        box-shadow: 2px 0 5px rgba(0, 0, 0, 0.2);
        position: fixed;
        left: 0;
        top: 0;
        z-index: 1000;
        transition: transform 0.3s ease-in-out;
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
        background-color: var(--accent-color-light); /* Colore leggero al passaggio */
    }

    .menu-item.active {
        background-color: var(--accent-color); /* Colore primario per l'attivo */
        border-left: 5px solid var(--accent-color-glow); /* Linea Glow */
        color: var(--text-color-bright);
    }

    .menu-item span {
        margin-left: 10px;
    }
    
    /* Responsive Mobile */
    @media (max-width: 768px) {
        .sidebar {
            transform: translateX(calc(-100% + 50px)); /* Nasconde parzialmente */
            width: 80%; /* Occupa più spazio quando è aperta */
        }
        .sidebar.open {
            transform: translateX(0); /* Mostra completamente */
            box-shadow: 5px 0 10px rgba(0, 0, 0, 0.5);
        }
        .menu-toggle {
            position: fixed;
            top: 15px;
            left: 15px;
            z-index: 1001;
            font-size: 24px;
            cursor: pointer;
            color: var(--accent-color-glow);
        }
    }
</style>

<div class="menu-toggle" on:click={() => isMobileMenuOpen = !isMobileMenuOpen}>
    {isMobileMenuOpen ? '✕' : '☰'}
</div>

<nav class="sidebar" class:open={isMobileMenuOpen}>
    <h2 style="padding: 0 20px 10px; color: var(--accent-color-glow);">Gestione Scarpa</h2>
    {#each menuItems as item}
        <a 
            href={item.path} 
            class="menu-item" 
            class:active={$page.url.pathname === item.path}
            on:click={closeMenu}
        >
            {item.icon} <span>{item.label}</span>
        </a>
    {/each}
</nav>

{#if isMobileMenuOpen && typeof window !== 'undefined' && window.innerWidth < 768}
    <div 
        class="overlay" 
        on:click={closeMenu} 
        style="position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0, 0, 0, 0.5); z-index: 999;"
    ></div>
{/if}
