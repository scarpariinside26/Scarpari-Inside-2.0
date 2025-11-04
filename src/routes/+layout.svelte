<script>
    import { setContext } from 'svelte';
    import { goto } from '$app/navigation';
    import { onMount } from 'svelte';

    // Il prop `data` contiene { supabase, session } restituito da +layout.js
    /** @type {import('./$types').LayoutData} */
    export let data;

    // 1. INIETTA SUPABASE: Imposta il client Supabase nel contesto.
    // Questo è il passaggio che risolve "Multiple GoTrueClient instances detected"
    setContext('supabase', data.supabase);

    // Variabile reattiva per tenere traccia della sessione.
    let { session } = data;
    let isLoading = true;

    // 2. LISTENER PER LA SESSIONE: Gestisce il reindirizzamento
    onMount(() => {
        isLoading = false;

        // Listener che reagisce a OGNI cambio di stato (login, logout, refresh del token)
        const { data: authListener } = data.supabase.auth.onAuthStateChange(
            (event, newSession) => {
                session = newSession; // Aggiorna la sessione reattivamente

                if (newSession && (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED')) {
                    // L'utente si è autenticato o ha aggiornato la sessione, reindirizziamo alla dashboard
                    if (window.location.pathname.startsWith('/login') || window.location.pathname.startsWith('/signup')) {
                        goto('/');
                    }
                } else if (!newSession && event === 'SIGNED_OUT') {
                    // L'utente ha effettuato il logout, assicuriamoci che non sia su pagine protette
                    if (!['/login', '/signup', '/forgot-password'].includes(window.location.pathname)) {
                         goto('/login');
                    }
                }
            }
        );

        // Funzione di pulizia: interrompe l'ascolto quando il componente viene distrutto
        return () => {
            authListener.subscription.unsubscribe();
        };
    });

    // Funzione di logout client-side, più semplice e rapida.
    export async function handleLogout() {
        if (data.supabase) {
            await data.supabase.auth.signOut();
            // Il listener sopra gestirà il reindirizzamento a /login
        }
    }
</script>

<div class="app-layout">
    <!-- Navbar o Intestazione con pulsante di Logout -->
    <header class="navbar">
        <a href="/" class="logo">My App</a>
        <nav>
            {#if session}
                <span class="user-email">{session.user.email}</span>
                <button on:click={handleLogout} class="logout-btn">Logout</button>
            {:else}
                <a href="/login" class="nav-link">Login</a>
                <a href="/signup" class="nav-link">Sign Up</a>
            {/if}
        </nav>
    </header>

    <main class="content">
        {#if isLoading}
            <p>Caricamento App...</p>
        {:else}
            <!-- Rende il contenuto della pagina corrente -->
            <slot />
        {/if}
    </main>
</div>

<style>
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
    .user-email {
        font-size: 0.9rem;
        color: var(--text-color);
    }
    .nav-link {
        color: var(--accent-color);
        text-decoration: none;
        padding: 5px 10px;
        border-radius: 4px;
        transition: background-color 0.2s;
    }
    .nav-link:hover {
        background-color: #3f587a;
    }
    .logout-btn {
        background-color: #e53e3e;
        color: white;
        border: none;
        padding: 8px 15px;
        border-radius: 6px;
        cursor: pointer;
        font-weight: 600;
        transition: background-color 0.2s;
    }
    .logout-btn:hover {
        background-color: #c53030;
    }
    .content {
        padding: 20px;
    }
</style>
