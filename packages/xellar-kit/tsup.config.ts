import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['esm', 'cjs'],
  dts: true, // Generate TypeScript declaration files
  sourcemap: true, // Include sourcemaps
  clean: true, // Clean the output folder before building
  minify: true,
  outDir: 'dist',
  splitting: true,
  esbuildOptions(options) {
    options.banner = {
      js: '"use client"' // Required for nextjs >= 13
    };
  },
  target: 'es2020',
  tsconfig: 'tsconfig.json',
  external: [
    'react',
    'react-dom',
    'viem',
    '@tanstack/react-query',
    '@wagmi/connectors'
  ]
});
