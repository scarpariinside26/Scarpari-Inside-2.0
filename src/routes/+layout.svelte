<script>
    import { createClient } from '@supabase/supabase-js';
    import { setContext, onMount } from 'svelte';
    // Rimosso: import { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY } from '$env/static/public';

    // 🛑 ATTENZIONE: SOSTITUISCI QUESTI PLACEHOLDER CON I TUOI VALORI REALI
    // Utilizzati per debugging per bypassare i problemi di caricamento di $env.
    const SUPABASE_URL = 'https://kegosmuokofyqrzwgjrl.supabase.co'; 
    const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtlZ29zbXVva29meXFyendnamVsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDQ1NTMzODUsImV4cCI6MjAyMDEyOTM4NX0.eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtlZ29zbXVva29meXFyendnamVsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDQ1NTMzODUsImV4cCI6MjAyMDEyOTM4NX0'; // Usa la tua chiave reale

    // 1. Inizializzazione del client Supabase
    // Visto che stai usando una chiave d'esempio generica, usa quella che vedi nello screenshot
    const supabase = createClient(SUPABASE_URL, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtlZ29zbXVva29meXFyendnamVsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDQ1NTMzODUsImV4cCI6MjAyMDEyOTM4NX0.eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtlZ29zbXVva29meXFyendnamVsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDQ1NTMzODUsImV4cCI6MjAyMDEyOTM4NX0');

    // 2. Iniezione del client nel contesto Svelte
    setContext('supabase', supabase);

    // 3. Stato per il monitoraggio dell'utente
    let user = null;
    let loading = true;

    // 4. Listener per lo stato di autenticazione
    onMount(() => {
        // Se per qualche motivo l'oggetto Supabase non è stato creato (es. URL o Key non validi)
        if (!supabase) {
             console.error("ERRORE CRITICO: Il client Supabase non è stato creato. Controlla le credenziali.");
             loading = false;
             return;
        }

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
</style>
