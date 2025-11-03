<script>
    import { getContext } from 'svelte';
    import { quartOut } from 'svelte/easing';
    import { fly } from 'svelte/transition';

    const supabase = getContext('supabase');

    let email = '';
    let errorMessage = '';
    let successMessage = '';
    let loading = false;

    async function handlePasswordReset() {
        errorMessage = '';
        successMessage = '';
        loading = true;

        // Invia l'email di reset password tramite Supabase.
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
            // L'utente verrà reindirizzato a questo URL dopo aver cliccato il link nella mail.
            // Di solito, si reindirizza a una pagina di aggiornamento password.
            redirectTo: `${window.location.origin}/update-password` 
        });

        loading = false;

        if (error) {
            errorMessage = error.message;
        } else {
            successMessage = 'Se l\'email è corretta, riceverai un link per reimpostare la password a breve. Controlla la tua casella di posta.';
        }
    }
</script>

<div class="reset-container" transition:fly={{ y: 50, duration: 400, easing: quartOut }}>
    <div class="reset-panel">
        <h1>Password Dimenticata?</h1>
        <p class="description">Inserisci la tua email e ti invieremo le istruzioni per reimpostare la tua password.</p>

        <form on:submit|preventDefault={handlePasswordReset}>
            <div class="form-group">
                <label for="email">Email</label>
                <input type="email" id="email" bind:value={email} required disabled={loading} />
            </div>

            {#if errorMessage}
                <p class="error">{errorMessage}</p>
            {/if}
            
            {#if successMessage}
                <p class="success">{successMessage}</p>
            {/if}

            <button type="submit" class="reset-button" disabled={loading || successMessage}>
                {#if loading}
                    Invio in corso...
                {:else}
                    Invia Istruzioni di Reset
                {/if}
            </button>
        </form>
        
        <p class="help-links">
            <a href="/login">Torna al Login</a>
        </p>
    </div>
</div>

<style>
    .reset-container {
        display: flex;
        justify-content: center;
        align-items: center;
        min-height: 100vh;
        padding: 20px;
    }
    .reset-panel {
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
        margin-bottom: 15px;
        font-size: 2rem;
    }
    .description {
        color: var(--text-color-muted);
        margin-bottom: 25px;
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
        transition: background 0.2s;
        background: var(--accent-color);
        color: black;
    }
    .reset-button:disabled {
        opacity: 0.6;
        cursor: not-allowed;
    }
    .error {
        color: var(--error-color);
        margin-bottom: 15px;
    }
    .success {
        color: var(--success-color);
        margin-bottom: 15px;
    }
    .help-links {
        margin-top: 20px;
        font-size: 0.9rem;
    }
    .help-links a {
        color: var(--accent-color);
        text-decoration: none;
    }
</style>
