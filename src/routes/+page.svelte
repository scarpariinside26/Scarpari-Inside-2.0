<script>
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
    const { liveEvent, teams, isAdmin, user } = data;
    
    // --- VARIABILI DI STATO ---
    let showEditModal = false;
    let isEventExpanded = false;
    // La partita è considerata finita se l'evento è valido e la data è passata (gestito lato server)
    let isMatchFinished = liveEvent && new Date(liveEvent.date) < new Date(); 
    let unreadNotifications = 2; 
    
    const LOGO_SRC = "/Scarpari Inside simplelogo_2023.png"; 

    // --- FUNZIONI INTERAZIONE UI ---
    function openEditModal(event) { event.stopPropagation(); showEditModal = true; }
    function closeEditModal() { showEditModal = false; }
    function toggleEventExpansion() { isEventExpanded = !isEventExpanded; }
    function handleAdminAction(action) { 
        alert(`Azione amministrativa: ${action} per l'evento ${liveEvent.title}`); 
        closeEditModal(); 
        // In un'app reale: invia una richiesta POST al server per eseguire l'azione
    }
    function startVoting() { goto('/vote'); }
    
    // Funzioni per i nuovi pulsanti di cornice
    function goToGeneralChat() { alert('Naviga alla Chat Generale.'); }
    function showNotifications() { 
        alert('Visualizza il dettaglio delle notifiche.'); 
        unreadNotifications = 0; 
    }

    // Dati fittizi per la Modale (da sostituire con dati reali se necessario)
    const availableLocations = ['Campo A', 'Campo B', 'Campo C', 'Stadio Comunale'];
</script>

<style>
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
    .logo-area .placeholder { min-width: 40px;
