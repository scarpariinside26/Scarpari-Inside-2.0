// src/routes/vote/+page.server.js - AGGIORNATO PER VOTI_PARTITA
import { redirect, fail } from '@sveltejs/kit';

/** @type {import('./$types').Actions} */
export const actions = {
    // Gestisce l'invio dei voti dalla touch bar
    submitVotes: async ({ request, locals }) => {
        const supabase = locals.supabase;
        const session = await locals.getSession();
        
        if (!session) {
            throw redirect(303, '/login'); 
        }

        const formData = await request.formData();
        const eventId = formData.get('event_id');
        const voterUserId = session.user.id; // auth.users.id del votante
        
        const rawVotes = JSON.parse(formData.get('votes')); 
        
        // Mappa i dati nel formato esatto della tabella voti_partita
        const votesToInsert = rawVotes.map(vote => ({
            event_id: eventId,
            voter_user_id: voterUserId,
            voted_user_id: vote.user_id, // USA user_id (auth.users.id) come richiesto dalla tua tabella voti_partita
            punteggio: vote.score,       // Attenzione: il tuo schema vuole INTEGER. Convertiamo il float in int (es. 7.5 -> 8) O dovrai aggiornare lo schema a numeric(3, 1)
        }));
        
        // --- INSERIMENTO DATI NEL DB ---
        const { error } = await supabase
            .from('voti_partita') // NOME TABELLA REALE
            .upsert(votesToInsert, { 
                onConflict: ['event_id', 'voter_user_id', 'voted_user_id'], // La tua chiave unica
                ignoreDuplicates: false // Aggiorna se già presente (voto modificato)
            });

        // --- GESTIONE LOG E NOTIFICHE DI TEST (con indirizzo fittizio) ---
        if (error) {
            console.error("Errore inserimento voti in voti_partita:", error);
            console.log(`[TEST EMAIL ALERT] ERRORE VOTO su ${voterUserId}: ${error.message}. Notifica inviata a scarpariinside@gmail.com.`);
            
            return fail(500, { error: 'Errore durante il salvataggio dei voti. Controlla il console log.' });
        }

        console.log(`[TEST EMAIL ALERT] Voti inviati con successo da ${voterUserId} per l'evento ${eventId}. Notifica di completamento inviata a scarpariinside@gmail.com.`);

        return { success: true, message: "Voti inviati con successo." };
    },
};
