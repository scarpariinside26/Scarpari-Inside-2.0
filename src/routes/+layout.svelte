<script>
    import { createClient } from '@supabase/supabase-js';
    import { setContext, onMount } from 'svelte';
    import { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY } from '$env/static/public';

    // 1. Inizializzazione del client Supabase
    // NOTA: Deve avvenire qui, all'inizio del modulo o dello script principale,
    // e non all'interno di onMount, altrimenti è troppo tardi per il routing SSR.
    const supabase = createClient(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY);

    // 2. Iniezione del client nel contesto Svelte
    setContext('supabase', supabase);

    // 3. Stato per il monitoraggio dell'utente
    let user = null;
    let loading = true;

    // 4. Listener per lo stato di autenticazione
    onMount(() => {
        supabase.auth.onAuthStateChange((event, session) => {
            user = session?.user ?? null;
            loading = false;
        });
    });

    // Opzionale: Monitoraggio della variabile 'user' per reindirizzamenti
    import { goto } from '$app/navigation';
    import { page } from '$app/stores';

    $: {
        const path = $page.url.pathname;
        const authPaths = ['/login', '/signup', '/forgot-password', '/update-password'];
        
        // Se l'utente è autenticato E sta cercando di accedere a una pagina di autenticazione
        if (user && authPaths.includes(path)) {
            goto('/'); // Reindirizza alla dashboard
        } 
        
        // Logica per proteggere le rotte (Esempio: se non autenticato, vai al login)
        // if (!user && !authPaths.includes(path) && path !== '/') {
        //     goto('/login'); 
        // }
    }
</script>

<svelte:head>
    <!-- Configurazione Font Inter -->
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@100..900&display=swap" rel="stylesheet">
    <title>SvelteKit Supabase App</title>
</svelte:head>

<!-- Contenuto principale dell'applicazione -->
<main class="font-inter">
    <!-- Se è in caricamento, puoi mostrare un messaggio -->
    {#if loading}
        <div class="loading-overlay">Caricamento sessione...</div>
    {:else}
        <!-- Inietta il contenuto della pagina -->
        <slot />
    {/if}
</main>

<style>
    :root {
        /* Colori per il tema scuro (come nella tua immagine di login) */
        --background-color: #1a202c; 
        --panel-bg: #2d3748;
        --text-color: #e2e8f0;
        --text-color-bright: #ffffff;
        --input-border: #4a5568;
        --input-bg: #1a202c;
        --accent-color: #4299e1;
        --error-color: #f56565;
        --success-color: #48bb78;
    }
    
    body {
        margin: 0;
        background-color: var(--background-color);
        color: var(--text-color);
        min-height: 100vh;
        font-family: 'Inter', sans-serif;
    }
    .font-inter {
        font-family: 'Inter', sans-serif;
    }
    .loading-overlay {
        display: flex;
        justify-content: center;
        align-items: center;
        min-height: 100vh;
        font-size: 1.5rem;
        color: var(--text-color);
    }
    /* ... altri stili globali se necessario ... */
</style>
