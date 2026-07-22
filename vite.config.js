import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
// NOTE: Replace '/fm-abhaya-unicod/' with your actual GitHub repo name!
export default defineConfig({
  plugins: [react()],
  base: '/typesinhala_app/',
})
