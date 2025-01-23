import path from 'path';
import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';
import { externalizeDeps } from 'vite-plugin-externalize-deps';
// https://vite.dev/config/
export default defineConfig({
  build: {
    lib: {
      entry: './src/index.ts',
      fileName: 'index',
      formats: ['es']
    },
    target: 'es2020',
    sourcemap: true,
    outDir: 'dist',
    rollupOptions: {
      output: {
        banner: '"use client"'
      },
      treeshake: true
    }
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src')
    }
  },
  plugins: [
    dts(),
    externalizeDeps({
      include: ['@wagmi/connectors']
    })
  ]
});
