<script>
    import { setContext } from 'svelte';
    import '$lib/styles/app.css';
    
    // 1. Accetta i dati passati dal file +layout.server.js e hooks.client.js
    export let data;

    // 2. INIEZIONE CRUCIALE: Rendi l'istanza Supabase e la sessione disponibili tramite il Contesto Svelte
    setContext('supabase', data.supabase);
    setContext('session', data.session); 

    // Opzionale: puoi aggiungere la logica di gestione degli eventi di autenticazione qui, 
    // ma l'iniezione del contesto è la priorità.
    
</script>

<style>
    /* Stili CSS esistenti */
    :global(body) {
        margin: 0;
        padding: 0;
        min-height: 100vh;
        background-color: var(--bg-color); 
        color: var(--text-color);
    }
</style>

<slot />
