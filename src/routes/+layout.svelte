<script>
    import '../app.css'; // Assicurati che app.css esista
    import Sidebar from '$lib/Sidebar.svelte';
</script>

<style>
    :global(body) {
        background-color: var(--bg-color); /* Sfondo scuro principale */
        color: var(--text-color);
        margin: 0;
    }
    .content {
        margin-left: 250px; /* Spazio per la sidebar fissa */
        padding: 20px;
        min-height: 100vh;
        transition: margin-left 0.3s;
    }
    
    /* Responsive Mobile */
    @media (max-width: 768px) {
        .content {
            margin-left: 0; /* Su mobile occupa tutto lo spazio */
            padding-top: 60px; /* Lascia spazio al toggle menu */
        }
    }
</style>

<Sidebar />

<div class="content">
    <slot />
</div>
