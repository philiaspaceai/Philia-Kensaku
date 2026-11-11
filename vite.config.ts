import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
// Catatan: tidak ada lagi API key yang di-inline ke bundle. Seluruh data TSK
// dilayani sebagai file statis dari public/data/.
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
  },
});
