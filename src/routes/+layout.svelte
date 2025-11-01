<script>
    // Importa il CSS globale
    import '../app.css'; 
    
    // 🚀 CORREZIONE: Usa l'alias $lib per importare la Sidebar
    import Sidebar from '$lib/Sidebar.svelte'; 
</script>

<style>
    /* Stili Globali Necessari */
    :global(body) {
        background-color: var(--bg-color); 
        color: var(--text-color);
        margin: 0;
        min-height: 100vh;
    }
    
    /* Area del Contenuto Principale */
    .content {
        margin-left: 250px; /* Spazio per la sidebar fissa su desktop */
        padding: 20px;
        min-height: 100vh;
        transition: margin-left 0.3s;
    }
    
    /* Responsive Mobile: Il contenuto occupa tutto lo spazio */
    @media (max-width: 768px) {
        .content {
            margin-left: 0; 
            padding-top: 60px; /* Spazio per il pulsante del menu mobile */
        }
    }
</style>

<Sidebar />

<div class="content">
    <slot />
</div>
