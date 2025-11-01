<script>
    import TopNavBar from '$lib/components/TopNavBar.svelte';
    import { fly } from 'svelte/transition';

    // Dati simulati dei pagamenti
    const payments = [
        { id: 1, date: '25/09/2025', description: 'Quota Mensile Settembre', amount: 25.00, status: 'Pagato' },
        { id: 2, date: '25/10/2025', description: 'Quota Mensile Ottobre', amount: 25.00, status: 'In Attesa' },
        { id: 3, date: '10/11/2025', description: 'Acquisto Maglia Allenamento', amount: 35.00, status: 'Pagato' },
        { id: 4, date: '25/11/2025', description: 'Quota Mensile Novembre', amount: 25.00, status: 'Scaduto' },
    ];

    // Riassunto Finanziario
    const balance = {
        owed: 50.00,
        paidLastMonth: 25.00,
        pending: 25.00,
    };

    function handlePayNow(id) {
        alert(`Azione: Avvia processo di pagamento per ID ${id}`);
        // In un'app reale: Navigazione a Stripe/PayPal
    }

    // Variabile per il filtro (Non implementiamo il filtro completo qui, ma prepariamo l'UI)
    let filterStatus = 'all'; // 'all', 'paid', 'owed'
</script>

<style>
    .app-container {
        max-width: 450px;
        margin: 0 auto;
        min-height: 100vh;
        color: var(--text-color);
        padding: 0 16px;
        padding-bottom: 20px;
    }

    /* Stili Card Riassunto */
    .summary-card {
        background: var(--panel-bg);
        border-radius: 12px;
        padding: 20px;
        margin: 20px 0;
        box-shadow: 0 4px 10px rgba(0, 0, 0, 0.4);
        display: flex;
        justify-content: space-around;
        text-align: center;
        border-top: 4px solid var(--accent-color);
    }

    .summary-item .value {
        font-size: 1.8rem;
        font-weight: 900;
        margin-bottom: 4px;
    }
    .summary-item .label {
        font-size: 0.8rem;
        color: var(--secondary-accent);
    }

    /* Colori Specifici per il Riassunto */
    .value.owed { color: var(--danger-color); }
    .value.paid { color: var(--success-color); }
    .value.pending { color: var(--warning-color); }

    /* Stili Transazioni (Lista) */
    .transaction-list {
        margin-top: 20px;
        display: flex;
        flex-direction: column;
        gap: 10px;
    }

    .transaction-item {
        background: var(--input-bg);
        border-radius: 8px;
        padding: 15px;
        display: grid;
        grid-template-columns: 2fr 1fr 1fr; /* Descrizione, Stato, Importo */
        gap: 10px;
        align-items: center;
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        border-left: 5px solid var(--panel-bg);
    }
    
    .status-badge {
        font-size: 0.75rem;
        padding: 5px 8px;
        border-radius: 12px;
        text-align: center;
        font-weight: 700;
        width: fit-content;
    }

    .status-Pagato {
        background-color: var(--success-color-low);
        color: var(--success-color);
    }
    .status-InAttesa {
        background-color: var(--warning-color-low);
        color: var(--warning-color);
    }
    .status-Scaduto {
        background-color: var(--danger-color-low);
        color: var(--danger-color);
    }
    
    .description {
        font-weight: 600;
        color: var(--text-color-bright);
    }
    .date {
        font-size: 0.8rem;
        color: var(--secondary-accent);
        margin-top: 2px;
    }
    .amount {
        font-weight: 900;
        font-size: 1.1rem;
        text-align: right;
    }
    
    /* Pulsante di Pagamento */
    .pay-button {
        background: var(--accent-color);
        color: black;
        border: none;
        padding: 8px 15px;
        border-radius: 20px;
        font-weight: 700;
        cursor: pointer;
        transition: background-color 0.2s;
        margin-top: 10px;
    }
    .pay-button:hover {
        background: var(--accent-color-glow);
    }

</style>

<svelte:head>
    <title>Scarpa Inside | Pagamenti</title>
</svelte:head>

<div class="app-container">
    <TopNavBar />

    <h1 class="page-title" transition:fly={{ y: -50, duration: 500 }}>
        Dettaglio Finanziario
    </h1>

    <section class="summary-card" transition:fly={{ y: 50, duration: 500, delay: 100 }}>
        <div class="summary-item">
            <div class="value owed" style="color: var(--danger-color);">{balance.owed.toFixed(2)} €</div>
            <div class="label">TOTALE DOVUTO</div>
        </div>
        <div class="summary-item">
            <div class="value paid" style="color: var(--success-color);">{balance.paidLastMonth.toFixed(2)} €</div>
            <div class="label">Ultimo Pagamento</div>
        </div>
        <div class="summary-item">
            <div class="value pending" style="color: var(--warning-color);">{balance.pending.toFixed(2)} €</div>
            <div class="label">In Scadenza</div>
        </div>
    </section>

    <h2 class="section-title">Storico Transazioni</h2>
    
    <div class="transaction-list">
        {#each payments as item (item.id)}
            <div class="transaction-item" 
                 transition:fly={{ x: 50, duration: 500, delay: item.id * 50 }} 
                 style="border-left-color: var(--{item.status === 'Pagato' ? 'success' : item.status === 'Scaduto' ? 'danger' : 'warning'}-color);">
                
                <div>
                    <div class="description">{item.description}</div>
                    <div class="date">{item.date}</div>
                </div>

                <div class="status">
                    <span class="status-badge status-{item.status.replace(/\s/g, '')}">
                        {item.status.toUpperCase()}
                    </span>
                </div>

                <div class="amount">
                    {item.amount.toFixed(2)} €
                    {#if item.status !== 'Pagato'}
                        <button class="pay-button" on:click={() => handlePayNow(item.id)}>
                            Paga Ora
                        </button>
                    {/if}
                </div>
            </div>
        {/each}
    </div>

    </div>
