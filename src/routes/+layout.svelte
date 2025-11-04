<script>
    import { onMount, setContext } from 'svelte';
    import { writable } from 'svelte/store';
    import { goto } from '$app/navigation';
    
    // CORREZIONE FINALE QUI: Il percorso corretto per i file in /src/ è "../app.css"
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
            if (session) {
                // Aggiorna lo store della sessione e reindirizza alla dashboard o alla pagina iniziale
                sessionStore.set(session);
                
                // Se l'utente è nella pagina di login/callback, reindirizzalo
                if (window.location.pathname.startsWith('/auth')) {
                    goto('/');
                }
            } else {
                // Utente disconnesso
                sessionStore.set(null);
                
                // Se l'utente non è autenticato e non è nella pagina di login, reindirizza
                if (!window.location.pathname.startsWith('/auth')) {
                    goto('/auth');
                }
            }
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
        font-family: 'Inter', sans-serif;
    }
</style>
