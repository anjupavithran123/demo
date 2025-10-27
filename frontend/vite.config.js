import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import NodeGlobalsPolyfillPlugin from '@esbuild-plugins/node-globals-polyfill'
import NodeModulesPolyfillPlugin from '@esbuild-plugins/node-modules-polyfill'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(),
    NodeGlobalsPolyfillPlugin.default({ process: true, buffer: true }),
    NodeModulesPolyfillPlugin.default(),
    tailwindcss(),

  ],

  optimizeDeps: {
    esbuildOptions: {
      define: {
        global: 'globalThis', // polyfill `global`
      },
      plugins: [
       
      ],
    },
  },
})
