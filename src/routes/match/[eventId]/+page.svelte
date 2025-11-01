<script>
    import MatchVoting from '$lib/MatchVoting.svelte';
    import { page } from '$app/stores';
    import { fly } from 'svelte/transition';

    // Dati simulati per il Roster
    const MOCK_ROSTER = [
        { user_id: 'a1b2c3d4-user-1', name: 'Player Alfa', team_name: 'Rossa', status: 'Votato', score: 4.5 },
        { user_id: 'e5f6g7h8-user-2', name: 'Player Beta', team_name: 'Blu', status: 'Non votato', score: 3.8 },
        { user_id: 'i9j0k1l2-user-3', name: 'Player Gamma', team_name: 'Gialla', status: 'Non votato', score: 4.1 },
        { user_id: 'm3n4o5p6-user-4', name: 'Player Delta', team_name: 'Nera', status: 'Votato', score: 4.9 },
    ];
    
    // Stato di test (puoi modificarli per testare diverse UI)
    const eventId = $page.params.eventId;
    const isMatchActive = true;     // Se true, mostra lo slider di voto
    const isMatchOwner = false;    // Se true, mostra i pulsanti Admin
    const hasUserVoted = false;     // Se true, blocca il voto per l'utente
</script>

<svelte:head>
    <title>Dettaglio Match {eventId.slice(0, 8)}</title>
</svelte:head>

<div transition:fly={{ y: 50, duration: 500 }}>
    <MatchVoting 
        {eventId}
        roster={MOCK_ROSTER}
        {isMatchActive}
        {isMatchOwner}
        {hasUserVoted} 
    />
</div>
