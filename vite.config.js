import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Relative base path so the built assets resolve correctly whether the app
// is served from https://<user>.github.io/ or https://<user>.github.io/<repo>/
export default defineConfig({
  plugins: [react()],
  base: './',
});
