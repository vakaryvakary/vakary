import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import react, { reactCompilerPreset } from '@vitejs/plugin-react'
import babel from '@rolldown/plugin-babel'

// The production site is served from the custom-domain root: https://vakary.fi/.
export default defineConfig({
  base: '/',
  server: {
    // Open the local site once; Vite then hot-updates it whenever source files are saved.
    open: true,
  },
  plugins: [
    react(),
    tailwindcss(),
    babel({ presets: [reactCompilerPreset()] })
  ],

})
