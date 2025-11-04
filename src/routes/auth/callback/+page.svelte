<script>
    import { onMount } from 'svelte';
    import { goto } from '$app/navigation';
    
    // Non devi fare nulla qui, SvelteKit gestirà il server-side load
    // e il reindirizzamento, ma è buona norma avere il file.
    
    onMount(() => {
        // Se per qualche motivo il server non reindirizza, assicuriamoci di farlo qui.
        // Questo è solo un fallback, la logica principale è in +page.server.js
        goto('/app');
    });
</script>

<div class="callback-container">
    <h1>Accesso in corso...</h1>
    <p>Reindirizzamento alla tua dashboard.</p>
    <!-- Aggiungi un semplice spinner se vuoi -->
</div>

<style>
    .callback-container {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        min-height: 100vh;
        text-align: center;
        background-color: #1a202c;
        color: #e2e8f0;
    }
    h1 {
        font-size: 2rem;
        margin-bottom: 10px;
    }
</style>
