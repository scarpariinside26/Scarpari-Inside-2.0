<script>
    import { goto } from '$app/navigation';
    import { getContext } from 'svelte';
    import { quartOut } from 'svelte/easing';
    import { fly } from 'svelte/transition';

    // Inizializzazione del client Supabase al top-level (corretto)
    let supabase;
    let errorContext = false;
    
    try {
        supabase = getContext('supabase');
    } catch (e) {
        errorContext = true;
        console.error("ERRORE: Impossibile trovare 'supabase' nel contesto. Assicurati che +layout.svelte e +layout.js siano configurati.");
    }

    let email = '';
    let password = '';
    let errorMessage = '';
    let successMessage = '';
    let loading = false;
    let showReset = false; // Nuovo stato per mostrare il link di reset

    /** Gestisce il login standard con email e password */
    async function handleLogin() {
        if (!supabase) {
            errorMessage = "Errore di sistema: client di autenticazione non disponibile.";
            return;
        }

        errorMessage = '';
        successMessage = '';
        loading = true;

        const { error } = await supabase.auth.signInWithPassword({
            email: email,
            password: password,
        });

        loading = false;
        
        if (error) {
            errorMessage = error.message;
            // Se c'è un errore, mostriamo l'opzione per il reset della password
            showReset = true; 
        } else {
            // Successo: reindirizza
            await goto('/', { replaceState: true });
        }
    }

    /** Gestisce il login tramite Google */
    async function handleGoogleLogin() {
        if (!supabase) {
            errorMessage = "Errore di sistema: client di autenticazione non disponibile.";
            return;
        }

        errorMessage = '';
        successMessage = '';
        loading = true;

        const { error } = await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                // IMPORTANT: Modifica l'URL di reindirizzamento se necessario per la tua app
                redirectTo: `${window.location.origin}/auth/callback` 
            }
        });

        loading = false;

        if (error) {
            errorMessage = error.message;
        }
    }

    /** Gestisce la richiesta di reset della password */
    async function handleForgotPassword() {
        if (!supabase) {
            errorMessage = "Errore di sistema: client di autenticazione non disponibile.";
            return;
        }

        // Deve essere fornita una email valida per il reset
        if (!email) {
            errorMessage = "Inserisci la tua email per richiedere il reset della password.";
            return;
        }

        loading = true;
        errorMessage = '';
        successMessage = '';

        // Invia l'email per il reset
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
            // IMPORTANT: Modifica l'URL dove l'utente verrà reindirizzato per impostare la nuova password
            redirectTo: `${window.location.origin}/auth/update-password` 
        });

        loading = false;

        if (error) {
            errorMessage = error.message;
        } else {
            successMessage = `Link di reset inviato a ${email}. Controlla la tua casella di posta!`;
            showReset = false; // Nascondi il link dopo l'invio
        }
    }
</script>

<!-- LAYOUT PRINCIPALE -->
<div class="login-container" in:fly={{ y: -50, duration: 500, easing: quartOut }}>
    <div class="login-card">
        <h1>Accedi</h1>

        {#if errorContext}
             <p class="error-message">⚠️ Errore di inizializzazione. Controlla la console per i dettagli.</p>
        {/if}

        <!-- FORM DI LOGIN (EMAIL/PASSWORD) -->
        <form on:submit|preventDefault={handleLogin}>
            <div class="form-group">
                <label for="email">Email</label>
                <input type="email" id="email" bind:value={email} required disabled={loading}>
            </div>

            <div class="form-group">
                <label for="password">Password</label>
                <input type="password" id="password" bind:value={password} required disabled={loading}>
            </div>

            <!-- MESSAGGI DI STATO -->
            {#if errorMessage}
                <p class="error-message">{errorMessage}</p>
            {/if}

            {#if successMessage}
                <p class="success-message">{successMessage}</p>
            {/if}

            <!-- PULSANTE DI LOGIN -->
            <button type="submit" class="action-button login-button" disabled={loading}>
                {#if loading}
                    Caricamento...
                {:else}
                    Accedi
                {/if}
            </button>
        </form>
        
        <!-- OPZIONE PASSWORD DIMENTICATA -->
        {#if showReset}
            <div class="reset-link">
                <button on:click={handleForgotPassword} disabled={loading} class="text-button">
                    Password dimenticata?
                </button>
            </div>
        {/if}

        <!-- SEPARATORE E OPZIONI SOCIAL -->
        <div class="separator">
            <span class="line"></span>
            <span>o</span>
            <span class="line"></span>
        </div>

        <button on:click={handleGoogleLogin} disabled={loading} class="action-button google-button">
            <!-- Icona Google (sostituire con icona reale se possibile) -->
            Accedi con Google
        </button>
    </div>
</div>

<style>
    /* Variabili CSS (Assumi che siano definite altrove o usale come fallback) */
    :root {
        --bg-color: #f7f9fb;
        --card-bg: #ffffff;
        --text-color: #333;
        --accent-color: #007bff;
        --error-color: #e74c3c;
        --success-color: #2ecc71;
        --google-color: #4285f4;
        --input-border: #ccc;
    }

    .login-container {
        display: flex;
        justify-content: center;
        align-items: center;
        min-height: 100vh;
        background-color: var(--bg-color);
        padding: 20px;
    }

    .login-card {
        background-color: var(--card-bg);
        padding: 30px;
        border-radius: 15px;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
        width: 100%;
        max-width: 400px;
        color: var(--text-color);
    }

    h1 {
        text-align: center;
        color: var(--accent-color);
        margin-bottom: 25px;
        font-size: 2rem;
    }

    .form-group {
        margin-bottom: 20px;
    }

    label {
        display: block;
        margin-bottom: 8px;
        font-weight: 600;
    }

    input[type="email"], input[type="password"] {
        width: 100%;
        padding: 12px;
        border: 1px solid var(--input-border);
        border-radius: 8px;
        box-sizing: border-box;
        transition: border-color 0.3s;
    }

    input[type="email"]:focus, input[type="password"]:focus {
        border-color: var(--accent-color);
        outline: none;
    }

    .action-button {
        width: 100%;
        padding: 14px;
        border: none;
        border-radius: 8px;
        font-size: 1rem;
        font-weight: 700;
        cursor: pointer;
        transition: background-color 0.3s, opacity 0.3s;
        margin-top: 10px;
    }

    .action-button:disabled {
        opacity: 0.6;
        cursor: not-allowed;
    }

    .login-button {
        background-color: var(--accent-color);
        color: white;
    }

    .login-button:not(:disabled):hover {
        background-color: #0056b3;
    }

    .google-button {
        background-color: var(--google-color);
        color: white;
    }

    .google-button:not(:disabled):hover {
        background-color: #3367d6;
    }

    .error-message {
        color: var(--error-color);
        background-color: #fcebeb;
        padding: 10px;
        border-radius: 8px;
        margin-top: 15px;
        text-align: center;
        font-weight: 500;
    }

    .success-message {
        color: var(--success-color);
        background-color: #e6fff1;
        padding: 10px;
        border-radius: 8px;
        margin-top: 15px;
        text-align: center;
        font-weight: 500;
    }

    .separator {
        display: flex;
        align-items: center;
        text-align: center;
        margin: 25px 0;
        color: #888;
    }

    .line {
        flex-grow: 1;
        border-top: 1px solid #ddd;
    }

    .separator span {
        padding: 0 15px;
        font-size: 0.9rem;
    }
    
    .reset-link {
        text-align: right;
        margin-top: 10px;
    }
    
    .text-button {
        background: none;
        border: none;
        color: var(--accent-color);
        text-decoration: underline;
        cursor: pointer;
        font-size: 0.9rem;
        padding: 0;
        transition: color 0.2s;
    }
    
    .text-button:hover:not(:disabled) {
        color: #0056b3;
    }
</style>
