<script>
    import { goto } from '$app/navigation';
    import { getContext, onMount } from 'svelte';
    import { quartOut } from 'svelte/easing';
    import { fly } from 'svelte/transition';

    let supabase;

    // CRUCIALE: Assicurati che supabase sia caricato solo dopo il montaggio
    onMount(() => {
        supabase = getContext('supabase');
        if (!supabase) {
             console.error("ERRORE: Supabase non trovato nel contesto.");
         }
    });

    let email = '';
    let password = '';
    let errorMessage = '';
    let loading = false;

    async function handleLogin() {
        if (!supabase) {
            errorMessage = 'Errore di sistema. Ricarica la pagina.';
            return;
        }

        errorMessage = '';
        loading = true;

        // Esegui il login con email e password
        const { error } = await supabase.auth.signInWithPassword({
            email: email,
            password: password,
        });

        loading = false;

        if (error) {
            // Se l'errore è dovuto a credenziali sbagliate o utente non confermato
            errorMessage = "Credenziali non valide o utente non confermato. Riprova.";
            console.error(error.message); // Logga l'errore specifico per debug
            return;
        }
        
        // Successo: Supabase imposta la sessione.
        // Reindirizziamo l'utente alla sua dashboard privata.
        goto('/app');
    }
    
    // Funzione per il login con Google
    async function signInWithGoogle() {
        if (!supabase) {
            errorMessage = 'Errore di sistema. Ricarica la pagina.';
            return;
        }
        
        loading = true;
        
        const { error } = await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                redirectTo: `${window.location.origin}/auth/callback`, // Importante per SvelteKit
            },
        });
        
        if (error) {
             errorMessage = error.message;
        }
        loading = false;
        // La chiamata OAuth reindirizzerà l'utente, non c'è bisogno di un goto manuale qui.
    }

</script>

<div class="login-container" transition:fly={{ y: 50, duration: 400, easing: quartOut }}>
    <div class="login-panel">
        <h1>Accedi</h1>

        <!-- Form di Login Email/Password -->
        <form on:submit|preventDefault={handleLogin}>
            <div class="form-group">
                <label for="email">Email</label>
                <input type="email" id="email" bind:value={email} required disabled={loading} />
            </div>
            
            <div class="form-group">
                <label for="password">Password</label>
                <input type="password" id="password" bind:value={password} required disabled={loading} minlength="6" />
            </div>

            {#if errorMessage}
                <p class="error">{errorMessage}</p>
            {/if}

            <button type="submit" class="login-button" disabled={loading}>
                {#if loading}
                    Accesso in corso...
                {:else}
                    Accedi
                {/if}
            </button>
        </form>
        
        <div class="separator">O continua con</div>
        
        <!-- Bottone Google Login -->
        <button on:click={signInWithGoogle} class="google-button" disabled={loading}>
            <svg class="google-icon" viewBox="0 0 512 512" width="20" height="20">
                <path fill="#4285F4" d="M386 400c45-35 65-74 65-108 0-77-78-140-153-140s-153 63-153 140c0 34 20 73 65 108l-15 13 15-13c-45 35-65 74-65 108 0 77 78 140 153 140s153-63 153-140c0-34-20-73-65-108l15-13-15 13z"/>
                <path fill="#34A853" d="M194 340a120 120 0 1 0 0-240 120 120 0 0 0 0 240z"/>
                <path fill="#FBBC05" d="M256 186c-39 0-71 31-71 70s32 70 71 70 71-31 71-70-32-70-71-70z"/>
                <path fill="#EA4335" d="M186 256c0-39 32-70 71-70s71 31 71 70-32 70-71 70-71-31-71-70z"/>
            </svg>
            Accedi con Google
        </button>

        <p class="help-links">
            <a href="/forgot-password">Password dimenticata?</a> | <a href="/signup">Crea un account</a>
        </p>
    </div>
</div>

<style>
    /* Definisci delle variabili di colore di base per un look moderno e scuro */
    :root {
        --panel-bg: #2d3748; /* Grigio-blu scuro */
        --accent-color: #66b3ff; /* Blu brillante per accenti */
        --text-color: #e2e8f0; /* Testo chiaro */
        --text-color-bright: #ffffff; /* Testo molto chiaro */
        --input-bg: #1a202c; /* Sfondo input molto scuro */
        --input-border: #4a5568; /* Bordo input grigio scuro */
        --error-color: #f56565; /* Rosso per errori */
    }

    .login-container {
        display: flex;
        justify-content: center;
        align-items: center;
        min-height: 100vh;
        padding: 20px;
        background-color: #1a202c; /* Sfondo generale scuro */
        color: var(--text-color);
    }
    .login-panel {
        background: var(--panel-bg);
        padding: 40px;
        border-radius: 12px;
        box-shadow: 0 8px 30px rgba(0, 0, 0, 0.5);
        max-width: 400px;
        width: 100%;
        text-align: center;
    }
    h1 {
        color: var(--text-color-bright);
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
        transition: border-color 0.2s;
    }
    input:focus {
        border-color: var(--accent-color);
        outline: none;
    }
    
    .login-button, .google-button {
        width: 100%;
        padding: 12px;
        border: none;
        border-radius: 8px;
        font-weight: 700;
        font-size: 1rem;
        cursor: pointer;
        margin-top: 15px;
        transition: transform 0.1s, background-color 0.2s;
    }
    
    .login-button {
        background: var(--accent-color);
        color: #1a202c;
    }
    .login-button:hover:not(:disabled) {
        background: #4a90e2; 
    }

    .google-button {
        background: #ffffff;
        color: #1a202c;
        display: flex;
        align-items: center;
        justify-content: center;
        margin-top: 10px;
        border: 1px solid #ddd;
    }
    .google-icon {
        margin-right: 10px;
    }
    .google-button:hover:not(:disabled) {
        background: #f0f0f0;
    }
    
    .login-button:disabled, .google-button:disabled {
        opacity: 0.6;
        cursor: not-allowed;
    }
    
    .error {
        color: var(--error-color);
        margin-bottom: 15px;
    }
    
    .help-links {
        margin-top: 25px;
        font-size: 0.9rem;
    }
    .help-links a {
        color: var(--accent-color);
        text-decoration: none;
    }
    
    .separator {
        display: flex;
        align-items: center;
        text-align: center;
        margin: 20px 0;
        color: var(--text-color);
        font-size: 0.85rem;
    }

    .separator::before,
    .separator::after {
        content: '';
        flex: 1;
        border-bottom: 1px solid var(--input-border);
    }

    .separator:not(:empty)::before {
        margin-right: .5em;
    }

    .separator:not(:empty)::after {
        margin-left: .5em;
    }
</style>
