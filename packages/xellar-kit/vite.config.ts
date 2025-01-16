import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';

// https://vite.dev/config/
export default defineConfig({
  build: {
    lib: {
      entry: './src/index.ts',
      fileName: 'index',
      formats: ['es']
    },
    target: 'es2020',
    minify: true,
    sourcemap: true,
    outDir: 'dist',
    rollupOptions: {
      output: {
        banner: '"use client"'
      },
      treeshake: true,
      external: ['react', 'react-dom', '@tanstack/react-query', 'wagmi', 'viem']
    }
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src')
    }
  },
  plugins: [react(), dts()]
});
