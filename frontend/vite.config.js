import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist', // default is 'dist', but good to be explicit
  },
  server: {
    port: 5173,      // optional, for local dev
    open: true       // optional, auto opens browser
  }
});
