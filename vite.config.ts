import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig } from 'vite';
import compression from 'vite-plugin-compression';

export default defineConfig({
 base: "/saksaa_s/",

  plugins: [
    react(), 
    tailwindcss(),
    compression({
      verbose: true,
      disable: false,
      threshold: 1024,
      algorithm: 'gzip',
      ext: '.gz',
    })
  ],

  server: {
    host: 'localhost',
    port: 3001,
    hmr: {
      port: 3001,
    },
    headers: {
      'Cache-Control': 'public, max-age=31536000, immutable'
    }
  },
});