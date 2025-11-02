<script>
// ... (script precedente)
    // ... (omissis) ...
    // ... (omissis) ...
// ... (script precedente)
</script>

<div class="app-container">
    <TopNavBar />

    <div class="logo-area">
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
                <div class="event-summary" on:click={toggleEventExpansion} role="button" tabindex="0">
                    <div class="card-content">
                        </div>
                    <span class="confirmation-status">{liveEvent.confirmed} / {liveEvent.total} Giocatori Assegnati!</span>
                </div>
                
                {#if isEventExpanded}
                    {/if}
            </div>
        {/if}

        </div>
    
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
            </div>
    </div>
{/if}
