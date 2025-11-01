<script>
    import { goto } from '$app/navigation';
    // Le sezioni non navigabili (che ancora non esistono) riceveranno un alert
    function navigate(path) {
        if (path) {
            goto(path);
        } else {
            alert("Questa sezione non è ancora implementata.");
        }
    }
</script>

<style>
    .top-nav {
        display: flex;
        justify-content: space-around;
        align-items: center;
        background: #1e293b; 
        border-bottom: 1px solid #334155;
        padding: 10px 0;
        position: sticky; /* Rende la barra fissa in cima */
        top: 0;
        z-index: 1000;
        width: 100%;
    }
    .nav-item {
        background: none;
        border: none;
        color: #94a3b8;
        font-size: 0.7rem;
        font-weight: 500;
        text-align: center;
        padding: 5px;
        cursor: pointer;
        transition: color 0.2s;
    }
    .nav-item:hover, .nav-item:focus {
        color: #f59e0b; /* Colore accento */
        outline: none;
    }
</style>

<nav class="top-nav">
    <button class="nav-item" on:click={() => navigate('/posts')}>
        📰<br>Post
    </button>
    <button class="nav-item" on:click={() => navigate('/polls')}>
        🗳️<br>Sondaggi
    </button>
    <button class="nav-item" on:click={() => navigate('/payments')}>
        💸<br>Pagamenti
    </button>
    <button class="nav-item" on:click={() => navigate('/settings')}>
        ⚙️<br>Impostazioni
    </button>
</nav>
