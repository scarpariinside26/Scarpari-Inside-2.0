import { fail } from '@sveltejs/kit';
// Assicurati che questo import punti al tuo client Supabase **solo per il Server**
// NON importare qui il client che usi in +page.svelte ($lib/supabaseClient)
import { supabaseServerClient } from '$lib/supabaseServerClient'; 

/** @type {import('./$types').Actions} */
export const actions = {
    /**
     * Azione per salvare un dato di test nella tabella 'items' di Supabase.
     * Richiede un utente autenticato.
     */
    saveData: async ({ request, locals }) => {
        // 1. Ottieni la sessione utente da locals (funziona grazie al hook.server.js)
        // Usiamo locals.safeGetSession che DEVE essere gestito nel tuo hooks.server.js
        const { user } = await locals.safeGetSession(); 
        
        // Verifica se l'utente è loggato
        if (!user) {
            console.error("Tentativo di salvare i dati senza utente autenticato.");
            return fail(401, { error: 'Non Autorizzato. Effettua il Login prima di salvare.' });
        }

        const data = await request.formData();
        const content = data.get('content');
        const userId = user.id;
        
        // Verifica che il contenuto non sia vuoto
        if (!content || typeof content !== 'string' || content.trim() === '') {
            return fail(400, { error: 'Il contenuto non può essere vuoto.' });
        }

        console.log(`[SERVER] Tentativo di salvare i dati per l'utente: ${userId}`);
        
        // Esempio di chiamata a Supabase
        const { error } = await supabaseServerClient
            .from('items') 
            .insert({ 
                user_id: userId, 
                content: content.trim(),
                created_at: new Date()
            });

        if (error) {
            console.error('[SERVER] Errore Supabase in saveData:', error);
            // Non esporre dettagli dell'errore al client in produzione, ma va bene per il testing
            return fail(500, { error: 'Errore durante il salvataggio dei dati.' });
        }

        console.log('[SERVER] Dati salvati con successo in Supabase!');
        return { success: true, message: 'Dato salvato con successo!' };
    }
};
