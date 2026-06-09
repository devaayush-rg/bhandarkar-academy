import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
// TODO: Replace <REPO_NAME> with your actual GitHub repository name
export default defineConfig({
  plugins: [react()],
  base: '/bhandarkar-academy/',
})
