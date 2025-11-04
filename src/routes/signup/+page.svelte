<script>
    import { goto } from '$app/navigation';
    import { getContext } from 'svelte';
    import { quartOut } from 'svelte/easing';
    import { fly } from 'svelte/transition';

    // 1. CHIAMATA IMMEDIATA: Otteniamo Supabase dal Layout
    let supabase = getContext('supabase');
    let isSupabaseReady = !!supabase; // Aggiungiamo un flag di sicurezza

    let email = '';
    let password = '';
    let nome_completo = ''; 
    let phone_number = ''; 
    
    let errorMessage = '';
    let successMessage = '';
    let loading = false;

    async function handleSignup() {
        if (!isSupabaseReady) { // Usiamo il flag
            errorMessage = 'Errore di sistema. Ricarica la pagina.';
            return;
        }

        errorMessage = '';
        successMessage = '';
        loading = true;

        // Validazione Lato Client
        if (!nome_completo || nome_completo.length < 3) {
            errorMessage = 'Il Nome Completo è obbligatorio.';
            loading = false;
            return;
        }
        if (!phone_number || phone_number.length < 5) {
            errorMessage = 'Il numero di telefono è obbligatorio e deve essere valido.';
            loading = false;
            return;
        }

        // 1. Esegui la registrazione su auth.users
        const { data, error } = await supabase.auth.signUp({
            email: email,
            password: password,
        });

        if (error) {
            errorMessage = error.message;
            loading = false;
            return;
        }
        
        // 2. Inserimento dei dati in profili_utenti
        if (data.user) {
            const user_id = data.user.id;
            
            // Inserisci i dati obbligatori e quelli forniti
            const { error: profileError } = await supabase
                .from('profili_utenti')
                .insert([
                    { 
                        user_id: user_id, 
                        email: email, 
                        telefono: phone_number,
                        nome_completo: nome_completo, 
                    }
                ]);

            if (profileError) {
                console.error("Errore nell'inserimento del profilo:", profileError);
                // NOTA: Se l'inserimento del profilo fallisce, l'utente è comunque creato in auth.users!
            }
        }
        // ------------------------------------------------------------------

        successMessage = 'Registrazione quasi completata! Controlla la tua email per il link di conferma.';
        loading = false;
        
        // Non reindirizzare subito per dare tempo all'utente di leggere il messaggio
        setTimeout(() => {
             goto('/login');
        }, 5000);
    }
</script>

<div class="signup-container" transition:fly={{ y: 50, duration: 400, easing: quartOut }}>
    <div class="signup-panel">
        <h1>Registrati</h1>

        <form on:submit|preventDefault={handleSignup}>
            <div class="form-group">
                <label for="nome_completo">Nome Completo</label>
                <input type="text" id="nome_completo" bind:value={nome_completo} required disabled={loading || !isSupabaseReady} />
            </div>
            <div class="form-group">
                <label for="email">Email</label>
                <input type="email" id="email" bind:value={email} required disabled={loading || !isSupabaseReady} />
            </div>
            
            <div class="form-group">
                <label for="password">Password</label>
                <input type="password" id="password" bind:value={password} required disabled={loading || !isSupabaseReady} minlength="6" />
            </div>
            
            <div class="form-group">
                <label for="phone">Numero di Telefono</label>
                <input type="tel" id="phone" bind:value={phone_number} required disabled={loading || !isSupabaseReady} />
            </div>

            {#if errorMessage}
                <p class="error">{errorMessage}</p>
            {/if}
            
            {#if successMessage}
                <p class="success">{successMessage}</p>
            {/if}

            <button type="submit" class="signup-button" disabled={loading || !isSupabaseReady}>
                {#if loading}
                    Registrazione in corso...
                {:else}
                    Registrati
                {/if}
            </button>
        </form>
        
        <p class="help-links">
            Hai già un account? <a href="/login">Accedi</a>
        </p>
    </div>
</div>

<style>
    /* Stili CSS */
    .signup-container {
        display: flex;
        justify-content: center;
        align-items: center;
        min-height: 100vh;
        padding: 20px;
    }
    .signup-panel {
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
    .signup-button {
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
        color: white; /* Correzione colore per visibilità */
    }
    .signup-button:disabled {
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
        color: var(--text-color);
    }
    .help-links a {
        color: var(--accent-color);
        text-decoration: none;
    }
</style>
