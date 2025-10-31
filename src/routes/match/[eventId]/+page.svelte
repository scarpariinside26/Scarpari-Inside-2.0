<script>
    import MatchVoting from '$lib/MatchVoting.svelte';

    // Ottiene i dati dal file +page.server.js
    export let data;
</script>

<div class="match-page">
    {#if data.roster}
        <MatchVoting 
            eventId={data.eventId} 
            roster={data.roster} 
            isMatchOwner={data.isMatchOwner}
        />
    {:else}
        <p>Caricamento...</p>
    {/if}
</div>
