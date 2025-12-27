import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current working directory.
  // Set the third parameter to '' to load all env regardless of the `VITE_` prefix.
  const env = loadEnv(mode, process.cwd(), '');

  return {
    plugins: [react()],
    build: {
      outDir: 'dist',
    },
    define: {
      // Expose Vercel Env Vars to the client-side code
      'process.env.APIUTAMA': JSON.stringify(env.APIUTAMA),
      'process.env.APICADANGAN1': JSON.stringify(env.APICADANGAN1),
      'process.env.APICADANGAN2': JSON.stringify(env.APICADANGAN2),
    }
  };
});