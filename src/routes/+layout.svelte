<script>
    import { setContext } from 'svelte';
    import { goto } from '$app/navigation';
    import { onMount, onDestroy } from 'svelte';
    import { getSupabase } from '@supabase/auth-helpers-sveltekit'; // Assumendo che usi le auth-helpers

    export let data;

    // Supabase Auth Listener (standard)
    let session = data.session;
    let isLoading = true;
    let authListener = null;

    onMount(async () => {
        const { supabase } = getSupabase();
        setContext('supabase', supabase);
        
        // 1. GESTIONE TOKEN POST-LOGIN TELEGRAM (PRIORITARIA)
        if (data.supabaseToken) {
            console.log('✅ Token Supabase ricevuto dal server. Tentativo di stabilire la sessione...');
            try {
                // Stabilisce la sessione Supabase usando il JWT generato dalla RPC
                const { data: sessionData, error: sessionError } = await supabase.auth.setSession({
                    access_token: data.supabaseToken
                });

                if (sessionError) {
                    console.error('❌ Errore nello stabilire la sessione:', sessionError);
                    // Gestisci l'errore, magari mostrando un messaggio utente
                } else if (sessionData.session) {
                    console.log('🎉 Sessione Supabase stabilita con successo.');
                    session = sessionData.session; // Aggiorna la sessione locale
                }

                // Pulisce l'URL dopo aver usato il token per evitare re-login indesiderati.
                // Manteniamo solo il path base.
                const newUrl = new URL(window.location.href);
                newUrl.search = ''; 
                goto(newUrl.pathname, { replaceState: true });

            } catch (e) {
                console.error("Errore generico nel setup della sessione:", e);
            }
        }

        // 2. SUPABASE AUTH LISTENER STANDARD
        // Ascolta i cambiamenti di stato di autenticazione per mantenere la sessione aggiornata
        authListener = supabase.auth.onAuthStateChange((event, newSession) => {
            if (newSession) {
                session = newSession;
            } else {
                session = null;
            }
        });

        // 3. TELEGRAM WEBAPP READY (Se in ambiente Telegram)
        if (typeof Telegram !== 'undefined' && Telegram.WebApp) {
            Telegram.WebApp.ready();
            Telegram.WebApp.expand();
            console.log('🎯 Telegram WebApp è pronto.');
        } else {
            console.log('⚠️ Non in ambiente Telegram - Modalità sviluppo.');
        }

        isLoading = false;
    });

    onDestroy(() => {
        // Pulisce il listener al momento della distruzione del componente
        if (authListener && authListener.data) {
            authListener.data.unsubscribe();
        }
    });

</script>

<div class="app-layout">
    <header class="navbar">
        <a href="/" class="logo">Scarpari Inside</a>
        <nav>
            {#if session}
                <span class="user-info">
                    <!-- Mostra nome utente da Supabase metadata, che viene popolato dalla RPC -->
                    👤 {session.user.user_metadata?.user_name || session.user.email}
                </span>
                <!-- Non mostriamo il bottone di Logout in un ambiente Telegram, ma è buona pratica averlo in dev -->
            {:else if !isLoading}
                 <!-- Aggiungi qui un pulsante di login Telegram se l'app è standalone -->
                <span class="user-info">Non autenticato</span>
            {/if}
        </nav>
    </header>

    <main class="content">
        <!-- Mostra uno spinner mentre il token viene elaborato o la sessione è in caricamento -->
        {#if isLoading && data.supabaseToken}
            <p>Autenticazione in corso...</p>
        {:else}
            <!-- Rende il contenuto della pagina corrente -->
            <slot />
        {/if}
    </main>
</div>

<!-- Stili CSS come nel tuo file originale -->
<style>
    /* ... i tuoi stili ... */
    :root {
        --background-color: #1a202c;
        --panel-bg: #2d3748;
        --text-color: #e2e8f0;
        --text-color-bright: #ffffff;
        --accent-color: #4299e1;
    }
    .app-layout {
        min-height: 100vh;
        background-color: var(--background-color);
        color: var(--text-color);
    }
    .navbar {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 15px 40px;
        background-color: var(--panel-bg);
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
    }
    .logo {
        font-size: 1.5rem;
        font-weight: bold;
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
        color: var(--text-color);
    }
    .content {
        padding: 20px;
    }
</style>
