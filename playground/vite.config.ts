import { defineConfig } from 'vite'
import Inspect from 'vite-plugin-inspect'
import Unplugin from '../dist/vite'

export default defineConfig({
  build: {
    sourcemap: true,
  },
  plugins: [
    Inspect(),
    Unplugin({
      uploadUrl: 'http://localhost:7001/monitor/sourcemap',
      apiKey: 'kaikeba',
      output: 'playground/dist',
    }),
  ],
})
