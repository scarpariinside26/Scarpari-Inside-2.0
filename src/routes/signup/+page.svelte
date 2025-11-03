<script>
    import { goto } from '$app/navigation';
    import { getContext } from 'svelte';
    import { quartOut } from 'svelte/easing';
    import { fly } from 'svelte/transition';

    const supabase = getContext('supabase');

    let email = '';
    let password = '';
    // Aggiungi il nuovo campo
    let phone_number = ''; 
    
    let errorMessage = '';
    let successMessage = '';
    let loading = false;

    async function handleSignup() {
        errorMessage = '';
        successMessage = '';
        loading = true;

        // Validazione lato client per il numero di telefono
        if (!phone_number || phone_number.length < 5) {
            errorMessage = 'Il numero di telefono è obbligatorio e deve essere valido.';
            loading = false;
            return;
        }

        // 1. Esegui la registrazione su Supabase (solo email/password)
        const { data, error } = await supabase.auth.signUp({
            email: email,
            password: password,
            options: {
                // Opzionale: puoi usare questa riga per salvare il telefono nel metadata utente (auth.users)
                data: { phone_number: phone_number } 
            }
        });

        if (error) {
            errorMessage = error.message;
            loading = false;
            return;
        }

        // --- Logica per inserire il numero di telefono nella tua tabella ---
        // Se la registrazione ha successo e hai bisogno di inserirlo in 'contatti' o 'profili'
        if (data.user) {
            // L'ID utente è ora disponibile
            const user_id = data.user.id;
            
            // Inserisci nella tabella 'contatti' (Assicurati che la tua tabella esista)
            const { error: insertError } = await supabase
                .from('contatti') // Sostituisci con il nome corretto della tua tabella
                .insert([
                    { user_id: user_id, phone_number: phone_number }
                ]);

            if (insertError) {
                // Nota: In caso di errore qui, l'utente è registrato, ma i contatti no.
                console.error("Errore nell'inserimento dei contatti:", insertError);
            }
        }
        // ------------------------------------------------------------------

        successMessage = 'Registrazione quasi completata! Controlla la tua email per il link di conferma.';
        loading = false;
        
        setTimeout(() => {
             goto('/login');
        }, 3000);
    }
</script>

<div class="signup-container" transition:fly={{ y: 50, duration: 400, easing: quartOut }}>
    <div class="signup-panel">
        <h1>Registrati</h1>

        <form on:submit|preventDefault={handleSignup}>
            <div class="form-group">
                <label for="email">Email</label>
                <input type="email" id="email" bind:value={email} required disabled={loading} />
            </div>
            
            <div class="form-group">
                <label for="password">Password</label>
                <input type="password" id="password" bind:value={password} required disabled={loading} minlength="6" />
            </div>
            
            <div class="form-group">
                <label for="phone">Numero di Telefono **(Obbligatorio)**</label>
                <input type="tel" id="phone" bind:value={phone_number} required disabled={loading} />
            </div>
            {#if errorMessage}
                <p class="error">{errorMessage}</p>
            {/if}
            
            {#if successMessage}
                <p class="success">{successMessage}</p>
            {/if}

            <button type="submit" class="signup-button" disabled={loading}>
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
    /* ... I tuoi stili esistenti ... */
</style>
