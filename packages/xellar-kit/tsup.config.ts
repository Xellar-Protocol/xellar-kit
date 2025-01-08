import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['index.ts'], // Entry point of your library
  format: ['esm', 'cjs'], // Output formats
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
  external: ['react'], // Peer dependencies to exclude from the bundle
  target: 'es2020',
  tsconfig: 'tsconfig.json'
});
