// tsup.config.ts
import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['index.ts'], // Entry point of your library
  format: ['esm', 'cjs'], // Output formats
  dts: true, // Generate TypeScript declaration files
  sourcemap: true, // Include sourcemaps
  clean: true, // Clean the output folder before building
  minify: true,
  outDir: 'dist',
  external: ['react', 'react-dom'], // Peer dependencies to exclude from the bundle
  target: 'es2020',
  tsconfig: 'tsconfig.json'
});
