<script>
    import { getContext } from 'svelte';
    import { goto } from '$app/navigation';
    
    // 1. CHIAMATA IMMEDIATA: Otteniamo Supabase dal Layout
    let supabase = getContext('supabase');
    let isReady = !!supabase; // Flag per abilitare/disabilitare la UI

    let password = '';
    let confirmPassword = '';
    let message = '';
    let isSuccess = false;
    let loading = false; // Aggiunto flag di loading

    // Logica di fallback per debug (non dovrebbe più essere necessaria, ma è una sicurezza)
    if (!supabase) {
        console.error("ERRORE CRITICO: Supabase non è stato iniettato dal layout nella pagina update-password.");
        message = "Errore di sistema: client non disponibile.";
    }

    // --- Logica ---
    async function updatePassword() {
        if (!isReady) {
            message = "Attendere il caricamento del sistema.";
            return;
        }

        loading = true;
        message = 'Aggiornamento in corso...';
        isSuccess = false;

        if (password !== confirmPassword) {
            message = 'Le password non corrispondono.';
            loading = false;
            return;
        }
        if (password.length < 6) {
            message = 'La password deve contenere almeno 6 caratteri.';
            loading = false;
            return;
        }

        // Supabase riconosce automaticamente la sessione temporanea in base all'URL.
        const { error } = await supabase.auth.updateUser({ password });

        if (error) {
            console.error('Errore durante l\'aggiornamento:', error);
            message = `Errore di aggiornamento: ${error.message}`;
            isSuccess = false;
        } else {
            message = 'Password aggiornata con successo! Reindirizzamento...';
            isSuccess = true;
            
            // Dopo il successo, reindirizza l'utente alla dashboard (o home)
            setTimeout(() => {
                // Modificato in '/' come destinazione sicura, se '/app' non esiste.
                goto('/'); 
            }, 2000);
        }
        loading = false;
    }
</script>

<div class="auth-container">
    <h2>Aggiorna Password</h2>
    
    <form on:submit|preventDefault={updatePassword} class="auth-form">
        <div class="form-group">
            <label for="password">Nuova Password</label>
            <input 
                id="password" 
                type="password" 
                bind:value={password} 
                required 
                minlength="6"
                disabled={!isReady || loading}
            />
        </div>

        <div class="form-group">
            <label for="confirmPassword">Conferma Password</label>
            <input 
                id="confirmPassword" 
                type="password" 
                bind:value={confirmPassword} 
                required 
                disabled={!isReady || loading}
            />
        </div>
        
        <button type="submit" class="auth-button" disabled={!isReady || loading}>
            {#if !isReady || loading}
                {loading ? 'Attendere...' : 'Caricamento...'}
            {:else}
                Aggiorna Password
            {/if}
        </button>
    </form>

    {#if message}
        <p class:success={isSuccess} class:error={!isSuccess && message !== 'Aggiornamento in corso...'}>
            {message}
        </p>
    {/if}
</div>

<style>
    /* Ho uniformato lo stile al tema dark/contrasto degli altri file */
    .auth-container { 
        max-width: 400px; 
        margin: 80px auto; 
        padding: 40px; 
        text-align: center; 
        background: var(--panel-bg, #2d3748);
        border-radius: 12px;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
    }
    h2 {
        color: var(--text-color-bright, #ffffff);
        margin-bottom: 30px;
    }
    .auth-form { 
        display: flex; 
        flex-direction: column; 
        gap: 20px; 
        margin-top: 20px; 
    }
    .form-group { 
        text-align: left; 
    }
    .form-group label { 
        display: block; 
        margin-bottom: 8px; 
        font-weight: 600; 
        color: var(--text-color, #e2e8f0);
    }
    .form-group input { 
        width: 100%; 
        padding: 12px; 
        border: 1px solid var(--input-border, #4a5568); 
        border-radius: 8px; 
        box-sizing: border-box; 
        background-color: var(--input-bg, #1a202c);
        color: var(--text-color-bright, #ffffff);
        transition: border-color 0.3s;
    }
    .form-group input:focus {
        border-color: var(--accent-color, #4299e1);
        outline: none;
    }
    .auth-button { 
        padding: 12px; 
        background-color: var(--accent-color, #4299e1); 
        color: white; 
        border: none; 
        border-radius: 8px; 
        cursor: pointer; 
        font-size: 1rem; 
        font-weight: bold;
        transition: opacity 0.3s, background-color 0.3s;
        margin-top: 10px;
    }
    .auth-button:hover:not(:disabled) { 
        opacity: 0.9;
    }
    .auth-button:disabled { 
        opacity: 0.5; 
        cursor: not-allowed; 
    }
    .success { 
        color: var(--success-color, #48bb78); 
        font-weight: bold; 
        margin-top: 20px; 
    }
    .error { 
        color: var(--error-color, #f56565); 
        font-weight: bold; 
        margin-top: 20px; 
    }
</style>
