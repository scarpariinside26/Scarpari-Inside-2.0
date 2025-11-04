<script>
    import { createClient } from '@supabase/supabase-js';
    import { setContext } from 'svelte';
    import { onMount } from 'svelte';

    // Rimuovi l'importazione di $env/static/public se crea problemi.
    // Inserisci QUI i tuoi valori reali di URL e Chiave ANON.
    // Questi sono gli URL e la chiave del progetto mostrati nei tuoi screenshot:
    const SUPABASE_URL = 'https://kegosmuokofyqrzwgjrl.supabase.co';
    const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtlZ29zbXVva29meXFyendnamVsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDQ1NTMzODUsImV4cCI6MjAyMDEyOTM4NX0.eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtlZ29zbXVva29meXFyendnamVsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDQ1NTMzODUsImV4cCI6MjAyMDEyOTM4NX0'; 

    let supabase;
    let loading = true; // Mantieni il loading per evitare flash

    try {
        // 1. Inizializzazione del client Supabase
        supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
        
        // 2. Iniezione del client nel contesto Svelte
        // Questa chiamata avviene PRIMA del mount di qualsiasi componente figlio
        setContext('supabase', supabase);

    } catch (e) {
        console.error("ERRORE CRITICO DI INIZIALIZZAZIONE SUPABASE NEL LAYOUT:", e);
        // Se la creazione fallisce, setContext non viene chiamato
    }

    // Usiamo onMount solo per la parte Auth e per terminare il loading
    onMount(() => {
        if (supabase) {
            // Se Supabase è disponibile, possiamo registrare il listener
            supabase.auth.onAuthStateChange((event, session) => {
                // Gestione sessione omessa per semplicità di debug, ma il loading FINISCE qui
                loading = false;
            });
        } else {
            // Se Supabase è nullo qui, mostriamo immediatamente il contenuto
            loading = false;
        }
    });

    // Importazioni per SvelteKit (devono stare sotto il setContext)
    import { goto } from '$app/navigation';
    import { page } from '$app/stores';
    // Logica di reindirizzamento omessa per semplicità di debug
</script>

<svelte:head>
    <!-- Configurazione Font Inter -->
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@100..900&display=swap" rel="stylesheet">
    <title>SvelteKit Supabase App</title>
</svelte:head>

<!-- Contenuto principale dell'applicazione -->
<main class="font-inter">
    {#if loading}
        <div class="loading-overlay">Caricamento sessione e connessione al database...</div>
    {:else}
        <!-- Inietta il contenuto della pagina -->
        <slot />
    {/if}
</main>

<style>
    /* Stili CSS globali */
    :root {
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
