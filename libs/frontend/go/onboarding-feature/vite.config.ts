/// <reference types="vitest" />
import type { PluginOption } from 'vite';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import dts from 'vite-plugin-dts';
import path from 'path';
import { nxViteTsPaths } from '@nx/vite/plugins/nx-tsconfig-paths.plugin';
import { visualizer } from 'rollup-plugin-visualizer';

export default defineConfig({
  cacheDir: '../../../../node_modules/.vite/go-onboarding-feature',

  plugins: [
    dts({
      entryRoot: 'src',
      tsConfigFilePath: path.join(__dirname, 'tsconfig.lib.json'),
      skipDiagnostics: true,
    }),
    react(),
    nxViteTsPaths(),
    visualizer({
      filename: 'go-onboarding-feature-stats.html',
    }) as PluginOption,
  ],

  // Uncomment this if you are using workers.
  // worker: {
  //  plugins: [ nxViteTsPaths() ],
  // },

  // Configuration for building your library.
  // See: https://vitejs.dev/guide/build.html#library-mode
  build: {
    lib: {
      // Could also be a dictionary or array of multiple entry points.
      entry: 'src/index.ts',
      name: 'go-onboarding-feature',
      fileName: 'index',
      // Change this to the formats you want to support.
      // Don't forget to update your package.json as well.
      formats: ['es', 'cjs'],
    },
    rollupOptions: {
      // External packages that should not be bundled into your library.
      external: ['react', 'react-dom', 'react/jsx-runtime'],
    },
  },

  test: {
    globals: true,
    cache: {
      dir: '../../../../node_modules/.vitest',
    },
    environment: 'jsdom',
    include: ['src/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
    setupFiles: ['./vitest.setup.ts'],
  },
});
