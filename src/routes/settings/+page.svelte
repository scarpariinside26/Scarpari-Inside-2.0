<script>
    import { fly } from 'svelte/transition';
    import { onMount } from 'svelte';
    
    let isDarkMode = true;
    
    onMount(() => {
        isDarkMode = localStorage.getItem('theme') !== 'light';
        document.body.classList.toggle('light-mode', !isDarkMode);
    });

    function toggleTheme() {
        isDarkMode = !isDarkMode;
        document.body.classList.toggle('light-mode', !isDarkMode);
        localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
    }

    function handleLogout() {
        alert("Logout simulato. Qui andrebbe la logica di Supabase/Auth.");
        // window.location.href = '/login';
    }
</script>

<style>
    :global(body.light-mode) {
        /* Definizioni light mode minimali per mobile */
        --bg-color: #f0f0f5;
        --sidebar-bg: #ffffff;
        --panel-bg: #ffffff;
        --text-color: #333333;
        --text-color-bright: #000000;
        --accent-color-glow: #00bcd4;
        /* Rimuove lo shadow/glow scuro in light mode */
        box-shadow: none; 
    }
    .setting-item { display: flex; justify-content: space-between; align-items: center; padding: 15px 0; border-bottom: 1px dashed #4a4a75; }
    .setting-item:last-child { border-bottom: none; }
</style>

<h1 transition:fly={{ y: -50, duration: 500 }}>Impostazioni ⚙️</h1>

<div class="panel" transition:fly={{ y: 50, duration: 500 }}>
    <h3>Preferenze App</h3>
    
    <div class="setting-item">
        <strong>Modalità Scuro/Chiaro</strong>
        <button class="btn-primary" on:click={toggleTheme}>
            {isDarkMode ? '🌞 Passa a Chiaro' : '🌙 Passa a Scuro'}
        </button>
    </div>
    
    <div class="setting-item">
        <strong>Notifiche Push</strong>
        <button class="btn-warning">Abilita (Simulato)</button>
    </div>
</div>

<div class="panel" transition:fly={{ y: 50, duration: 500 }}>
    <h3>Account</h3>
    
    <div class="setting-item">
        <strong>Stato</strong>
        <span style="color: var(--success-color);">Loggato come Admin</span>
    </div>
    
    <div class="setting-item">
        <strong>Gestione Sessione</strong>
        <button class="btn-danger" on:click={handleLogout}>Logout</button>
    </div>
</div>
