import { defineConfig } from 'tsup';

import packageJson from './package.json';

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['esm'],
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
    ...Object.keys(packageJson.peerDependencies || {}),
    '@wagmi/connectors',
    'phantom-wagmi-connector'
  ]
});
