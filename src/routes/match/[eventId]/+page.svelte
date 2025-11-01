<script>
    import MatchVoting from '$lib/MatchVoting.svelte';
    import { page } from '$app/stores';

    // Roster di test (Simulazione)
    const MOCK_ROSTER = [
        { user_id: 'a1b2c3d4-user-1', name: 'Player Alfa', team_name: 'Rossa' },
        { user_id: 'e5f6g7h8-user-2', name: 'Player Beta', team_name: 'Blu' },
        { user_id: 'i9j0k1l2-user-3', name: 'Player Gamma', team_name: 'Gialla' },
        { user_id: 'm3n4o5p6-user-4', name: 'Player Delta', team_name: 'Nera' },
    ];
    
    // Stato di test
    const eventId = $page.params.eventId;
    const isMatchActive = true; 
    const isMatchOwner = true; 
    
    // Variabile per gestire la transizione iniziale
    let isMounted = false;
</script>

<svelte:head>
    <title>Vota - Match {eventId.slice(0, 8)}</title>
</svelte:head>

<div class="page-transition" class:mounted={isMounted} on:mount={() => isMounted = true}>
    <MatchVoting 
        {eventId}
        roster={MOCK_ROSTER}
        {isMatchActive}
        {isMatchOwner}
        hasUserVoted={false} 
    />
</div>

<style>
    /* Stile per la transizione di entrata della pagina (effetto fade-in) */
    .page-transition {
        opacity: 0;
        transform: translateY(10px);
        transition: opacity 0.5s ease-out, transform 0.5s ease-out;
    }
    .page-transition.mounted {
        opacity: 1;
        transform: translateY(0);
    }
</style>
