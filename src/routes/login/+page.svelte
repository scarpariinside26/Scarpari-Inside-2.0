<script>
    import { goto } from '$app/navigation';
    import { getContext } from 'svelte';
    import { quartOut } from 'svelte/easing';
    import { fly } from 'svelte/transition';

    // Ottiene il client Supabase dal contesto (impostato in hooks.client.js)
    const supabase = getContext('supabase');

    let email = '';
    let password = '';
    let errorMessage = '';
    let loading = false;

    // Gestisce il submit del form (Email/Password)
    async function handleLogin() {
        errorMessage = '';
        loading = true;

        const { error } = await supabase.auth.signInWithPassword({
            email: email,
            password: password,
        });

        loading = false;

        if (error) {
            errorMessage = error.message;
        } else {
            // Reindirizza l'utente una volta autenticato
            await goto('/', { replaceState: true });
        }
    }

    // Gestisce il login tramite Google
    async function handleGoogleLogin() {
        errorMessage = '';
        loading = true;

        // Nota: Assicurati che l'URL di callback di Supabase sia configurato correttamente
        const { error } = await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                redirectTo: `${window.location.origin}/auth/callback` // Usa il tuo dominio
            }
        });

        loading = false;

        if (error) {
            errorMessage = error.message;
        }
        // Il reindirizzamento è gestito da Supabase
    }

</script>

<div class="login-container" transition:fly={{ y: 50, duration: 400, easing: quartOut }}>
    <div class="login-panel">
        <h1>Accedi</h1>

        <form on:submit|preventDefault={handleLogin}>
            <div class="form-group">
                <label for="email">Email</label>
                <input type="email" id="email" bind:value={email} required disabled={loading} />
            </div>
            
            <div class="form-group">
                <label for="password">Password</label>
                <input type="password" id="password" bind:value={password} required disabled={loading} />
            </div>

            {#if errorMessage}
                <p class="error">{errorMessage}</p>
            {/if}

            <button type="submit" class="login-button" disabled={loading}>
                {#if loading}
                    Caricamento...
                {:else}
                    Accedi
                {/if}
            </button>
        </form>

        <div class="divider">O</div>
        
        <button on:click={handleGoogleLogin} class="oauth-button" disabled={loading}>
            <img src="/icons/google.svg" alt="Google logo" class="google-icon" />
            Continua con Google
        </button>

        <p class="help-links">
            Non hai un account? <a href="/signup">Registrati</a>
        </p>
    </div>
</div>

<style>
    .login-container {
        display: flex;
        justify-content: center;
        align-items: center;
        min-height: 100vh;
        padding: 20px;
    }
    .login-panel {
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
    }
    .login-button, .oauth-button {
        width: 100%;
        padding: 12px;
        border: none;
        border-radius: 8px;
        font-weight: 700;
        font-size: 1rem;
        cursor: pointer;
        margin-top: 15px;
        transition: background 0.2s;
        display: flex;
        align-items: center;
        justify-content: center;
    }
    .login-button {
        background: var(--accent-color);
        color: black;
    }
    .login-button:disabled {
        opacity: 0.6;
        cursor: not-allowed;
    }
    .oauth-button {
        background: white;
        color: #1f1f1f;
        border: 1px solid #dadce0;
    }
    .google-icon {
        width: 20px;
        height: 20px;
        margin-right: 10px;
    }
    .divider {
        margin: 25px 0;
        color: var(--text-color-muted);
        position: relative;
    }
    .divider::before, .divider::after {
        content: '';
        position: absolute;
        top: 50%;
        width: 40%;
        height: 1px;
        background: var(--input-border);
    }
    .divider::before { left: 0; }
    .divider::after { right: 0; }
    .error {
        color: var(--error-color);
        margin-bottom: 15px;
    }
    .help-links {
        margin-top: 20px;
        font-size: 0.9rem;
        color: var(--text-color);
    }
    .help-links a {
        color: var(--accent-color);
        text-decoration: none;
    }
</style>
