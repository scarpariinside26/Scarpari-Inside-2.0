<script>
    import { fly } from 'svelte/transition';
    let reportType = 'Bug';
    let reportDetails = '';
    let isSubmitting = false;

    async function submitReport() {
        if (!reportDetails.trim()) {
            alert('Per favore, fornisci i dettagli della segnalazione.');
            return;
        }
        isSubmitting = true;
        // Simulazione invio (qui andrebbe la chiamata API al tuo Bot Vercel/Discord)
        await new Promise(r => setTimeout(r, 1500)); 
        isSubmitting = false;
        reportDetails = '';
        alert('✅ Segnalazione inviata con successo! Grazie per il tuo feedback.');
    }
</script>

<style>
    .form-group { margin-bottom: 20px; }
    label { display: block; margin-bottom: 8px; font-weight: bold; color: var(--accent-color); }
    select, textarea { width: 100%; background: #333650; color: var(--text-color); border: 1px solid #4a4a75; padding: 10px; border-radius: 6px; box-sizing: border-box; }
    textarea { min-height: 150px; }
</style>

<h1 transition:fly={{ y: -50, duration: 500 }}>Segnalazioni Admin 🚨</h1>

<div class="panel" transition:fly={{ y: 50, duration: 500 }}>
    <div class="form-group">
        <label for="report-type">Tipo di Segnalazione</label>
        <select id="report-type" bind:value={reportType}>
            <option>Bug</option>
            <option>Feedback/Suggerimento</option>
            <option>Problema con Giocatore</option>
            <option>Altro</option>
        </select>
    </div>
    
    <div class="form-group">
        <label for="report-details">Dettagli</label>
        <textarea id="report-details" bind:value={reportDetails} placeholder="Descrivi il problema o il suggerimento nel dettaglio..."></textarea>
    </div>
    
    <button class="btn-primary" on:click={submitReport} disabled={isSubmitting}>
        {isSubmitting ? 'Invio in corso...' : 'Invia Segnalazione'}
    </button>
</div>
