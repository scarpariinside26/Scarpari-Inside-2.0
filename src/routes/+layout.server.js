/**
 * Questo file carica sessione e profilo dal server (da locals.session e locals.profile)
 * e li rende disponibili al layout client (+layout.svelte) tramite 'data'.
 * La logica di reindirizzamento è stata intenzionalmente omessa qui
 * per isolare e risolvere l'errore 500.
 */
// Non importare 'redirect' qui
export async function load({ locals }) {
    
    // Passa sessione e profilo (anche se quest'ultimo è null in hooks.server.js)
    // Se l'errore 500 è risolto, significa che il problema era nel reindirizzamento
    // o nel caricamento del profilo.
    return {
        session: locals.session,
        profile: locals.profile
    };
}
