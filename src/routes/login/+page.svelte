<script>
    import { goto } from '$app/navigation';
    import { getContext, onMount } from 'svelte'; // <-- AGGIUNGI onMount
    import { quartOut } from 'svelte/easing';
    import { fly } from 'svelte/transition';

    // DICHIARA LA VARIABILE MA NON ASSEGNARE IL VALORE QUI
    let supabase; 

    // Esegui getContext solo quando il componente è montato
    onMount(() => {
        // ASSEGNA IL VALORE SOLO DOPO CHE IL LAYOUT HA ESEGUITO setContext
        supabase = getContext('supabase'); 
        
        // *DEBUG* Se ancora fallisce, vedrai questo errore:
        if (!supabase) {
             console.error("ERRORE: Supabase non trovato nel contesto dopo il mount.");
        }
    });

    let email = '';
    let password = '';
    let errorMessage = '';
    let loading = false;

    // Gestisce il submit del form (Email/Password)
    async function handleLogin() {
        // AGGIUNGI CONTROLLO DI SICUREZZA
        if (!supabase) {
            errorMessage = "Errore di sistema: client di autenticazione non disponibile.";
            return;
        }

        errorMessage = '';
        loading = true;

        const { error } = await supabase.auth.signInWithPassword({
            email: email,
            password: password,
        });

        loading = false;
        
        // ... (il resto della logica rimane invariato)

        if (error) {
            errorMessage = error.message;
        } else {
            await goto('/', { replaceState: true });
        }
    }

    // Gestisce il login tramite Google
    async function handleGoogleLogin() {
         // AGGIUNGI CONTROLLO DI SICUREZZA
        if (!supabase) {
            errorMessage = "Errore di sistema: client di autenticazione non disponibile.";
            return;
        }

        errorMessage = '';
        loading = true;

        // ... (il resto della logica rimane invariato)
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

</script>
