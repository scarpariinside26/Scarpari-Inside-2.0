<script>
    // ✅ CORREZIONE DEL PERCORSO: Importa il CSS risalendo di un livello (da /routes/ a /src/)
    import '../../app.css'; 
    // Assicurati di non importare qui la vecchia NavBar laterale
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
        /* NOTA: Se vedi ancora lo spazio in basso della pagina tagliato, 
           potrebbe essere necessario impostare qui il padding-bottom 
           o nel file app.css, come abbiamo fatto.
        */
    }
</style>

<slot />
