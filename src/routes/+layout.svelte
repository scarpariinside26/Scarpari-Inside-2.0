<script>
    import { onMount, setContext } from 'svelte';
    import { writable } from 'svelte/store';
    // NON importare 'goto' o usare la navigazione qui se la gestisci in +layout.server.js
    
    import '../app.css';

    /** @type {import('./$types').LayoutData} */
    export let data;

    // Supabase client instance e sessione iniziale
    const supabase = data.supabase;
    const sessionStore = writable(data.session);

    // Esponi il client Supabase e la sessione in un contesto globale
    setContext('supabase', supabase);
    setContext('session', sessionStore);

    onMount(() => {
        // Ascolta i cambiamenti di autenticazione in tempo reale
        const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
            // Aggiorna solo lo store della sessione
            // La logica di reindirizzamento è ora gestita interamente da +layout.server.js
            sessionStore.set(session);
            
            // Nota: Se l'evento è 'SIGNED_OUT', SvelteKit reindirizzerà 
            // automaticamente l'utente a /login se si trova su una route protetta,
            // grazie al tuo +layout.server.js.
        });

        // Pulisce l'ascoltatore alla distruzione del componente
        return () => subscription.unsubscribe();
    });

</script>

<div class="app-container">
    <!-- Visualizza il contenuto delle pagine interne -->
    <slot />
</div>

<style>
    /* Stili minimi per l'app container (dovrebbero essere nel tuo app.css) */
    .app-container {
        display: flex;
        flex-direction: column;
        min-height: 100vh;
        background: var(--bg-color-dark);
        color: var(--text-color);
        /* Ho lasciato Inter come fallback perché Roboto non è definito in questo file */
        font-family: 'Inter', sans-serif; 
    }
</style>
