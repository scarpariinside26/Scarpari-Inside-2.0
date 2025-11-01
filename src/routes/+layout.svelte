<script>
    // Importa i CSS globali, se presenti
    import '$lib/styles/app.css'; 
    
    // Non importare qui la vecchia NavBar laterale
</script>

<style>
    /* Stili CSS globali se non sono in app.css */
    /* Assicurati che il body sia a larghezza intera e non abbia margini */
    :global(body) {
        margin: 0;
        padding: 0;
        min-height: 100vh;
        background: #0f172a; /* Mantiene lo sfondo scuro globale */
    }
</style>

<slot />
