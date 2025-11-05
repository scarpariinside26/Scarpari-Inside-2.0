import adapter from '@sveltejs/adapter-vercel';

/** @type {import('@sveltejs/kit').Config} */
const config = {
    kit: {
        // Usa l'adapter Vercel per prestazioni e configurazione ottimali
        adapter: adapter()
    }
};

export default config;
