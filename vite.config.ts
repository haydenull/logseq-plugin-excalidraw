import react from '@vitejs/plugin-react'
import { resolve } from 'path'
import { defineConfig } from 'vite'
import usePluginImport from 'vite-plugin-importer'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    // eslint-disable-next-line react-hooks/rules-of-hooks
    usePluginImport({
      libraryName: 'antd',
      libraryDirectory: 'es',
      style: 'css',
    }),
  ],
  base: './',
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
  },
  build: {
    target: 'esnext',
    // minify: "esbuild",
  },
  define: {
    // fix: https://github.com/excalidraw/excalidraw/issues/7331
    // https://docs.excalidraw.com/docs/@excalidraw/excalidraw/faq#referenceerror-process-is-not-defined
    'process.env.IS_PREACT': process.env.IS_PREACT,
  },
})
