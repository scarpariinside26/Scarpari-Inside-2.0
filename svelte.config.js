import adapter from '@sveltejs/adapter-vercel';
import preprocess from 'svelte-preprocess'; 

/** @type {import('@sveltejs/kit').Config} */
const config = {
	preprocess: preprocess(), 

	kit: {
		// Stiamo utilizzando l'adapter Vercel per il deployment
		adapter: adapter({
			// !!! FIX NODE VERSION !!!
			// Forziamo l'utilizzo di Node 20, supportato da Vercel e SvelteKit.
			runtime: 'nodejs20.x' 
		}), 
	}
};

export default config;
