import adapter from '@sveltejs/adapter-vercel';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	kit: {
		// Specifica a SvelteKit di usare l'adattatore Vercel
		adapter: adapter(),
		
        // Opzionale: disabilita il pre-rendering globale se non necessario,
        // in modo da non avere problemi con le API solo lato server.
        prerender: {
			entries: []
		}
	}
};

export default config;
