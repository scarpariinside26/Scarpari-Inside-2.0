<script>
    import { setContext } from 'svelte';
    import '$lib/styles/app.css';
    
    // ... (il tuo codice è qui e va bene)
    export let data;

    // INIEZIONE CRUCIALE: Rendi l'istanza Supabase e la sessione disponibili
    setContext('supabase', data.supabase);
    setContext('session', data.session); 
    
</script>
<style>...</style>
<slot />
