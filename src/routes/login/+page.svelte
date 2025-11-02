<script>
    import { Auth } from '@supabase/auth-ui-svelte';
    import { ThemeSupa } from '@supabase/auth-ui-shared';
    import { page } from '$app/stores';
    import { getContext } from 'svelte';
    
    // Ottieni il client Supabase dal contesto (impostato in hooks.server.js)
    const supabase = getContext('supabase');

    // URL della pagina a cui reindirizzare dopo l'accesso
    const redirectTo = `${$page.url.origin}/`; 
</script>

<style>
    .login-container {
        max-width: 400px;
        margin: 50px auto;
        padding: 20px;
        text-align: center;
        /* Adatta gli stili al tuo tema scuro */
        background: var(--panel-bg, #1e1e1e); 
        border-radius: 12px;
        box-shadow: 0 4px 10px rgba(0, 0, 0, 0.5);
        color: var(--text-color, #ffffff);
    }
    h2 {
        color: var(--accent-color, #ffdc00);
        margin-bottom: 25px;
        font-weight: 800;
    }
    /* Stili per il pulsante di Logout (se l'utente è già loggato) */
    .logout-form {
        margin-top: 30px;
    }
    .logout-button {
        padding: 12px 20px;
        background: var(--error-color, #ff4136);
        color: white;
        border: none;
        border-radius: 8px;
        font-weight: 700;
        cursor: pointer;
        transition: background 0.2s;
        width: 100%;
        max-width: 200px;
    }
</style>

<div class="login-container">
    <h2>Accesso Scarpa Inside</h2>

    {#if $page.data.session}
        <p>Sei loggato come **{$page.data.session.user.email}**.</p>
        
        <form method="POST" action="?/logout" class="logout-form">
            <button type="submit" class="logout-button">
                Logout
            </button>
        </form>
    {:else}
        <Auth
            {supabase}
            appearance={{ theme: ThemeSupa }}
            view="sign_in"
            showLinks={true}
            redirectTo={redirectTo}
            providers={[]} 
            socialLayout="horizontal"
            theme="dark"
            
            // Personalizza le etichette per l'italiano
            i18n={{
                en: {
                    sign_in_title: 'Accedi al tuo Profilo',
                    email_label: 'Indirizzo Email',
                    password_label: 'Password',
                    email_input_placeholder: 'La tua email',
                    password_input_placeholder: 'La tua password',
                    forgotten_password: 'Password dimenticata?',
                    sign_in_button_label: 'Accedi',
                    no_account: 'Non hai un account?',
                    sign_up: 'Registrati',
                    // Aggiungi qui le altre traduzioni se necessario
                }
            }}
        />
    {/if}
</div>
