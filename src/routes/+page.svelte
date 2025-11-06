import { fail } from '@sveltejs/kit';
// Assicurati che l'import del tuo client server Supabase sia corretto
import { supabaseServerClient } from '$lib/supabaseServerClient'; 

/** @type {import('./$types').Actions} */
export const actions = {
    /**
     * Azione per salvare un dato di test nella tabella 'items' di Supabase.
     * Richiede un utente autenticato.
     */
    saveData: async ({ request, locals }) => {
        // 1. Ottieni la sessione utente da locals (funziona grazie al hook.server.js)
        const session = await locals.safeGetSession(); 
        
        // Verifica se l'utente è loggato
        if (!session.user) {
            console.error("Tentativo di salvare i dati senza utente autenticato.");
            return fail(401, { error: 'Non Autorizzato. Effettua il Login prima di salvare.' });
        }

        const data = await request.formData();
        const content = data.get('content');
        const userId = session.user.id;

        console.log(`[SERVER] Tentativo di salvare i dati per l'utente: ${userId}`);
        
        // Esempio di chiamata a Supabase (devi avere una tabella 'items' con colonne 'user_id' e 'content')
        const { error } = await supabaseServerClient
            .from('items') 
            .insert({ 
                user_id: userId, 
                content: content,
                created_at: new Date()
            });

        if (error) {
            console.error('[SERVER] Errore Supabase in saveData:', error);
            return fail(500, { error: error.message });
        }

        console.log('[SERVER] Dati salvati con successo in Supabase!');
        return { success: true };
    }
};
