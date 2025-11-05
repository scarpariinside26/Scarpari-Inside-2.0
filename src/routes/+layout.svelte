<script>
    import { setContext } from 'svelte';
    import { goto } from '$app/navigation';
    import { onMount } from 'svelte';

    export let data;

    // 🆕 VARIABILE PER TELEGRAM USER
    let tgUser = null;
    let session = null;
    let isLoading = true;

    onMount(() => {
        isLoading = false;

        // 🆕 TELEGRAM AUTH - Sostituisce Supabase Auth
        if (typeof Telegram !== 'undefined' && Telegram.WebApp) {
            Telegram.WebApp.ready();
            Telegram.WebApp.expand();
            
            tgUser = Telegram.WebApp.initDataUnsafe.user;
            
            if (tgUser) {
                // 🆕 Crea sessione fittizia per compatibilità
                session = {
                    user: {
                        id: tgUser.id,
                        email: tgUser.username ? `${tgUser.username}@telegram.user` : `user${tgUser.id}@telegram.user`,
                        user_metadata: {
                            full_name: `${tgUser.first_name || ''} ${tgUser.last_name || ''}`.trim(),
                            avatar_url: tgUser.photo_url
                        }
                    }
                };
                console.log('🎯 Utente Telegram autenticato:', tgUser);
            }
        } else {
            console.log('⚠️ Non in ambiente Telegram - Modalità sviluppo');
            // 🆕 Session fittizia per sviluppo
            session = {
                user: {
                    id: 'dev-user-123',
                    email: 'dev@telegram.user',
                    user_metadata: {
                        full_name: 'Utente Sviluppo',
                        avatar_url: null
                    }
                }
            };
        }

        // 🆕 MANTIENI SUPABASE PER DATI (ma non per auth)
        if (data.supabase) {
            setContext('supabase', data.supabase);
        }
    });

    // 🆕 RIMUOVI la funzione di logout (non serve in Telegram)
</script>

<div class="app-layout">
    <!-- 🆕 HEADER SEMPLIFICATO - Rimuovi login/logout -->
    <header class="navbar">
        <a href="/" class="logo">Scarpari Inside</a>
        <nav>
            {#if session}
                <span class="user-email">
                    {#if tgUser}
                        👤 {tgUser.first_name} {tgUser.last_name || ''}
                    {:else}
                        👤 {session.user.user_metadata.full_name}
                    {/if}
                </span>
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
    .content {
        padding: 20px;
    }
</style>
