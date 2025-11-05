import adapter from '@sveltejs/adapter-vercel'; // <--- ORA IMPORTIAMO QUELLO GIUSTO
import { vitePreprocess } from '@sveltejs/kit/vite';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	// Preprocessore per supportare script/style
	preprocess: vitePreprocess(),

	kit: {
		// Target di deployment: Vercel
		adapter: adapter(), 
	}
};

export default config;
