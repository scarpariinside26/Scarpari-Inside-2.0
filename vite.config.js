import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [sveltekit()],
    // Importante: Aggiungi un resolver per il SvelteKit alias $lib
    resolve: {
        alias: {
            '$lib': '/src/lib',
        }
    }
});
