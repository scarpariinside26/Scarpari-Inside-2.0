<script>
    import { onMount, setContext } from 'svelte';
    import { writable } from 'svelte/store';
    // Assicurati che questo percorso di importazione sia corretto per i tuoi stili globali
    import './app.css'; 

    /** * Prop fornita dalla funzione load di +layout.js (SupabaseClient e sessione)
     * @type {{ supabase: import('@supabase/supabase-js').SupabaseClient, session: import('@supabase/supabase-js').Session | null }} 
     */
    export let data;

    const { supabase, session } = data;
    
    // 1. Crea uno store Svelte per tracciare lo stato della sessione (cruciale per aggiornare la UI)
    const sessionStore = writable(session);

    // 2. Rendi Supabase e la sessione accessibili a tutti i componenti figli
    setContext('supabase', supabase);
    setContext('session', sessionStore);

    onMount(() => {
        // 3. Iscriviti ai cambiamenti di stato dell'autenticazione.
        // Questo risolve il problema del login social: quando Google reindirizza,
        // questo ascoltatore cattura il cambiamento di stato e aggiorna la sessione.
        const { data: authListener } = supabase.auth.onAuthStateChange(
            (event, currentSession) => {
                // Aggiorna lo store per innescare gli aggiornamenti della UI
                sessionStore.set(currentSession);
                
                // Opzionale: log per il debug
                console.log('Auth event:', event);
            }
        );

        // Funzione di pulizia: interrompe l'ascolto quando il componente viene distrutto
        return () => {
            if (authListener) {
                 authListener.unsubscribe();
            }
        };
    });
</script>

<!-- Struttura base del layout (puoi personalizzare questi stili) -->
<div class="app-layout">
    <nav class="p-4 bg-white shadow-md flex justify-between items-center">
        <a href="/" class="text-xl font-bold text-indigo-600">Scarpari App</a>
        <!-- Esempio di UI che cambia in base allo stato di autenticazione -->
        {#if $sessionStore}
            <div class="flex items-center space-x-4">
                <span class="text-sm text-gray-600">Bentornato, {$sessionStore.user.email}</span>
                <!-- Qui andrebbe il pulsante di Logout -->
            </div>
        {:else}
            <a href="/login" class="text-indigo-600 hover:text-indigo-800 font-medium">Accedi</a>
        {/if}
    </nav>

    <main class="p-8">
        <!-- Lo slot è dove viene renderizzata la pagina corrente (es. /login) -->
        <slot />
    </main>
</div>

<style>
    /* Stili CSS di base */
    .app-layout {
        min-height: 100vh;
        background-color: #f7f9fb;
        color: #333;
        font-family: 'Inter', sans-serif;
    }
</style>
