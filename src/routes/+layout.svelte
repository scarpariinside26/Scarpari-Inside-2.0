<script>
    // ✅ CORREZIONE FINALE: Usa l'alias $lib che funziona sempre.
    import '$lib/styles/app.css'; 
    
</script>

<style>
    /* Stili CSS di fallback per il body, se necessario */
    :global(body) {
        margin: 0;
        padding: 0;
        min-height: 100vh;
        /* Usa la variabile definita in app.css, che è ormai caricata */
        background-color: var(--bg-color); 
        color: var(--text-color);
    }
</style>

<slot />
