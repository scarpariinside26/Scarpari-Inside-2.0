<script>
    import { getContext, onMount } from 'svelte';
    import { goto } from '$app/navigation';
    
    // --- Dichiarazione ---
    // 1. Dichiara la variabile senza assegnare subito
    let supabase; 
    let password = '';
    let confirmPassword = '';
    let message = '';
    let isSuccess = false;

    // --- Inizializzazione ---
    // 2. Assegna all'interno di onMount
    onMount(() => {
        // Questa chiamata è sicura solo all'interno di onMount
        supabase = getContext('supabase'); 
        
        if (!supabase) {
            console.error("Supabase client non trovato nel contesto.");
            message = "Errore di sistema: client non disponibile.";
        }
    });

    // --- Logica ---
    async function updatePassword() {
        // Aggiungi un controllo di sicurezza per Supabase
        if (!supabase) {
            message = "Attendere il caricamento del sistema.";
            return;
        }

        if (password !== confirmPassword) {
            message = 'Le password non corrispondono.';
            return;
        }
        if (password.length < 6) {
            message = 'La password deve contenere almeno 6 caratteri.';
            return;
        }

        message = 'Aggiornamento in corso...';
        
        // Supabase riconosce automaticamente la sessione temporanea in base all'URL.
        const { error } = await supabase.auth.updateUser({ password });

        if (error) {
            console.error('Errore durante l\'aggiornamento:', error);
            message = `Errore di aggiornamento: ${error.message}`;
            isSuccess = false;
        } else {
            message = 'Password aggiornata con successo! Reindirizzamento...';
            isSuccess = true;
            // Dopo il successo, reindirizza l'utente alla dashboard
            setTimeout(() => {
                goto('/app');
            }, 2000);
        }
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
            />
        </div>

        <div class="form-group">
            <label for="confirmPassword">Conferma Password</label>
            <input 
                id="confirmPassword" 
                type="password" 
                bind:value={confirmPassword} 
                required 
            />
        </div>
        
        <button type="submit" class="auth-button" disabled={!supabase}>
            {#if !supabase}
                Caricamento...
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
    .auth-container { max-width: 400px; margin: 40px auto; padding: 20px; text-align: center; }
    .auth-form { display: flex; flex-direction: column; gap: 15px; margin-top: 20px; }
    .form-group { text-align: left; }
    .form-group label { display: block; margin-bottom: 5px; font-weight: bold; }
    .form-group input { width: 100%; padding: 10px; border: 1px solid #ccc; border-radius: 4px; box-sizing: border-box; }
    .auth-button { padding: 10px; background-color: #007bff; color: white; border: none; border-radius: 4px; cursor: pointer; font-size: 1rem; transition: background-color 0.3s; }
    .auth-button:hover:not(:disabled) { background-color: #0056b3; }
    .auth-button:disabled { background-color: #ccc; cursor: not-allowed; }
    .success { color: green; font-weight: bold; margin-top: 15px; }
    .error { color: red; font-weight: bold; margin-top: 15px; }
</style>
