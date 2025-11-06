import adapter from '@sveltejs/adapter-vercel';
// Importiamo il preprocessore standalone 'svelte-preprocess', che abbiamo aggiunto in package.json.
// Questo è il fix per risolvere l'errore 'vitePreprocess' che non viene esportato correttamente
// nell'ambiente di compilazione di Vercel/SvelteKit.
import preprocess from 'svelte-preprocess'; 

/** @type {import('@sveltejs/kit').Config} */
const config = {
	// Utilizziamo il preprocessore esterno per garantire stabilità
	preprocess: preprocess(), 

	kit: {
		// Stiamo utilizzando l'adapter Vercel per il deployment
		adapter: adapter(), 
	}
};

export default config;
