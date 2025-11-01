<script>
    import { fly } from 'svelte/transition';
    import TopNavBar from '$lib/components/TopNavBar.svelte';
    import BottomNavBar from '$lib/components/BottomNavBar.svelte';
    
    let mockPayments = [
        // Dati simulati...
        { id: 1, name: 'Player Alfa', amount: 15.00, paid: true, method: 'Digitale', late: false, yellowCard: false },
        // ...
    ];
    // (Mantieni tutta la logica di script e le funzioni toggle come prima)
    // ...
    
    let filterMethod = 'all'; // 'all', 'digitale', 'contanti'
    let filterStatus = 'all'; // 'all', 'paid', 'unpaid'
    
    // Filtra la lista dei pagamenti
    $: filteredPayments = mockPayments.filter(p => {
        const methodMatch = filterMethod === 'all' || p.method.toLowerCase() === filterMethod;
        const statusMatch = filterStatus === 'all' || (filterStatus === 'paid' ? p.paid : !p.paid);
        return methodMatch && statusMatch;
    });

    function togglePayment(paymentId) {
        mockPayments = mockPayments.map(p => 
            p.id === paymentId ? { ...p, paid: !p.paid } : p
        );
    }
    // ... (Mantieni le altre funzioni toggle) ...

    function getStatusClass(paid) {
        return paid ? 'status-paid' : 'status-unpaid';
    }
</script>

<style>
    /* NUOVI STILI AGGIORNATI PER IL DESIGN DARK E MOBILE */
    .app-container {
        max-width: 450px; 
        margin: 0 auto;
        background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
        min-height: 100vh;
        color: white;
        padding: 0 16px;
        padding-bottom: 70px; /* Spazio per la BottomNavBar */
    }
    
    .header-section {
        padding: 20px 0;
        text-align: center;
        margin-bottom: 20px;
    }
    
    h1 {
        font-size: 2rem;
        font-weight: 800;
        color: #70d8ff; /* Accento colore azzurro */
    }

    .controls-bar {
        /* Adotta lo stile card scura */
        background: #1f2331;
        padding: 15px;
        border-radius: 12px;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
        display: flex;
        flex-wrap: wrap;
        gap: 10px;
        margin-bottom: 25px;
    }
    /* ... (Il resto degli stili del toggle e della tabella) ... */

    .toggle-group {
        display: flex;
        border-radius: 8px; /* Angoli più arrotondati */
        overflow: hidden;
        border: 1px solid #70d8ff;
        flex-grow: 1; 
        min-width: 150px;
    }
    .toggle-group button {
        background: #0f172a;
        color: #94a3b8;
        border: none;
        padding: 8px 12px;
    }
    .toggle-group button.active {
        background: #70d8ff;
        color: black;
        font-weight: bold;
    }

    /* Stili Tabella e Pulsanti */
    .payment-table {
        /* Adotta lo stile card scura */
        background: #1f2331;
        border-radius: 12px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.4);
        padding: 0;
    }
    /* Rimuovi le vecchie regole CSS che forzavano il layout orizzontale/due colonne */

    .payment-table th, .payment-table td {
        padding: 10px 10px;
        border-bottom: 1px solid #334155;
    }
    
    /* ... (Manteniamo gli stili mobile esistenti per la tabella) ... */
</style>

<div class="app-container">
    <TopNavBar />
    
    <div class="header-section" transition:fly={{ y: -50, duration: 500 }}>
        <h1>Registro Pagamenti 💳</h1>
    </div>

    <div class="controls-bar" transition:fly={{ y: 50, duration: 500 }}>
        <div class="toggle-group">
            </div>
        
        <div class="toggle-group">
            </div>
    </div>
    
    <div class="panel" transition:fly={{ y: 50, duration: 600 }}>
        </div>

    <BottomNavBar />
</div>
