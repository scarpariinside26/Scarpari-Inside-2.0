<script>
    import { getContext } from 'svelte';
    import { goto } from '$app/navigation';
    import { quartOut } from 'svelte/easing';
    import { fly } from 'svelte/transition';

    const supabase = getContext('supabase');

    let newPassword = '';
    let confirmPassword = '';
    let errorMessage = '';
    let successMessage = '';
    let loading = false;

    async function handlePasswordUpdate() {
        errorMessage = '';
        successMessage = '';
        
        if (newPassword !== confirmPassword) {
            errorMessage = 'Le password non corrispondono.';
            return;
        }

        if (newPassword.length < 6) {
             errorMessage = 'La password deve contenere almeno 6 caratteri.';
            return;
        }

        loading = true;

        // La funzione updateUser aggiorna la password dell'utente che ha effettuato il login temporaneo tramite il link.
        const { error } = await supabase.auth.updateUser({
            password: newPassword
        });

        loading = false;

        if (error) {
            errorMessage = error.message;
        } else {
            successMessage = 'Password aggiornata con successo! Sarai reindirizzato al login.';
            // Reindirizza al login dopo un breve timeout
            setTimeout(() => {
                 goto('/login');
            }, 3000);
        }
    }
</script>

<div class="update-container" transition:fly={{ y: 50, duration: 400, easing: quartOut }}>
    <div class="update-panel">
        <h1>Reimposta Password</h1>
        <p class="description">Inserisci la tua nuova password.</p>

        <form on:submit|preventDefault={handlePasswordUpdate}>
            <div class="form-group">
                <label for="newPassword">Nuova Password</label>
                <input type="password" id="newPassword" bind:value={newPassword} required disabled={loading} minlength="6" />
            </div>
            
            <div class="form-group">
                <label for="confirmPassword">Conferma Nuova Password</label>
                <input type="password" id="confirmPassword" bind:value={confirmPassword} required disabled={loading} minlength="6" />
            </div>

            {#if errorMessage}
                <p class="error">{errorMessage}</p>
            {/if}
            
            {#if successMessage}
                <p class="success">{successMessage}</p>
            {/if}

            <button type="submit" class="update-button" disabled={loading || successMessage}>
                {#if loading}
                    Aggiornamento in corso...
                {:else}
                    Aggiorna Password
                {/if}
            </button>
        </form>
    </div>
</div>

<style>
    /* Usa gli stessi stili del login/reset per coerenza */
    .update-container {
        display: flex;
        justify-content: center;
        align-items: center;
        min-height: 100vh;
        padding: 20px;
    }
    .update-panel {
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
    .update-button {
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
    .update-button:disabled {
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
</style>
