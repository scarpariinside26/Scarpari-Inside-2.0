import { fail } from '@sveltejs/kit';
import { supabaseServerClient } from '$lib/supabaseServerClient'; // Import del client lato server

/** @type {import('./$types').Actions} */
export const actions = {
    saveData: async ({ request, locals }) => {
        // 1. Ottieni la sessione utente da locals (Supabase si occupa di questo con i cookie)
        const session = await locals.safeGetSession(); 
        
        // Verifica se l'utente è loggato
        if (!session.user) {
            console.error("Tentativo di salvare i dati senza utente autenticato.");
            return fail(401, { error: 'Non Autorizzato' });
        }

        const data = await request.formData();
        const content = data.get('content');
        const userId = session.user.id;

        console.log(`Tentativo di salvare i dati per l'utente: ${userId}`);
        
        // Esempio di chiamata a Supabase (da adattare alla tua tabella)
        const { error } = await supabaseServerClient
            .from('items') // Sostituisci con il nome della tua tabella
            .insert({ 
                user_id: userId, 
                content: content,
                created_at: new Date()
            });

        if (error) {
            console.error('Errore Supabase:', error);
            return fail(500, { error: error.message });
        }

        console.log('Dati salvati con successo in Supabase!');
        return { success: true };
    }
};
