<script>
    import TopNavBar from '$lib/components/TopNavBar.svelte';
    import BottomNavBar from '$lib/components/BottomNavBar.svelte';
    import { fly } from 'svelte/transition';

    // Dati fittizi utente
    const userData = {
        name: 'Marco Rossi (Tu)',
        email: 'marco.rossi@example.com',
        phone: '333-5678901',
        birthDate: '15/05/1990',
        currentRoles: ['Portiere', 'Difensore', 'Attaccante'] // Ruoli fittizi iniziali
    };

    // Ruoli disponibili
    const allRoles = ['Portiere', 'Difensore', 'Centrocampista', 'Attaccante'];

    // Variabile per i ruoli selezionati (usiamo una variabile reattiva per simulare la selezione)
    let selectedRoles = [...userData.currentRoles];

    function toggleRole(role) {
        if (selectedRoles.includes(role)) {
            selectedRoles = selectedRoles.filter(r => r !== role);
        } else {
            selectedRoles = [...selectedRoles, role];
        }
    }
    
    function saveRoles() {
        alert(`Nuovi ruoli salvati: ${selectedRoles.join(', ')}`);
    }
</script>

<style>
    .app-container {
        max-width: 450px;
        margin: 0 auto;
        min-height: 100vh;
        color: var(--text-color);
        padding: 0 16px;
        padding-bottom: 80px; 
    }
    .info-card {
        background: var(--panel-bg);
        padding: 20px;
        border-radius: 12px;
        margin-bottom: 25px;
    }
    .info-item {
        font-size: 1rem;
        margin-bottom: 10px;
        border-bottom: 1px solid var(--input-bg);
        padding-bottom: 5px;
    }
    .info-item strong {
        color: var(--accent-color);
        margin-right: 8px;
    }
    
    /* Ruoli */
    .role-section h2 {
        font-size: 1.2rem;
        color: var(--text-color-bright);
        margin-bottom: 15px;
        border-bottom: 2px solid var(--panel-bg);
        padding-bottom: 5px;
    }
    .role-buttons {
        display: flex;
        flex-wrap: wrap;
        gap: 10px;
        margin-bottom: 20px;
    }
    .role-button {
        flex: 1 1 auto; /* Permette ai bottoni di adattarsi */
        min-width: 100px;
        padding: 10px 5px;
        border-radius: 8px;
        border: 2px solid var(--secondary-accent);
        background: var(--bg-color);
        color: var(--secondary-accent);
        font-weight: 700;
        cursor: pointer;
        transition: background 0.2s, color 0.2s, border-color 0.2s;
    }
    .role-button.selected {
        background: var(--success-color);
        color: black;
        border-color: var(--success-color);
    }
    
    .save-button {
        width: 100%;
        padding: 12px;
        background: var(--accent-color);
        color: black;
        border: none;
        border-radius: 8px;
        font-weight: 800;
        cursor: pointer;
        transition: background 0.2s;
    }
</style>

<div class="app-container">
    <TopNavBar />
    <h1 class="page-title">⚙️ Profilo Personale</h1>

    <div class="info-card">
        <h2>Dati Anagrafici</h2>
        <div class="info-item"><strong>Nome:</strong> {userData.name}</div>
        <div class="info-item"><strong>Email:</strong> {userData.email}</div>
        <div class="info-item"><strong>Telefono:</strong> {userData.phone}</div>
        <div class="info-item"><strong>Nascita:</strong> {userData.birthDate}</div>
    </div>

    <div class="info-card role-section">
        <h2>Ruolo Tattico (Modificabile)</h2>
        <div class="role-buttons">
            {#each allRoles as role}
                <button 
                    class="role-button"
                    class:selected={selectedRoles.includes(role)}
                    on:click={() => toggleRole(role)}
                >
                    {role}
                </button>
            {/each}
        </div>
        <button class="save-button" on:click={saveRoles}>
            SALVA RUOLI
        </button>
    </div>
    
    <BottomNavBar />
</div>
