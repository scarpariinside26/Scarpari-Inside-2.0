<script>
    import { fly } from 'svelte/transition';
    let mockPolls = [
        { id: 201, question: 'Preferisci tornei serali o pomeridiani?', totalVotes: 55, active: true, options: [{text: 'Serali', votes: 40}, {text: 'Pomeridiani', votes: 15}] },
        { id: 202, question: 'Voto del pubblico per il Bot API (0-5)', totalVotes: 30, active: false, options: [{text: '5', votes: 15}, {text: '4', votes: 10}, {text: '3', votes: 5}] },
    ];
    let isCreatingPoll = false;
</script>

<style>
    .poll-card { margin-bottom: 20px; }
    .poll-options { margin-top: 10px; }
    .option-bar { display: flex; align-items: center; margin-bottom: 5px; font-size: 0.9em; }
    .bar { height: 10px; background-color: var(--accent-color-glow); border-radius: 5px; transition: width 0.5s; }
    .percentage { margin-left: 10px; font-weight: bold; color: var(--accent-color); }
</style>

<div class="header">
    <h1 transition:fly={{ y: -50, duration: 500 }}>Gestione Sondaggi 📊</h1>
    <button class="btn-success" on:click={() => isCreatingPoll = true}>+ Nuovo Sondaggio</button>
</div>

{#if isCreatingPoll}
    <div class="panel" transition:fly={{ y: 20, duration: 500 }}>
        <h3>Crea Sondaggio</h3>
        <p>Qui andrebbe il form per la domanda e le opzioni.</p>
        <button class="btn-danger" on:click={() => isCreatingPoll = false}>Annulla</button>
    </div>
{/if}

{#each mockPolls as poll (poll.id)}
    <div class="panel poll-card" transition:fly={{ y: 20, duration: 500 }}>
        <h2>{poll.question}</h2>
        <p style="color: {poll.active ? 'var(--success-color)' : 'var(--danger-color)'};">Stato: {poll.active ? 'Attivo' : 'Chiuso'} | Voti Totali: {poll.totalVotes}</p>
        
        <div class="poll-options">
            {#each poll.options as option}
                {@const percentage = poll.totalVotes > 0 ? (option.votes / poll.totalVotes) * 100 : 0}
                <div class="option-bar">
                    <span style="width: 150px;">{option.text}</span>
                    <div style="flex-grow: 1; margin: 0 10px;">
                        <div class="bar" style="width: {percentage}%;"></div>
                    </div>
                    <span class="percentage">{percentage.toFixed(0)}% ({option.votes})</span>
                </div>
            {/each}
        </div>
    </div>
{/each}
