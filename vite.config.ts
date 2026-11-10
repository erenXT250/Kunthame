import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: './', // Relative base path ensures it works on GitHub Pages subpaths & custom domains
  server: {
    port: 3001,
    open: true,
  },
});
