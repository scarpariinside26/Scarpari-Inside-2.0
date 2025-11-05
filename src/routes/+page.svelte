<script>
    import { onMount } from 'svelte';
    // ATTENZIONE: getContext è stato rimosso in quanto causava l'errore "Function called outside component initialization".
    // Presumibilmente, l'istanza Supabase è disponibile tramite la prop 'data'.
    import TopNavBar from '$lib/components/TopNavBar.svelte';
    import BottomNavBar from '$lib/components/BottomNavBar.svelte';
    import { fade } from 'svelte/transition';
    import { fly, slide } from 'svelte/transition';
    import { quartOut } from 'svelte/easing';
    import { goto } from '$app/navigation'; 
    import { page } from '$app/stores';

    /** @type {import('./$types').PageData} */
    export let data;
    
    // Dati caricati dal server
    // 'user' è la variabile chiave per determinare lo stato di autenticazione
    // Estraiamo 'supabase' da 'data' se è lì, altrimenti assumiamo che sia globale
    const { liveEvent, teams, isAdmin, user, supabase } = data; // Suppongo che supabase sia in 'data'
    
    // --- VARIABILI DI STATO ---
    let showEditModal = false;
    let isEventExpanded = false;
    let isMatchFinished = liveEvent && new Date(liveEvent.date) < new Date(); 
    let unreadNotifications = 2; 
    
    const LOGO_SRC = "/Scarpari Inside simplelogo_2023.png"; 

    // --- TELEGRAM LOGIN STATE ---
    let loading = true;
    let message = 'Inizializzazione Mini App Telegram...';
    let isTelegramReady = false;

    // --- FUNZIONI INTERAZIONE UI ---
    // Usiamo WebApp.showAlert invece di alert()
    function showAlert(text) {
        if (typeof window !== 'undefined' && window.Telegram?.WebApp) {
            window.Telegram.WebApp.showAlert(text);
        } else {
            // Fallback per il testing locale
            console.log("ALERT (Local): " + text);
        }
    }

    function openEditModal(event) { event.stopPropagation(); showEditModal = true; }
    function closeEditModal() { showEditModal = false; }
    function toggleEventExpansion() { isEventExpanded = !isEventExpanded; }
    function handleAdminAction(action) { 
        console.log(`Azione amministrativa: ${action} per l'evento ${liveEvent.title}`); 
        closeEditModal(); 
        showAlert(`Azione amministrativa: ${action} per l'evento ${liveEvent.title}`);
    }
    function startVoting() { goto('/vote'); }
    
    // Funzioni per i nuovi pulsanti di cornice
    function goToGeneralChat() { showAlert('Naviga alla Chat Generale.'); }
    function showNotifications() { 
        showAlert('Visualizza il dettaglio delle notifiche.'); 
        unreadNotifications = 0; 
    }

    // Dati fittizi per la Modale (da sostituire con dati reali se necessario)
    const availableLocations = ['Campo A', 'Campo B', 'Campo C', 'Stadio Comunale'];
    
    // --- TELEGRAM LOGIN FUNCTIONS ---

    /**
     * Carica lo script di Telegram Web App.
     */
    function loadTelegramScript() {
        return new Promise((resolve) => {
            if (typeof window === 'undefined') {
                // Preveniamo l'esecuzione lato server
                return resolve();
            }
            if (window.Telegram?.WebApp) {
                isTelegramReady = true;
                return resolve();
            }

            const script = document.createElement('script');
            script.src = 'https://telegram.org/js/telegram-web-app.js';
            script.onload = () => {
                isTelegramReady = true;
                resolve();
            };
            script.onerror = () => {
                isTelegramReady = false;
                resolve();
            };
            document.head.appendChild(script);
        });
    }

    /**
     * Esegue l'autenticazione completa: verifica initData e login Supabase.
     * @param {string} initData - Dati crittografati di Telegram.
     */
    async function handleTelegramLogin(initData) {
        if (!initData) {
            message = 'InitData Telegram non trovato. Avvia l\'app da Telegram.';
            loading = false;
            return;
        }

        message = 'Verifica autenticità Telegram in corso...';

        try {
            // 1. Invia i dati al tuo endpoint lato server per la verifica
            const response = await fetch('/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ initData }),
            });

            const result = await response.json();

            if (!response.ok) {
                message = `Login fallito: ${result.message || 'Errore di autenticazione.'}`;
                console.error('Errore server di autenticazione:', result);
                loading = false;
                return;
            }

            // 2. Se la verifica ha successo, Supabase restituisce un Custom Token
            const { accessToken } = result;

            if (!accessToken) {
                message = 'Token di accesso Supabase non ricevuto.';
                loading = false;
                return;
            }
            
            message = 'Autenticazione Supabase in corso...';

            // 3. Usa il Custom Token per autenticare il client Supabase
            // Usiamo il client Supabase iniettato da SvelteKit (dalla prop 'data')
            if (supabase && supabase.auth) {
                const { error: authError } = await supabase.auth.signInWithCustomToken(accessToken);

                if (authError) {
                    message = `Errore di login Supabase: ${authError.message}`;
                    console.error('Errore signInWithCustomToken:', authError);
                    loading = false;
                    return;
                }

                // 4. Successo: lo stato 'user' in 'data' si aggiornerà e mostrerà la dashboard.
                message = 'Accesso riuscito! Caricamento dashboard...';
            } else {
                message = 'Errore: Oggetto Supabase non disponibile nel componente.';
                loading = false;
            }

        } catch (e) {
            console.error('Errore di rete/processo di login:', e);
            message = `Errore critico: ${e.message}`;
            loading = false;
        }
    }


    onMount(async () => {
        // Aggiungi un controllo per garantire che siamo nel browser
        if (typeof window === 'undefined') {
            loading = false;
            return;
        }
        
        // Esegui la sequenza di login solo se l'utente NON è loggato
        if (!user) {
            await loadTelegramScript();

            if (isTelegramReady) {
                const WebApp = window.Telegram.WebApp;
                
                // === QUESTO BLOCCO ERA CORRETTO, DEVE RESTARE QUI (DENTRO onMount) ===
                WebApp.ready();
                WebApp.expand(); 
                
                // OPTIONAL: Impostiamo i colori in base al tema di Telegram (buona pratica)
                if (WebApp.themeParams) {
                    // Imposta i colori della barra superiore
                    WebApp.setHeaderColor(WebApp.themeParams.header_bg_color || 'bg_color'); 
                    // Imposta i colori della barra inferiore (se usi BottomNavBar di Telegram)
                    WebApp.setButtonTextColor(WebApp.themeParams.button_text_color || 'text_color');
                }
                // ====================================================================

                const initData = WebApp.initData;
                
                if (initData) {
                    // Questa chiamata usa l'istanza 'supabase' ottenuta dalla prop 'data'
                    await handleTelegramLogin(initData);
                } else {
                    loading = false;
                    message = 'Per accedere, avvia l\'app dal bot Telegram.';
                }
                
            } else {
                loading = false;
                message = 'Errore: impossibile caricare Telegram Web App SDK. Controlla la connessione.';
            }
        } else {
            // Utente già loggato, non mostrare lo spinner di login
            loading = false; 
        }
    });

    function getTelegramUser() {
        if (typeof window !== 'undefined' && window.Telegram?.WebApp?.initDataUnsafe?.user) {
            const user = window.Telegram.WebApp.initDataUnsafe.user;
            return JSON.stringify(user, null, 2);
        }
        return 'Nessun utente Telegram disponibile (contesto esterno o non loggato).';
    }
    // --- FINE TELEGRAM LOGIN FUNCTIONS ---

</script>

<style>
    /* Stili esistenti */
    .app-container {
        max-width: 450px;
        margin: 0 auto;
        min-height: 100vh;
        color: var(--text-color);
        padding: 0 16px;
        padding-top: 70px; 
        padding-bottom: 80px; 
    }
    .logo-area { display: flex; justify-content: space-between; align-items: center; padding: 15px 0; margin-top: -15px; position: relative; }
    .main-logo { height: 90px; width: auto; opacity: 0.95; }
    .logo-side-button { background: var(--input-bg); color: var(--secondary-accent); border: none; padding: 10px 12px; border-radius: 8px; font-weight: 600; font-size: 0.9rem; cursor: pointer; transition: background 0.2s; white-space: nowrap; text-decoration: none; display: flex; align-items: center; justify-content: center; height: 40px; position: relative; }
    .logo-area .placeholder { min-width: 40px; flex-shrink: 0; }
    .notification-badge { position: absolute; top: -5px; right: -5px; background: var(--error-color); color: white; border-radius: 50%; width: 14px; height: 14px; font-size: 0.7rem; font-weight: 700; display: flex; align-items: center; justify-content: center; line-height: 1; transform: scale(0.9); }
    .dashboard-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; }
    .card { background: var(--panel-bg); border-radius: 12px; padding: 15px; box-shadow: 0 4px 10px rgba(0, 0, 0, 0.4); text-align: left; overflow: hidden; }
    .voting-button-bottom-wrapper { width: 100%; margin-top: 25px; display: flex; justify-content: center; padding-bottom: 5px; }
    .voting-button { background: var(--warning-color); color: black; font-weight: 700; font-size: 0.9rem; padding: 5px 15px; height: 25px; display: flex; align-items: center; justify-content: center; border: none; border-radius: 12px; cursor: pointer; box-shadow: 0 2px 5px rgba(0, 0, 0, 0.3); transition: background 0.2s; max-width: 300px; width: 100%; }
    .voting-button:hover { background: var(--warning-color-dark); }
    .event-live-card-wrapper { grid-column: 1 / -1; transition: transform 0.2s; }
    .event-summary { border-left: 5px solid var(--accent-color); cursor: pointer; padding: 10px 15px; background: var(--panel-bg); border-radius: 12px; transition: border-radius 0.3s; }
    .card-content { display: flex; justify-content: space-between; align-items: flex-start; }
    .card-title { font-size: 1.1rem; font-weight: 800; color: var(--text-color-bright); margin-bottom: 5px; }
    .card-text { font-size: 0.85rem; color: var(--secondary-accent); }
    .confirmation-status { font-weight: 700; color: var(--success-color); margin-top: 5px; display: block; }
    .compact-controls { display: flex; flex-direction: column; gap: 5px; }
    .compact-controls a, .compact-controls button { text-decoration: none; padding: 8px; width: 35px; height: 35px; border-radius: 6px; font-size: 0.9rem; font-weight: 700; transition: background 0.2s; cursor: pointer; display: flex; justify-content: center; align-items: center; }
    .edit-button-compact { background: var(--accent-color); color: black; border: none; }
    .team-name { font-weight: 800; font-size: 0.9rem; color: var(--team-color); margin-bottom: 5px; text-align: center; border-bottom: 2px solid var(--team-color); padding-bottom: 3px; }
    .team-players-list { font-size: 0.75rem; list-style: none; padding: 0; margin: 0; }
    .player-entry { display: flex; justify-content: space-between; line-height: 1.5; }
    .player-entry-rating { font-weight: 700; color: var(--success-color); }
    
    /* Stili per la Modale (Admin) */
    .edit-modal-backdrop { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0, 0, 0, 0.7); display: flex; justify-content: center; align-items: center; z-index: 1000; padding: 16px; }
    .edit-modal-content { background: var(--panel-bg); padding: 25px; border-radius: 12px; max-width: 400px; width: 100%; position: relative; box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5); }
    .close-button { position: absolute; top: 10px; right: 15px; background: none; border: none; font-size: 1.5rem; color: var(--secondary-accent); cursor: pointer; }
    .form-group { margin-bottom: 15px; }
    .form-group label { display: block; margin-bottom: 5px; font-weight: 600; color: var(--text-color-bright); }
    .form-group input, .form-group select { width: 100%; padding: 10px; border-radius: 8px; border: 1px solid var(--input-border); background: var(--input-bg); color: var(--text-color); }
    .action-button { width: 100%; padding: 12px; border: none; border-radius: 8px; font-weight: 700; font-size: 1rem; cursor: pointer; margin-top: 10px; transition: background 0.2s; }
    .save-button { background: var(--accent-color); color: black; }
    .cancel-button { background: var(--warning-color); color: black; }
    .delete-button { background: var(--error-color); color: white; }
    
    /* NUOVO: Stili per la schermata di Login */
    :root {
        --background-color: #1a202c;
        --panel-bg: #2d3748;
        --text-color: #e2e8f0;
        --accent-color: #4299e1;
    }
    .main-container {
        display: flex;
        justify-content: center;
        align-items: center;
        min-height: calc(100vh - 80px); 
        padding: 20px;
        background-color: var(--background-color);
    }
    .panel.login-panel { /* Uso la classe .panel esistente con un modificatore */
        background: var(--panel-bg);
        padding: 40px;
        border-radius: 12px;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.4);
        max-width: 500px;
        width: 100%;
        text-align: center;
        color: var(--text-color);
    }
    .spinner {
        border: 4px solid rgba(255, 255, 255, 0.3);
        border-top: 4px solid var(--accent-color);
        border-radius: 50%;
        width: 40px;
        height: 40px;
        animation: spin 1s linear infinite;
        margin: 20px auto;
    }
    @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
    }
    .debug-info {
        margin-top: 20px;
        text-align: left;
        border: 1px solid #4a5568;
        border-radius: 8px;
        padding: 10px;
    }
    .debug-info summary {
        cursor: pointer;
        color: var(--accent-color);
        font-weight: 600;
    }
    .user-data {
        background: #1a202c;
        padding: 10px;
        border-radius: 6px;
        overflow-x: auto;
        font-size: 0.8rem;
        white-space: pre-wrap;
        word-wrap: break-word;
        color: #48bb78;
        margin-top: 10px;
    }

    /* Stili per l'espansione dei dettagli dell'evento */
    .event-details-content {
        margin-top: 15px;
        padding: 10px 15px;
        background: rgba(255, 255, 255, 0.05); /* Sfondo leggero per distinguere i dettagli */
        border-radius: 0 0 12px 12px;
        border-top: 1px solid rgba(255, 255, 255, 0.1);
    }
    .detail-row {
        margin-bottom: 8px;
        font-size: 0.85rem;
    }
    .description-text {
        margin-top: 10px;
        padding-top: 10px;
        border-top: 1px dashed rgba(255, 255, 255, 0.1);
        font-size: 0.8rem;
        line-height: 1.4;
    }
</style>

<svelte:head>
    <title>Scarpa Inside | Home</title>
</svelte:head>

{#if user}
    <!-- ============================================== -->
    <!-- DASHBOARD CONTENT: MOSTRATO SOLO SE L'UTENTE È LOGGATO -->
    <!-- ============================================== -->
    <div class="app-container">
        <!-- NOTA: TopNavBar è un tuo componente, lascio l'import -->
        <TopNavBar /> 

        <div class="logo-area">
            <!-- Ho sostituito alert() con una funzione che usa WebApp.showAlert() -->
            <button class="logo-side-button placeholder" on:click={goToGeneralChat} title="Chat Generale">Chat</button>
            <img src={LOGO_SRC} alt="Scarpa Inside Logo" class="main-logo"/>
            <button class="logo-side-button placeholder" on:click={showNotifications} title="Notifiche">
                🔔
                {#if unreadNotifications > 0}
                    <div class="notification-badge">{unreadNotifications > 9 ? '9+' : unreadNotifications}</div>
                {/if}
            </button>
        </div>

        {#if isMatchFinished && $page.url.pathname === '/'}
            <div class="voting-button-bottom-wrapper" transition:fly={{ y: -10, duration: 300 }}>
                <button class="voting-button" on:click={startVoting}>
                    ⭐ VOTA I GIOCATORI DELLA PARTITA! ⭐
                </button>
            </div>
        {/if}

        <div class="dashboard-grid">

            {#if liveEvent}
                <div class="event-live-card-wrapper" class:expanded={isEventExpanded}>
                    <div 
                        class="event-summary" 
                        on:click={toggleEventExpansion} 
                        role="button" 
                        tabindex="0"
                        on:keydown={(e) => { if (e.key === 'Enter' || e.key === ' ') toggleEventExpansion(); }}
                    >
                        <div class="card-content">
                            <div>
                                <div class="card-title">{liveEvent.title}</div>
                                <p class="card-text">📍 {liveEvent.location} • ⏰ {liveEvent.time}</p>
                            </div>
                            
                            <div class="compact-controls">
                                {#if isAdmin}
                                    <button class="edit-button-compact" on:click={openEditModal} title="Modifica Evento">🖊️</button>
                                {/if}
                                <!-- Pulsante Chat/Info Evento (ex-Discord) -->
                                <a href={"#"} target="_blank" class="discord-link-compact" on:click|stopPropagation={() => showAlert('Naviga alla chat specifica dell\'evento.')} title="Chat Evento">
                                    <span style="font-size: 1.1rem;">🗨️</span>
                                </a>
                            </div>
                        </div>
                        <span class="confirmation-status">{liveEvent.confirmed} / {liveEvent.total} Giocatori Assegnati!</span>
                    </div>
                    
                    {#if isEventExpanded}
                        <div class="event-details-content" transition:slide={{ duration: 300 }}>
                            <div class="detail-row">
                                <strong>Luogo:</strong> 
                                <a href={"#"} target="_blank" style="color: var(--accent-color); text-decoration: none;">{liveEvent.location} (Vai su Maps 🗺️)</a>
                            </div>
                            <div class="detail-row"><strong>Orario:</strong> {new Date(liveEvent.date).toLocaleDateString()} alle {liveEvent.time}</div>
                            <div class="detail-row"><strong>Durata Stimata:</strong> 90 minuti</div> 

                            <p class="description-text">
                                <strong>Descrizione:</strong><br>{liveEvent.description || 'Nessuna descrizione disponibile.'}
                            </p>
                        </div>
                    {/if}
                </div>
            {:else}
               <div class="event-live-card-wrapper" style="grid-column: 1 / -1; text-align: center; color: var(--secondary-accent);">
                    Nessun evento live programmato o errore nel caricamento.
               </div>
            {/if}

            {#each teams as team (team.id)}
                <div class="card team-card" style="--team-color: {team.color}; border-top: 5px solid {team.color};">
                    <div class="team-name">{team.name}</div>
                    <ul class="team-players-list">
                        {#each team.players as player}
                            <li class="player-entry">
                                <span>{player.name}</span>
                                <span class="player-entry-meta">{player.role}</span>
                                <span class="player-entry-rating">{player.rating.toFixed(1)}</span>
                            </li>
                        {/each}
                        {#if team.players.length === 0}
                            <li style="text-align: center; color: var(--secondary-accent);">Nessun giocatore assegnato.</li>
                        {/if}
                    </ul>
                </div>
            {/each}
            
        </div>
        
        <!-- NOTA: BottomNavBar è un tuo componente, lascio l'import -->
        <BottomNavBar /> 
    </div>

    {#if showEditModal && isAdmin}
        <div 
            class="edit-modal-backdrop" 
            transition:fade={{ duration: 300 }} 
            role="button" 
            tabindex="0" 
            on:click={closeEditModal}
            on:keydown={(e) => { if (e.key === 'Escape' || e.key === 'Enter') closeEditModal(); }}
        >
            <div class="edit-modal-content panel" role="dialog" aria-modal="true" on:click|stopPropagation transition:fly={{ y: 50, duration: 400, easing: quartOut }}>
                <button class="close-button" on:click={closeEditModal}>×</button>
                <h3>Modifica: {liveEvent?.title}</h3>
                
                <div class="form-group">
                    <label for="event-location">Luogo</label>
                    <select id="event-location">
                        <option value={liveEvent?.location}>{liveEvent?.location}</option>
                        {#each availableLocations.filter(loc => loc !== liveEvent?.location) as loc}
                            <option value={loc}>{loc}</option>
                        {/each}
                    </select>
                </div>
                
                <!-- Ho sostituito alert() con una funzione che usa WebApp.showAlert() -->
                <button class="action-button save-button" on:click={() => handleAdminAction('Salva Modifiche Evento')}>
                    💾 SALVA MODIFICHE
                </button>
                
                <button class="action-button cancel-button" on:click={() => handleAdminAction('Annulla Evento')}>
                    ❌ ANNULLA EVENTO
                </button>

                <button class="action-button delete-button" on:click={() => handleAdminAction('Elimina Evento')}>
                    🗑️ ELIMINA (Storico)
                </button>
            </div>
        </div>
    {/if}

{:else}
    <!-- ============================================== -->
    <!-- LOGIN UI: MOSTRATO SOLO SE L'UTENTE NON È LOGGATO -->
    <!-- ============================================== -->
    <div class="main-container" transition:fly={{ y: 50, duration: 400, easing: quartOut }}>
        <div class="panel login-panel">
            <h1 class="text-3xl font-bold mb-4">Accesso Mini App</h1>
            
            {#if loading}
                <div class="spinner"></div>
                <p class="mt-4 text-lg text-gray-400">{message}</p>
            {:else}
                <p class="mt-4 text-lg text-red-400">{message}</p>
                <p class="mt-8 text-sm text-gray-500">
                    Se il login fallisce, assicurati che la variabile d'ambiente 
                    <code>TELEGRAM_BOT_TOKEN</code> su Vercel sia corretta.
                </p>
                
                <details class="debug-info">
                    <summary>Dati Utente Telegram (Debug)</summary>
                    <pre class="user-data">{getTelegramUser()}</pre>
                </details>

            {/if}
        </div>
    </div>
{/if}
