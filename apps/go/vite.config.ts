/// <reference types="vitest" />
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import { nxViteTsPaths } from '@nx/vite/plugins/nx-tsconfig-paths.plugin';
import { ViteImageOptimizer } from 'vite-plugin-image-optimizer';
import path from 'path';
import fs from 'fs';

function excludeMsw() {
  return {
    name: 'exclude-msw',
    resolveId(source: string) {
      return source === 'virtual-module' ? source : null;
    },
    renderStart(outputOptions: any, _inputOptions: any) {
      const outDir = outputOptions.dir;
      const msWorker = path.resolve(outDir, 'mockServiceWorker.js');
      fs.rm(msWorker, () => console.log(`Deleted ${msWorker}`));
    },
  };
}

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
    cacheDir: '../../node_modules/.vite/go',
    define: processEnvValues,
    server: {
      port: 4200,
      host: 'localhost',
    },

    preview: {
      port: 4200,
      host: 'localhost',
    },

    plugins: [react(), nxViteTsPaths(), ViteImageOptimizer({}), excludeMsw()],

    // Uncomment this if you are using workers.
    // worker: {
    //  plugins: [
    //    viteTsConfigPaths({
    //      root: '../../',
    //    }),
    //  ],
    // },
    build: {
      sourcemap: true,
      rollupOptions: {
        output: {
          manualChunks: (id) => {
            if (id.includes('node_modules')) {
              if (id.includes('@tanstack')) {
                return 'vendor_@tanstack';
              } else if (id.includes('react-router')) {
                return 'vendor_react-router';
              } else if (id.includes('@remix')) {
                return 'vendor_@remix';
              } else if (id.includes('graphql')) {
                return 'vendor_graphql';
              } else if (id.includes('recharts')) {
                return 'vendor_recharts';
              }

              return 'vendor'; // all other package goes here
            }
          },
        },
      },
    },

    experimental: {
      renderBuiltUrl(
        filename: string,
        {
          type,
        }: {
          type: 'public' | 'asset';
        }
      ) {
        if (type === 'asset' && env?.VITE_INVESTOR_OVERRIDE_BUILD_URL) {
          return `${env?.VITE_INVESTOR_OVERRIDE_BUILD_URL}/${filename}`;
        }

        return {
          relative: true,
        };
      },
    },

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
