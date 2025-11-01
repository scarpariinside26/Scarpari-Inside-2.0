<script>
    import { fly } from 'svelte/transition';
    const mockPayments = [
        { user: 'Player Alfa', amount: '€5.00', date: '2025-10-28', status: 'Pagato' },
        { user: 'Player Beta', amount: '€5.00', date: '2025-10-29', status: 'Pagato' },
        { user: 'Player Gamma', amount: '€5.00', date: '2025-10-30', status: 'In attesa' },
        { user: 'Player Delta', amount: '€5.00', date: '2025-10-31', status: 'Pagato' },
    ];
</script>

<style>
    /* Usa gli stessi stili della pagina Eventi per la tabella */
</style>

<h1 transition:fly={{ y: -50, duration: 500 }}>Registro Pagamenti 💳</h1>

<div class="panel table-responsive" transition:fly={{ y: 50, duration: 500 }}>
    <table>
        <thead>
            <tr>
                <th>Utente</th>
                <th>Importo</th>
                <th>Data</th>
                <th>Stato</th>
                <th>Azioni</th>
            </tr>
        </thead>
        <tbody>
            {#each mockPayments as payment}
                <tr>
                    <td>{payment.user}</td>
                    <td>{payment.amount}</td>
                    <td>{payment.date}</td>
                    <td><span class="tag" style="background: {payment.status === 'Pagato' ? 'var(--success-color)' : 'var(--warning-color)'}">{payment.status}</span></td>
                    <td>
                        <button class="btn-action btn-success">Registra Manualmente</button>
                    </td>
                </tr>
            {/each}
        </tbody>
    </table>
</div>
