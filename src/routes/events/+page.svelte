<script>
    import { fly } from 'svelte/transition';
    // Dati simulati per gli eventi (come da tua richiesta)
    const mockEvents = [
        { id: 1, name: 'Torneo Settimanale 1', date: '2025-11-05', time: '20:00', location: 'Discord', duration: '2h', participants: 16, status: 'Active' },
        { id: 2, name: 'Mega Evento Finale', date: '2025-11-20', time: '18:30', location: 'Twitch', duration: '4h', participants: 32, status: 'Pending' },
    ];
    let isModalOpen = false;
</script>

<style>
    .header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
    .table-responsive { overflow-x: auto; }
    table { width: 100%; border-collapse: collapse; }
    th, td { padding: 12px 15px; text-align: left; border-bottom: 1px solid #4a4a75; font-size: 0.9em; }
    th { background-color: #33334d; color: var(--accent-color-glow); }
    tr:hover { background-color: #33334d70; }
    .btn-action { margin-right: 5px; padding: 8px 12px; font-size: 0.8em; }
</style>

<div class="header">
    <h1 transition:fly={{ y: -50, duration: 500 }}>Gestione Eventi 🗓️</h1>
    <button class="btn-success" on:click={() => isModalOpen = true}>+ Nuovo Evento</button>
</div>

<div class="panel table-responsive" transition:fly={{ y: 50, duration: 500 }}>
    <table>
        <thead>
            <tr>
                <th>ID</th>
                <th>Nome Evento</th>
                <th>Data/Ora</th>
                <th>Luogo</th>
                <th>Partecipanti</th>
                <th>Stato</th>
                <th>Azioni</th>
            </tr>
        </thead>
        <tbody>
            {#each mockEvents as event}
                <tr>
                    <td>{event.id}</td>
                    <td>{event.name}</td>
                    <td>{event.date} / {event.time}</td>
                    <td>{event.location}</td>
                    <td>{event.participants}</td>
                    <td><span class="tag" style="background: {event.status === 'Active' ? 'var(--success-color)' : 'var(--warning-color)'}">{event.status}</span></td>
                    <td>
                        <button class="btn-action">Modifica</button>
                        <button class="btn-action btn-danger">Elimina</button>
                    </td>
                </tr>
            {/each}
        </tbody>
    </table>
</div>

{#if isModalOpen}
    <div class="modal">
        <div class="modal-content panel">
            <h3>Crea/Modifica Evento</h3>
            <p>Qui andrebbe il form con i campi: Data, Ora, Luogo, Durata, Partecipanti (come tabelle Supabase).</p>
            <button class="btn-danger" on:click={() => isModalOpen = false}>Chiudi</button>
        </div>
    </div>
{/if}
