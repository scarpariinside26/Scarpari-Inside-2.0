<script>
    // ⚠️ ASSICURATI che il percorso sia corretto: deve puntare al tuo file CSS principale
    import '../app.css'; 
    import Sidebar from '$lib/Sidebar.svelte';
</script>

<style>
    /* ⚠️ Lo stile :global(body) è necessario per impostare lo sfondo Dark Mode */
    :global(body) {
        background-color: var(--bg-color); 
        color: var(--text-color);
        margin: 0;
        min-height: 100vh;
    }
    .content {
        margin-left: 250px; /* Spazio per la sidebar fissa */
        padding: 20px;
        min-height: 100vh;
        transition: margin-left 0.3s;
    }
    
    /* Media Query per Mobile: Rimuove il margine della sidebar */
    @media (max-width: 768px) {
        .content {
            margin-left: 0; 
            padding-top: 60px; 
        }
    }
</style>

<Sidebar />

<div class="content">
    <slot />
</div>
