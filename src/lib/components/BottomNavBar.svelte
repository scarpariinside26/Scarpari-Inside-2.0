<script>
    import { page } from '$app/stores';
    import { goto } from '$app/navigation';
    
    // Le rotte principali
    const links = [
        { name: 'Home', path: '/', icon: '🏠' },
        { name: 'Giocatori', path: '/roster', icon: '👨‍👩‍👧‍👦' },
        { name: 'Profilo', path: '/profile', icon: '👤' },
        { name: 'Classifica', path: '/ranking', icon: '🏆' },
    ];
    
    // Controlla se il link è attivo
    function isActive(path) {
        return $page.url.pathname === path;
    }
</script>

<style>
    .bottom-nav {
        display: flex;
        justify-content: space-around;
        align-items: center;
        background: #1e293b; 
        border-top: 1px solid #334155;
        padding: 5px 0;
        position: fixed; /* Rende la barra fissa in basso */
        bottom: 0;
        left: 0;
        right: 0;
        z-index: 1000;
    }
    .nav-item {
        background: none;
        border: none;
        color: #94a3b8;
        font-size: 0.7rem;
        text-align: center;
        padding: 8px;
        cursor: pointer;
        transition: color 0.2s, transform 0.2s;
        flex: 1;
    }
    .nav-item.active {
        color: #f59e0b; /* Colore accento */
        transform: translateY(-2px);
        font-weight: 700;
    }
    .nav-item span {
        display: block;
        font-size: 1.2rem;
        margin-bottom: 2px;
    }
</style>

<nav class="bottom-nav">
    {#each links as link}
        <button 
            class="nav-item" 
            class:active={isActive(link.path)} 
            on:click={() => goto(link.path)}
        >
            <span>{link.icon}</span>
            {link.name}
        </button>
    {/each}
</nav>
