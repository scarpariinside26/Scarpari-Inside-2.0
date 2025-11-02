// src/routes/login/+page.server.js
import { redirect } from '@sveltejs/kit';

/** @type {import('./$types').Actions} */
export const actions = {
    /**
     * Gestisce l'azione di Logout.
     */
    logout: async ({ locals }) => {
        const { error } = await locals.supabase.auth.signOut();

        if (error) {
            console.error('Errore durante il logout:', error);
            // Non falliamo, reindirizziamo comunque per esperienza utente
        }

        // Reindirizza l'utente alla homepage dopo il logout
        throw redirect(303, '/');
    },
};
