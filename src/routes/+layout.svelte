<script>
    import '../app.css'; // Importa gli stili globali
    // ⚠️ Qui dovrai importare la store dell'utente loggato (se usi Sveltekit-Supabase)
    // import { user } from '$lib/stores/auth'; 

    let loggedIn = true; // Simula l'utente loggato per il test
    let username = "Admin Scarpari";
</script>

<style>
    header {
        background-color: #121220; /* Scuro, leggermente diverso dal bg */
        padding: 15px 40px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        box-shadow: 0 2px 5px rgba(0, 0, 0, 0.5);
    }
    .logo {
        color: var(--accent-color);
        font-size: 1.5em;
        font-weight: 900;
        text-decoration: none;
    }
    .user-info {
        color: var(--text-color);
    }
</style>

<header>
    <a href="/" class="logo">SCARPARI INSIDE 2.0</a>
    {#if loggedIn}
        <div class="user-info">
            Bentornato, {username}
        </div>
    {/if}
</header>

<main style="max-width: 1200px; margin: 0 auto; padding: 20px 0;">
    <slot />
</main>
