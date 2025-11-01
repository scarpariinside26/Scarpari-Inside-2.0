<script>
    import { page } from '$app/stores';

    const managementItems = [
        { path: '/events', icon: '🗓️', label: 'Gestione Eventi' },
        { path: '/posts', icon: '📰', label: 'Notizie & Post' },
        { path: '/payments', icon: '💳', label: 'Registro Pagamenti' },
        { path: '/polls', icon: '📊', label: 'Sondaggi' },
    ];
    
    const personalItems = [
        { path: '/profile', icon: '👤', label: 'Il Mio Profilo' },
        { path: '/roster', icon: '👥', label: 'Giocatori (Roster)' },
        { path: '/settings', icon: '⚙️', label: 'Impostazioni' },
        { path: '/report', icon: '🚨', label: 'Segnalazioni Admin' },
    ];
    
    let isMobileMenuOpen = false;

    function closeMenu() {
        if (window.innerWidth < 768) {
            isMobileMenuOpen = false;
        }
    }
</script>

<style>
    /* ... (MANTENERE GLI STILI ESISTENTI) ... */
    .menu-section-title {
        color: #888;
        font-size: 0.9em;
        padding: 15px 20px 5px;
        text-transform: uppercase;
        font-weight: bold;
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
