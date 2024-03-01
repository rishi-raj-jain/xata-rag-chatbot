import * as dotenv from 'dotenv'
dotenv.config()

import path from 'path'
import vercel from '@sveltejs/adapter-vercel'
import { vitePreprocess } from '@sveltejs/kit/vite'

/** @type {import('@sveltejs/kit').Config} */
export default {
  // Consult https://kit.svelte.dev/docs/integrations#preprocessors
  // for more information about preprocessors
  preprocess: vitePreprocess(),
  kit: {
    // See https://kit.svelte.dev/docs/adapters for more information about adapters.
    adapter: vercel({
      runtime: 'nodejs18.x',
    }),
    alias: {
      '@/*': path.resolve('./src/'),
    },
    csrf: {
      checkOrigin: false,
    },
  },
}
