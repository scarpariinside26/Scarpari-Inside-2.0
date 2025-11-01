<script>
    import { fly, fade } from 'svelte/transition'; // Importa anche 'fade'
    
    const mockEvents = [
        // ... (Mantieni i tuoi dati simulati) ...
        { id: 1, name: 'Torneo Settimanale 1', date: '2025-11-05', time: '20:00', location: 'Discord', duration: '2h', participants: 16, status: 'Active' },
        { id: 2, name: 'Mega Evento Finale', date: '2025-11-20', time: '18:30', location: 'Twitch', duration: '4h', participants: 32, status: 'Pending' },
    ];
    
    let isModalOpen = false;
    // Nuove variabili per il Form
    let newEvent = {
        name: '', date: '', time: '', location: '', duration: 120, participants: 16
    };

    function addEvent() {
        if (!newEvent.name || !newEvent.date || !newEvent.time) {
            alert('Per favore, compila tutti i campi obbligatori.');
            return;
        }
        
        // Simulazione: Aggiunge il nuovo evento ai dati simulati
        const newId = Math.max(...mockEvents.map(e => e.id)) + 1;
        mockEvents = [...mockEvents, {
            id: newId, 
            name: newEvent.name, 
            date: newEvent.date, 
            time: newEvent.time, 
            location: newEvent.location || 'N/A', 
            duration: `${newEvent.duration / 60}h`, 
            participants: newEvent.participants, 
            status: 'Pending'
        }];
        
        // Reset e chiusura
        newEvent = { name: '', date: '', time: '', location: '', duration: 120, participants: 16 };
        isModalOpen = false;
    }
</script>

<style>
    /* ... (Mantieni i tuoi stili esistenti per table-responsive, table, th, td, ecc.) ... */
    
    /* Stili per il Modale (CRUCIALE PER LA VISUALIZZAZIONE) */
    .modal-backdrop {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.7);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 2000;
    }
    .modal-content {
        max-width: 600px;
        width: 90%;
        padding: 30px;
        /* Usa la transizione fly per l'ingresso del modale */
    }
    .form-group { margin-bottom: 15px; }
    label { display: block; color: var(--accent-color-glow); margin-bottom: 5px; font-weight: bold; }
    input[type="text"], input[type="date"], input[type="time"], input[type="number"] {
        width: 100%;
        padding: 10px;
        border: 1px solid #4a4a75;
        background-color: #333650;
        color: var(--text-color);
        border-radius: 4px;
        box-sizing: border-box; /* Importante per i layout reattivi */
    }
    .form-actions { display: flex; justify-content: flex-end; gap: 10px; margin-top: 20px; }
    
    @media (max-width: 600px) {
        .modal-content {
            margin: 20px;
        }
    }
</style>

<div class="header">
    <h1 transition:fly={{ y: -50, duration: 500 }}>Gestione Eventi 🗓️</h1>
    <button class="btn-success" on:click={() => isModalOpen = true}>+ Nuovo Evento</button>
</div>

<div class="panel table-responsive" transition:fly={{ y: 50, duration: 500 }}>
    <table>
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
    <div class="modal-backdrop" transition:fade={{ duration: 300 }} on:click={() => isModalOpen = false}>
        <div class="modal-content panel" transition:fly={{ y: 100, duration: 400 }} on:click|stopPropagation>
            <h3>Crea Nuovo Evento</h3>
            
            <form on:submit|preventDefault={addEvent}>
                <div class="form-group">
                    <label for="name">Nome Evento</label>
                    <input type="text" id="name" bind:value={newEvent.name} required />
                </div>
                <div class="form-group">
                    <label for="date">Data</label>
                    <input type="date" id="date" bind:value={newEvent.date} required />
                </div>
                <div class="form-group">
                    <label for="time">Orario</label>
                    <input type="time" id="time" bind:value={newEvent.time} required />
                </div>
                <div class="form-group">
                    <label for="location">Luogo (es. Discord Channel, Twitch)</label>
                    <input type="text" id="location" bind:value={newEvent.location} />
                </div>
                <div class="form-group">
                    <label for="duration">Durata Stimata (minuti)</label>
                    <input type="number" id="duration" bind:value={newEvent.duration} min="30" max="360" />
                </div>
                <div class="form-group">
                    <label for="participants">Numero Max Partecipanti</label>
                    <input type="number" id="participants" bind:value={newEvent.participants} min="2" max="64" />
                </div>

                <div class="form-actions">
                    <button class="btn-danger" on:click={() => isModalOpen = false}>Annulla</button>
                    <button type="submit" class="btn-success">Crea Evento</button>
                </div>
            </form>
        </div>
    </div>
{/if}
