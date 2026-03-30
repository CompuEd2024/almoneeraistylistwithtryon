import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      // Standardizes the '@' shortcut to your src folder
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    // Keeps your existing HMR logic for the AI editor
    hmr: process.env.DISABLE_HMR !== 'true',
  },
  build: {
    // Ensures the build is targeted for modern browsers
    target: 'esnext',
  }
});
