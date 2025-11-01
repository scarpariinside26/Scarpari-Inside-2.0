<script>
    import { fly } from 'svelte/transition';

    let mockPayments = [
        { id: 1, name: 'Player Alfa', amount: 15.00, paid: true, method: 'Digitale', late: false, yellowCard: false },
        { id: 2, name: 'Player Beta', amount: 15.00, paid: false, method: 'Contanti', late: false, yellowCard: false },
        { id: 3, name: 'Player Gamma', amount: 15.00, paid: true, method: 'Contanti', late: true, yellowCard: false },
        { id: 4, name: 'Player Delta', amount: 15.00, paid: false, method: 'Digitale', late: false, yellowCard: true },
    ];
    
    let filterMethod = 'all'; // 'all', 'digitale', 'contanti'
    let filterStatus = 'all'; // 'all', 'paid', 'unpaid'
    
    // Filtra la lista dei pagamenti
    $: filteredPayments = mockPayments.filter(p => {
        // 🚀 CORREZIONE: Applichiamo toLowerCase() anche al metodo del pagamento (p.method)
        const methodMatch = filterMethod === 'all' || p.method.toLowerCase() === filterMethod;
        const statusMatch = filterStatus === 'all' || (filterStatus === 'paid' ? p.paid : !p.paid);
        return methodMatch && statusMatch;
    });

    // Toggle per lo stato di pagamento, ritardo e cartellino giallo
    function togglePayment(paymentId) {
        mockPayments = mockPayments.map(p => 
            p.id === paymentId ? { ...p, paid: !p.paid } : p
        );
    }
    function toggleLate(paymentId) {
        mockPayments = mockPayments.map(p => 
            p.id === paymentId ? { ...p, late: !p.late } : p
        );
    }
    function toggleYellowCard(paymentId) {
        mockPayments = mockPayments.map(p => 
            p.id === paymentId ? { ...p, yellowCard: !p.yellowCard } : p
        );
    }

    function getStatusClass(paid) {
        return paid ? 'status-paid' : 'status-unpaid';
    }
</script>

<style>
    /* ... (Stili CSS mantenuti) ... */
    .controls-bar {
        display: flex;
        flex-wrap: wrap;
        gap: 15px;
        margin-bottom: 25px;
    }
    
    /* Stili per l'interruttore (Toggle) */
    .toggle-group {
        display: flex;
        border-radius: 4px;
        overflow: hidden;
        border: 1px solid var(--accent-color);
        flex-grow: 1; 
        min-width: 250px;
    }
    .toggle-group button {
        background: var(--input-bg);
        color: var(--text-color);
        border: none;
        padding: 10px 15px;
        flex-grow: 1;
        transition: background-color 0.2s, color 0.2s;
    }
    .toggle-group button.active {
        background: var(--accent-color);
        color: var(--text-color-bright);
        font-weight: bold;
    }

    /* Stili Tabella e Pulsanti */
    .payment-table {
        width: 100%;
        border-collapse: separate;
        border-spacing: 0;
    }
    .payment-table th, .payment-table td {
        padding: 12px 10px;
        text-align: left;
        border-bottom: 1px solid #4a4a75;
    }
    .payment-table th {
        color: var(--accent-color-glow);
        font-weight: bold;
    }
    .payment-table tr:hover {
        background-color: #2b2e45; 
    }
    .status-paid { color: var(--success-color); }
    .status-unpaid { color: var(--danger-color); }

    .action-cell {
        display: flex;
        gap: 5px;
    }
    .action-cell button {
        padding: 8px;
        font-size: 0.9em;
    }
    
    /* Stili per i pulsanti ritardo/cartellino giallo */
    .late-badge { background-color: var(--warning-color); }
    .card-badge { background-color: var(--danger-color); }
    .tag-inactive { background-color: #6c757d; }
    
    @media (max-width: 600px) {
        .payment-table thead { display: none; } 
        .payment-table, .payment-table tbody, .payment-table tr, .payment-table td { display: block; width: 100%; }
        .payment-table tr { margin-bottom: 15px; border: 1px solid #4a4a75; border-radius: 8px; }
        .payment-table td { text-align: right; border: none; position: relative; padding-left: 50%; }
        .payment-table td::before {
            content: attr(data-label);
            position: absolute;
            left: 10px;
            width: 45%;
            padding-right: 10px;
            white-space: nowrap;
            font-weight: bold;
            color: var(--accent-color);
            text-align: left;
        }
        .action-cell { justify-content: flex-end; }
    }
</style>

<h1 transition:fly={{ y: -50, duration: 500 }}>Registro Pagamenti 💳</h1>

<div class="panel controls-bar" transition:fly={{ y: 50, duration: 500 }}>
    <div class="toggle-group">
        <button on:click={() => filterMethod = 'all'} class:active={filterMethod === 'all'}>Tutti</button>
        <button on:click={() => filterMethod = 'digitale'} class:active={filterMethod === 'digitale'}>Digitale</button>
        <button on:click={() => filterMethod = 'contanti'} class:active={filterMethod === 'contanti'}>Contanti</button>
    </div>
    
    <div class="toggle-group">
        <button on:click={() => filterStatus = 'all'} class:active={filterStatus === 'all'}>Tutti</button>
        <button on:click={() => filterStatus = 'paid'} class:active={filterStatus === 'paid'}>Pagato</button>
        <button on:click={() => filterStatus = 'unpaid'} class:active={filterStatus === 'unpaid'}>Non Pagato</button>
    </div>
</div>

<div class="panel" transition:fly={{ y: 50, duration: 500 }}>
    <p>Trovati {filteredPayments.length} pagamenti.</p>
    <div class="table-responsive">
        <table class="payment-table">
            <thead>
                <tr>
                    <th>Giocatore</th>
                    <th>Importo</th>
                    <th>Metodo</th>
                    <th>Stato</th>
                    <th>Ritardo</th>
                    <th>Cartellino</th>
                    <th>Azioni</th>
                </tr>
            </thead>
            <tbody>
                {#each filteredPayments as p (p.id)}
                    <tr>
                        <td data-label="Giocatore">{p.name}</td>
                        <td data-label="Importo">{p.amount.toFixed(2)}€</td>
                        <td data-label="Metodo">{p.method}</td>
                        <td data-label="Stato">
                            <span class={getStatusClass(p.paid)}>
                                {p.paid ? 'Pagato' : 'Non Pagato'}
                            </span>
                        </td>
                        <td data-label="Ritardo">
                            <button 
                                class="{p.late ? 'late-badge' : 'tag-inactive'}" 
                                on:click={() => toggleLate(p.id)}
                            >
                                {p.late ? 'Ritardo ⚠️' : 'In Orario'}
                            </button>
                        </td>
                        <td data-label="Cartellino">
                            <button 
                                class="{p.yellowCard ? 'card-badge' : 'tag-inactive'}" 
                                on:click={() => toggleYellowCard(p.id)}
                            >
                                {p.yellowCard ? 'Cartellino 🟨' : 'Nessun Cartellino'}
                            </button>
                        </td>
                        <td data-label="Segna Pagamento">
                            <div class="action-cell">
                                <button 
                                    class="{p.paid ? 'btn-danger' : 'btn-success'}" 
                                    on:click={() => togglePayment(p.id)}
                                >
                                    {p.paid ? 'Annulla' : 'Segna Pagato'}
                                </button>
                            </div>
                        </td>
                    </tr>
                {/each}
            </tbody>
        </table>
    </div>
</div>
