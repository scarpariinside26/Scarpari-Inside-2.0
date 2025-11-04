<script>
    import { goto } from '$app/navigation';
    import { getContext } from 'svelte';
    import { quartOut } from 'svelte/easing';
    import { fly } from 'svelte/transition';

    // 1. CHIAMATA IMMEDIATA: Otteniamo Supabase dal Layout
    let supabase = getContext('supabase'); 
    let isSupabaseReady = !!supabase; // Aggiungiamo un flag di sicurezza

    let email = '';
    let errorMessage = '';
    let successMessage = '';
    let loading = false;

    /**
     * Gestisce la richiesta di reset password.
     */
    async function handleResetPassword() {
        if (!isSupabaseReady) {
            errorMessage = 'Errore di sistema. Ricarica la pagina.';
            return;
        }

        errorMessage = '';
        successMessage = '';
        loading = true;

        // La URL di reindirizzamento DEVE puntare alla pagina di update-password
        const redirectUrl = `${window.location.origin}/update-password`;

        const { error } = await supabase.auth.resetPasswordForEmail(email, {
            redirectTo: redirectUrl,
        });

        if (error) {
            errorMessage = error.message;
        } else {
            successMessage = 'Link di reset inviato! Controlla la tua email.';
        }
        
        loading = false;
    }
</script>

<div class="forgot-container" transition:fly={{ y: 50, duration: 400, easing: quartOut }}>
    <div class="forgot-panel">
        <h1>Password Dimenticata</h1>

        <form on:submit|preventDefault={handleResetPassword}>
            <p class="instruction">Inserisci l'indirizzo email associato al tuo account. Ti invieremo un link per resettare la password.</p>

            <div class="form-group">
                <label for="email">Email</label>
                <!-- Disabilita se loading o se Supabase non è pronto -->
                <input type="email" id="email" bind:value={email} required disabled={loading || !isSupabaseReady} />
            </div>

            {#if errorMessage}
                <p class="error">{errorMessage}</p>
            {/if}
            
            {#if successMessage}
                <p class="success">{successMessage}</p>
            {/if}

            <button type="submit" class="reset-button" disabled={loading || !isSupabaseReady}>
                {#if loading}
                    Invio in corso...
                {:else}
                    Invia link di reset
                {/if}
            </button>
        </form>
        
        <p class="help-links">
            <a href="/login">Torna al Login</a>
        </p>
    </div>
</div>

<style>
    /* Stili CSS */
    .forgot-container {
        display: flex;
        justify-content: center;
        align-items: center;
        min-height: 100vh;
        padding: 20px;
    }
    .forgot-panel {
        background: var(--panel-bg);
        padding: 40px;
        border-radius: 12px;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
        max-width: 400px;
        width: 100%;
        text-align: center;
    }
    h1 {
        color: var(--text-color-bright);
        margin-bottom: 20px;
        font-size: 1.8rem;
    }
    .instruction {
        color: var(--text-color);
        margin-bottom: 25px;
        font-size: 0.9rem;
    }
    .form-group {
        text-align: left;
        margin-bottom: 20px;
    }
    label {
        display: block;
        margin-bottom: 8px;
        font-weight: 600;
        color: var(--text-color);
    }
    input {
        width: 100%;
        padding: 12px;
        border-radius: 8px;
        border: 1px solid var(--input-border);
        background: var(--input-bg);
        color: var(--text-color);
        box-sizing: border-box;
    }
    .reset-button {
        width: 100%;
        padding: 12px;
        border: none;
        border-radius: 8px;
        font-weight: 700;
        font-size: 1rem;
        cursor: pointer;
        margin-top: 15px;
        transition: background 0.2s, opacity 0.2s;
        background: var(--accent-color);
        color: white;
    }
    .reset-button:disabled {
        opacity: 0.5;
        cursor: not-allowed;
    }
    .error {
        color: var(--error-color);
        margin-top: 15px;
        margin-bottom: 5px;
    }
    .success {
        color: var(--success-color);
        margin-top: 15px;
        margin-bottom: 5px;
    }
    .help-links {
        margin-top: 25px;
        font-size: 0.9rem;
    }
    .help-links a {
        color: var(--accent-color);
        text-decoration: none;
    }
</style>
