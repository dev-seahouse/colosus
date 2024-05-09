/// <reference types="vitest" />
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import { nxViteTsPaths } from '@nx/vite/plugins/nx-tsconfig-paths.plugin';
import { ViteImageOptimizer } from 'vite-plugin-image-optimizer';

const BITBUCKET_ENV_KEYS = {
  BITBUCKET_PIPELINE_UUID: 'BITBUCKET_PIPELINE_UUID',
  BITBUCKET_COMMIT: 'BITBUCKET_COMMIT',
  BITBUCKET_TAG: 'BITBUCKET_TAG',
};

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const processEnvValues = {
    'process.env': Object.entries(env).reduce((prev, [key, val]) => {
      if (key in BITBUCKET_ENV_KEYS) {
        return { ...prev, [key]: val };
      }
      return prev;
    }, {}),
  };

  return {
    cacheDir: '../../node_modules/.vite/go-advisor',
    define: processEnvValues,
    server: {
      port: 4200,
      host: 'localhost',
    },

    preview: {
      port: 4300,
      host: 'localhost',
    },

    plugins: [react(), nxViteTsPaths(), ViteImageOptimizer({})],

    build: {
      rollupOptions: {
        output: {
          manualChunks: (id) => {
            if (id.includes('node_modules')) {
              if (id.includes('@mui')) {
                return 'vendor_@mui';
              } else if (id.includes('@emotion')) {
                return 'vendor_@emotion';
              } else if (id.includes('@tanstack')) {
                return 'vendor_@tanstack';
              } else if (id.includes('react-router')) {
                return 'vendor_react-router';
              } else if (id.includes('@remix')) {
                return 'vendor_@remix';
              } else if (id.includes('graphql')) {
                return 'vendor_graphql';
              }

              return 'vendor'; // all other package goes here
            }
          },
        },
      },
    },
    // Uncomment this if you are using workers.
    // worker: {
    //  plugins: [
    //    viteTsConfigPaths({
    //      root: '../../',
    //    }),
    //  ],
    // },

    test: {
      globals: true,
      cache: {
        dir: '../../node_modules/.vitest',
      },
      environment: 'jsdom',
      include: ['src/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
    },
  };
});
