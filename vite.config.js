import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import react, { reactCompilerPreset } from '@vitejs/plugin-react'
import babel from '@rolldown/plugin-babel'

// GitHub Pages serves project sites under a repository subpath like /vaka-website/.
export default defineConfig({
  base: '/vaka-website/',
  plugins: [
    react(),
    tailwindcss(),
    babel({ presets: [reactCompilerPreset()] })
  ],

})
