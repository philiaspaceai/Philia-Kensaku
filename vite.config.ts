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
    'process.env.API_KEY': JSON.stringify("AIzaSyBAFB_r6pUgMg7y_PyPpNoxkqvhAtoKNx4"),
  }
});