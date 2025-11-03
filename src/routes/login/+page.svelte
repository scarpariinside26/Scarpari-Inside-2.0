<script>
    import { goto } from '$app/navigation';
    import { getContext } from 'svelte'; // onMount non è più necessario qui
    import { quartOut } from 'svelte/easing';
    import { fly } from 'svelte/transition';

    // DICHIARAZIONE E ASSEGNAZIONE
    // getContext DEVE essere chiamato durante l'inizializzazione del componente.
    let supabase; 
    try {
        supabase = getContext('supabase'); 
    } catch (e) {
        // Cattura l'errore se getContext non può essere chiamato (es. non c'è setContext in un genitore)
        console.error("ATTENZIONE: Fallimento nell'inizializzazione di 'supabase' dal contesto.", e.message);
        // La variabile supabase rimane undefined o null, che verrà gestito dal controllo nel markup.
    }
    
    // DEBUG: Se supabase è nullo dopo l'inizializzazione, questo log viene eseguito subito.
    if (!supabase) {
         console.warn("WARN: Il client Supabase non è stato trovato o inizializzato.");
    }

    let email = '';
    let password = '';
    let errorMessage = '';
    let loading = false;

    // Gestisce il submit del form (Email/Password)
    async function handleLogin() {
        // PRIMO CONTROLLO: Se supabase non è ancora definito, ferma l'esecuzione.
        if (!supabase) {
            errorMessage = "Errore di sistema: servizio di autenticazione non ancora disponibile.";
            return;
        }

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
            await goto('/', { replaceState: true });
        }
    }

    // Gestisce il login tramite Google
    async function handleGoogleLogin() {
        // PRIMO CONTROLLO: Se supabase non è ancora definito, ferma l'esecuzione.
        if (!supabase) {
            errorMessage = "Errore di sistema: servizio di autenticazione non ancora disponibile.";
            return;
        }

        errorMessage = '';
        loading = true;

        const { error } = await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                redirectTo: `${window.location.origin}/auth/callback`
            }
        });

        loading = false;

        if (error) {
            errorMessage = error.message;
        }
    }

    function handleForgotPassword() {
        goto('/forgot-password');
    }
</script>

<div class="login-container" transition:fly={{ y: 50, duration: 400, easing: quartOut }}>
    <div class="login-panel">
        <h1>Accedi</h1>

        <!-- Disabilita il pulsante se supabase non è ancora pronto -->
        <button on:click={handleGoogleLogin} class="social-login-button google-button" disabled={loading || !supabase}>
            {#if loading}
                Caricamento...
            {:else}
                <svg viewBox="0 0 48 48" class="google-icon"><path fill="#FFC107" d="M43.61 20.08c0-.68-.06-1.35-.18-2.01H24v3.8h11.75c-.52 2.15-1.97 3.99-4.21 5.25v3.31h4.29c2.51-2.3 4.07-5.74 4.07-9.75z"/><path fill="#FF3D00" d="M24 44c5.29 0 9.77-1.76 13.03-4.78l-4.29-3.31c-2.37 1.58-5.4 2.51-8.74 2.51-6.66 0-12.33-4.48-14.33-10.43H5.3v3.31C8.82 39.46 15.93 44 24 44z"/><path fill="#4CAF50" d="M9.67 24c-.21-1.04-.33-2.12-.33-3.23s.12-2.19.33-3.23V14.23H5.3C4.54 16.53 4 19.16 4 21.99s.54 5.46 1.3 7.76l4.37-3.31z"/><path fill="#1976D2" d="M24 8c3.55 0 6.78 1.22 9.32 3.59l3.73-3.6C33.77 4.56 29.29 4 24 4c-8.07 0-15.18 4.54-18.7 11.23l4.37 3.31C11.67 12.48 17.34 8 24 8z"/></svg>
                Accedi con Google
            {/if}
        </button>

        <div class="divider">o</div>

        <form on:submit|preventDefault={handleLogin}>
            <div class="form-group">
                <label for="email">Email</label>
                <input type="email" id="email" bind:value={email} required disabled={loading || !supabase} />
            </div>
            
            <div class="form-group">
                <label for="password">Password</label>
                <input type="password" id="password" bind:value={password} required disabled={loading || !supabase} />
            </div>

            {#if errorMessage}
                <p class="error">{errorMessage}</p>
            {/if}
            
            <!-- Disabilita il pulsante se supabase non è ancora pronto -->
            <button type="submit" class="login-button" disabled={loading || !supabase}>
                {#if loading}
                    Accesso in corso...
                {:else}
                    Accedi
                {/if}
            </button>
        </form>
        
        <p class="help-links">
            <a href="/forgot-password" on:click|preventDefault={handleForgotPassword}>Password dimenticata?</a>
        </p>
        <p class="help-links">
            Non hai un account? <a href="/signup">Registrati ora</a>
        </p>
    </div>
</div>

<style>
    /* Stili CSS */
    :root {
        --panel-bg: #2c3e50; /* Blu scuro */
        --accent-color: #3498db; /* Blu vivo */
        --input-bg: #34495e; /* Blu-grigio scuro */
        --input-border: #4d6175;
        --text-color: #ecf0f1; /* Bianco-grigio chiaro */
        --text-color-bright: #ffffff;
        --error-color: #e74c3c; /* Rosso */
        --success-color: #2ecc71; /* Verde */
    }

    .login-container {
        display: flex;
        justify-content: center;
        align-items: center;
        min-height: 100vh;
        padding: 20px;
        background-color: #243447; /* Sfondo leggermente più scuro */
    }
    .login-panel {
        background: var(--panel-bg);
        padding: 40px;
        border-radius: 12px;
        box-shadow: 0 8px 30px rgba(0, 0, 0, 0.4);
        max-width: 400px;
        width: 100%;
        text-align: center;
    }
    h1 {
        color: var(--text-color-bright);
        margin-bottom: 30px;
        font-size: 2.2rem;
        font-weight: 700;
    }

    /* Input e Form */
    .form-group {
        text-align: left;
        margin-bottom: 20px;
    }
    label {
        display: block;
        margin-bottom: 8px;
        font-weight: 600;
        color: var(--text-color);
        font-size: 0.95rem;
    }
    input {
        width: 100%;
        padding: 12px;
        border-radius: 8px;
        border: 1px solid var(--input-border);
        background: var(--input-bg);
        color: var(--text-color);
        box-sizing: border-box;
        transition: border-color 0.3s;
    }
    input:focus {
        border-color: var(--accent-color);
        outline: none;
    }
    /* Aggiunto il controllo anche alla disabilitazione */
    input:disabled {
        opacity: 0.8;
        cursor: not-allowed;
    }

    /* Pulsanti */
    .login-button {
        width: 100%;
        padding: 12px;
        border: none;
        border-radius: 8px;
        font-weight: 700;
        font-size: 1rem;
        cursor: pointer;
        margin-top: 15px;
        transition: background 0.3s, transform 0.1s;
        background: var(--accent-color);
        color: #fff;
    }
    .login-button:hover:not(:disabled) {
        background: #2980b9;
    }
    .login-button:active:not(:disabled) {
        transform: scale(0.98);
    }
    .login-button:disabled {
        opacity: 0.6;
        cursor: not-allowed;
    }

    /* Pulsante Social Login */
    .social-login-button {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 100%;
        padding: 10px;
        margin-bottom: 20px;
        border: 1px solid var(--input-border);
        border-radius: 8px;
        background-color: #34495e;
        color: var(--text-color-bright);
        font-weight: 600;
        cursor: pointer;
        transition: background-color 0.3s;
    }
    .social-login-button:hover {
        background-color: #405a74;
    }
    .google-icon {
        width: 24px;
        height: 24px;
        margin-right: 10px;
        /* Per rendere l'icona Google visualizzabile in SVG su sfondi scuri */
        background-color: white; 
        border-radius: 50%;
        padding: 2px;
    }

    /* Divider */
    .divider {
        display: flex;
        align-items: center;
        text-align: center;
        color: #7f8c8d;
        margin: 25px 0;
    }
    .divider::before,
    .divider::after {
        content: '';
        flex: 1;
        border-bottom: 1px solid #4d6175;
    }
    .divider:not(:empty)::before {
        margin-right: .5em;
    }
    .divider:not(:empty)::after {
        margin-left: .5em;
    }

    /* Messaggi */
    .error {
        color: var(--error-color);
        margin-bottom: 15px;
        font-size: 0.9rem;
    }
    .help-links {
        margin-top: 15px;
        font-size: 0.9rem;
        color: var(--text-color);
    }
    .help-links a {
        color: var(--accent-color);
        text-decoration: none;
        transition: color 0.2s;
    }
    .help-links a:hover {
        color: #5dade2;
    }
</style>
