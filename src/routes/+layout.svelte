<script>
    import { goto } from '$app/navigation';
    import { getContext, onMount } from 'svelte';
    import { quartOut } from 'svelte/easing';
    import { fly } from 'svelte/transition';

    // 1. RECUPERA IL CONTESTO IMMEDIATAMENTE (come da standard Svelte)
    // Questo DEVE avvenire al top-level dello script per funzionare.
    let supabase = getContext('supabase'); 
    
    // 2. Imposta isSupabaseReady in base al successo del recupero
    let isSupabaseReady = !!supabase; 
    
    let email = '';
    let password = '';
    let errorMessage = '';
    let loading = false;

    // L'onMount serve ora SOLO per i side effect, non per recuperare il contesto.
    onMount(() => {
        // Log di controllo: verifica se Supabase è disponibile
        if (!isSupabaseReady) {
            console.error("ERRORE CRITICO: Supabase non è stato iniettato dal layout.");
            errorMessage = 'Errore di configurazione del sistema. Ricarica la pagina.';
        }
    });

    /**
     * Gestisce il login tramite email e password.
     */
    async function handleLogin() {
        if (!isSupabaseReady) { 
            errorMessage = 'Il sistema non è pronto. Ricarica o contatta il supporto.';
            return;
        }
        
        errorMessage = '';
        loading = true;

        const { error } = await supabase.auth.signInWithPassword({
            email,
            password
        });

        if (error) {
            errorMessage = error.message;
        } else {
            goto('/');
        }
        
        loading = false;
    }
    
    /**
     * Gestisce il login tramite Google OAuth.
     */
    async function signInWithGoogle() {
        if (!isSupabaseReady) { 
            errorMessage = 'Il sistema non è pronto. Ricarica o contatta il supporto.';
            return;
        }

        errorMessage = '';
        loading = true;

        const { error } = await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                redirectTo: `${window.location.origin}/auth/callback`,
                skipBrowserRedirect: false, 
            },
        });

        if (error) {
            errorMessage = error.message;
            loading = false;
        }
    }

</script>

<div class="login-container" transition:fly={{ y: 50, duration: 400, easing: quartOut }}>
    <div class="login-panel">
        <h1>Accedi</h1>

        <!-- Form di Login Email/Password -->
        <form on:submit|preventDefault={handleLogin}>
            <div class="form-group">
                <label for="email">Email</label>
                <!-- CONTROLLO: disabilitato se loading OPPURE se Supabase non è pronto -->
                <input type="email" id="email" bind:value={email} required disabled={loading || !isSupabaseReady} />
            </div>
            
            <div class="form-group">
                <label for="password">Password</label>
                <!-- CONTROLLO: disabilitato se loading OPPURE se Supabase non è pronto -->
                <input type="password" id="password" bind:value={password} required disabled={loading || !isSupabaseReady} minlength="6" />
            </div>

            {#if errorMessage}
                <p class="error">{errorMessage}</p>
            {/if}

            <!-- CONTROLLO: disabilitato se loading OPPURE se Supabase non è pronto -->
            <button type="submit" class="login-button" disabled={loading || !isSupabaseReady}> 
                {#if loading}
                    Accesso in corso...
                {:else}
                    Accedi
                {/if}
            </button>
        </form>
        
        <div class="separator">O continua con</div>
        
        <!-- Bottone Google Login -->
        <!-- CONTROLLO: disabilitato se loading OPPURE se Supabase non è pronto -->
        <button on:click={signInWithGoogle} class="google-button" disabled={loading || !isSupabaseReady}> 
            <svg class="google-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="18px"><path fill="#FFC107" d="M43.61,20.08c0-1.79-.15-3.53-.47-5.22H24v9.85h10.94c-.58,2.98-2.28,5.48-4.88,7.18v6.79h8.73C42.86,39.06,44.97,34.2,43.61,20.08z"/><path fill="#FF3D00" d="M24,44c6.73,0,12.33-2.23,16.44-6.04l-8.73-6.79c-2.42,1.62-5.5,2.58-9.04,2.58c-6.91,0-12.79-4.66-14.88-10.91H1V32.91C4.3,39.9,13.43,44,24,44z"/><path fill="#4CAF50" d="M10.12,28.09c-.47-1.3-.73-2.68-.73-4.09s.27-2.79,.73-4.09V12.91H1C.36,15.63,0,18.5,0,21.91s.36,6.28,1,9.37L10.12,28.09z"/><path fill="#1976D2" d="M24,4c5.1,0,9.7,1.82,13.38,5.17l7.7-7.7C37.28,1.48,31.25,0,24,0C13.43,0,4.3,4.1,1,12.91l9.12,7.09C11.21,11.85,17.09,7.19,24,7.19z"/></svg>
            Accedi con Google
        </button>

        <p class="help-links">
            <a href="/forgot-password">Password dimenticata?</a> | 
            <a href="/signup">Crea un account</a>
        </p>
    </div>
</div>

<style>
    /* Stili CSS - Non modificati */
    .login-container {
        display: flex;
        justify-content: center;
        align-items: center;
        min-height: 100vh;
        padding: 20px;
        background-color: var(--background-color, #1a202c);
    }
    .login-panel {
        background: var(--panel-bg, #2d3748);
        padding: 40px;
        border-radius: 12px;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.4);
        max-width: 400px;
        width: 100%;
        text-align: center;
    }
    h1 {
        color: var(--text-color-bright, #ffffff);
        margin-bottom: 25px;
        font-size: 2rem;
    }
    .form-group {
        text-align: left;
        margin-bottom: 20px;
    }
    label {
        display: block;
        margin-bottom: 8px;
        font-weight: 600;
        color: var(--text-color, #e2e8f0);
    }
    input {
        width: 100%;
        padding: 12px;
        border-radius: 8px;
        border: 1px solid var(--input-border, #4a5568);
        background: var(--input-bg, #1a202c);
        color: var(--text-color, #e2e8f0);
        box-sizing: border-box;
    }
    .login-button {
        width: 100%;
        padding: 12px;
        border: none;
        border-radius: 8px;
        font-weight: 700;
        font-size: 1rem;
        cursor: pointer;
        margin-top: 15px;
        transition: background 0.2s, opacity 0.2s;
        background: var(--accent-color, #4299e1);
        color: white;
    }
    .login-button:disabled, .google-button:disabled {
        opacity: 0.5;
        cursor: not-allowed;
    }
    .error {
        color: var(--error-color, #f56565);
        margin-bottom: 15px;
    }
    .separator {
        margin: 25px 0;
        font-size: 0.9rem;
        color: var(--text-color, #a0aec0);
        position: relative;
    }
    .separator::before, .separator::after {
        content: '';
        position: absolute;
        top: 50%;
        width: 40%;
        height: 1px;
        background: var(--input-border, #4a5568);
    }
    .separator::before {
        left: 0;
    }
    .separator::after {
        right: 0;
    }
    .google-button {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 100%;
        padding: 10px;
        border: 1px solid var(--input-border, #4a5568);
        border-radius: 8px;
        font-weight: 600;
        background: var(--input-bg, #1a202c);
        color: var(--text-color, #e2e8f0);
        cursor: pointer;
        transition: background 0.2s;
    }
    .google-button:hover {
        background: var(--input-border, #4a5568);
    }
    .google-icon {
        margin-right: 10px;
        width: 20px;
        height: 20px;
    }
    .help-links {
        margin-top: 30px;
        font-size: 0.9rem;
        color: var(--text-color, #e2e8f0);
    }
    .help-links a {
        color: var(--accent-color, #4299e1);
        text-decoration: none;
        transition: color 0.2s;
    }
    .help-links a:hover {
        color: var(--accent-color-hover, #63b3ed);
    }
</style>
