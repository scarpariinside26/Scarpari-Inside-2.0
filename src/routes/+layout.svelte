<script>
    // Questo layout gestisce l'inizializzazione del client Supabase e la sessione
    // usando solo @supabase/supabase-js (presente nel tuo package.json).

    import { setContext } from 'svelte';
    import { goto } from '$app/navigation';
    import { onMount, onDestroy } from 'svelte';
    import { createClient } from '@supabase/supabase-js'; 
    import { page } from '$app/stores';

    // Dati passati dal server (+layout.server.js)
    // Ora include data.supabaseToken
    export let data;

    let supabase = null;
    let session = $page.data.session; 
    let isLoading = true;
    let authListener = null;

    /**
     * Stabilisce la sessione Supabase utilizzando il JWT ricevuto dal server.
     * @param {string} token - Il JWT generato dalla funzione RPC di Supabase.
     */
    async function setupSession(token) {
        if (!supabase) return;
        
        try {
            // Usa il token per stabilire la sessione client
            const { data: sessionData, error: sessionError } = await supabase.auth.setSession({
                access_token: token,
                refresh_token: null 
            });

            if (sessionError) {
                console.error('❌ Errore nello stabilire la sessione:', sessionError);
            } else if (sessionData.session) {
                session = sessionData.session; 
            }

            // Pulisce l'URL (rimuovendo ?supabaseToken=...)
            const newUrl = new URL(window.location.href);
            newUrl.search = ''; 
            goto(newUrl.pathname, { replaceState: true });

        } catch (e) {
            console.error("Errore generico nel setup della sessione:", e);
        }
    }

    onMount(async () => {
        // --- 1. INIZIALIZZAZIONE SUPABASE ---
        // Legge le variabili d'ambiente pubbliche (prefisso VITE_PUBLIC_ in SvelteKit/Vite)
        const PUBLIC_SUPABASE_URL = import.meta.env.VITE_PUBLIC_SUPABASE_URL;
        const PUBLIC_SUPABASE_ANON_KEY = import.meta.env.VITE_PUBLIC_SUPABASE_ANON_KEY;

        if (!PUBLIC_SUPABASE_URL || !PUBLIC_SUPABASE_ANON_KEY) {
             console.error("Variabili d'ambiente Supabase pubbliche mancanti.");
             isLoading = false;
             return;
        }

        // Inizializza il client Supabase
        supabase = createClient(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY);
        setContext('supabase', supabase); // Rende il client disponibile tramite context

        // --- 2. GESTIONE TOKEN POST-LOGIN SERVER-SIDE ---
        if (data.supabaseToken) {
            console.log('✅ Token Supabase ricevuto dal server. Stabilendo la sessione...');
            await setupSession(data.supabaseToken);
        }

        // --- 3. SUPABASE AUTH LISTENER STANDARD ---
        // Ascolta i cambiamenti di stato dell'autenticazione
        authListener = supabase.auth.onAuthStateChange((event, newSession) => {
            console.log(`Auth event: ${event}`);
            session = newSession || null;
        });

        // --- 4. TELEGRAM WEBAPP READY ---
        if (typeof Telegram !== 'undefined' && Telegram.WebApp) {
            Telegram.WebApp.ready();
            Telegram.WebApp.expand();
            // Applica stili Telegram
            document.documentElement.style.setProperty('--background-color', Telegram.WebApp.themeParams.bg_color);
            document.documentElement.style.setProperty('--text-color', Telegram.WebApp.themeParams.text_color);
            document.documentElement.style.setProperty('--panel-bg', Telegram.WebApp.themeParams.secondary_bg_color);
            console.log('🎯 Telegram WebApp è pronto.');
        }

        isLoading = false;
    });

    onDestroy(() => {
        if (authListener && authListener.data) {
            authListener.data.unsubscribe();
        }
    });

    // Aggiorna la sessione dal $page store in caso di navigazione
    $: session = $page.data.session || session;

    const handleLogout = async () => {
        if (supabase) {
            await supabase.auth.signOut();
            session = null;
            if (typeof Telegram !== 'undefined' && Telegram.WebApp) {
                Telegram.WebApp.close();
            } else {
                goto('/');
            }
        }
    };
</script>

<!-- CSS globale per i colori e il font Inter -->
<svelte:head>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;800&display=swap" rel="stylesheet">
</svelte:head>

<div class="app-layout">
    <header class="navbar">
        <a href="/" class="logo">Scarpari Inside 2.0</a>
        <nav>
            {#if session}
                <span class="user-info" title="ID Utente Supabase: {session.user.id}">
                    👤 {session.user.user_metadata?.user_name || session.user.user_metadata?.first_name || 'Utente'}
                </span>
                <button on:click={handleLogout} class="logout-button">Esci</button>
            {:else if !isLoading}
                 <span class="user-info-status">Non autenticato</span>
            {/if}
        </nav>
    </header>

    <main class="content">
        {#if isLoading}
            <div class="loading-spinner">
                <div class="loader"></div>
                Autenticazione in corso...
            </div>
        {:else}
            <slot />
        {/if}
    </main>
</div>

<style>
    /* Variabili CSS con fallback dai temi Telegram */
    :root {
        --background-color: var(--tg-theme-bg-color, #1a202c);
        --panel-bg: var(--tg-theme-secondary-bg-color, #2d3748);
        --text-color: var(--tg-theme-text-color, #e2e8f0);
        --text-color-bright: var(--tg-theme-button-text-color, #ffffff);
        --accent-color: var(--tg-theme-accent-color, #4299e1);
        --error-color: #e53e3e;
    }
    
    :global(body) {
        margin: 0;
        padding: 0;
        background-color: var(--background-color);
        font-family: 'Inter', sans-serif;
        color: var(--text-color);
    }

    .app-layout {
        min-height: 100vh;
        background-color: var(--background-color);
    }
    .navbar {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 15px 40px;
        background-color: var(--panel-bg);
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.4);
        position: sticky;
        top: 0;
        z-index: 10;
    }
    .logo {
        font-size: 1.5rem;
        font-weight: 800;
        color: var(--text-color-bright);
        text-decoration: none;
    }
    nav {
        display: flex;
        align-items: center;
        gap: 20px;
    }
    .user-info {
        font-size: 0.9rem;
        color: var(--accent-color);
        font-weight: 600;
        padding: 5px 10px;
        border: 1px solid var(--accent-color);
        border-radius: 6px;
    }
    .user-info-status {
        font-size: 0.9rem;
        color: var(--text-color);
    }
    .content {
        padding: 20px;
        max-width: 1200px;
        margin: 0 auto;
    }
    .logout-button {
        padding: 8px 12px;
        background-color: var(--error-color);
        color: white;
        border: none;
        border-radius: 6px;
        cursor: pointer;
        font-weight: 600;
        transition: background-color 0.2s;
    }
    .logout-button:hover {
        background-color: #c53030;
    }

    .loading-spinner {
        text-align: center;
        padding: 50px;
        font-size: 1.1rem;
        color: var(--accent-color);
        display: flex;
        flex-direction: column;
        align-items: center;
    }

    .loader {
        border: 4px solid rgba(255, 255, 255, 0.3);
        border-top: 4px solid var(--accent-color);
        border-radius: 50%;
        width: 30px;
        height: 30px;
        animation: spin 1s linear infinite;
        margin-bottom: 15px;
    }

    @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
    }

    @media (max-width: 600px) {
        .navbar { padding: 10px 15px; }
        .logo { font-size: 1.2rem; }
        .content { padding: 15px; }
    }
</style>
