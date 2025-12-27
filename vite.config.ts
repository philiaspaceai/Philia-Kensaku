import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
  },
  define: {
    // Injecting the API Key provided by the user securely for client-side usage
    'process.env.API_KEY': JSON.stringify("AIzaSyD0IKaZ84V-s4YtA7MPVZqnBLpGX-9-yjU"),
  }
});