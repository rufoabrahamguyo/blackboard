import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { readFileSync, existsSync } from 'fs'
import { resolve } from 'path'

function getApiTarget() {
  const envFile = resolve(__dirname, '../backend/.env')
  if (existsSync(envFile)) {
    const content = readFileSync(envFile, 'utf8')
    const port = content.match(/^PORT=(.+)$/m)?.[1]?.trim()
    if (port) return `http://localhost:${port}`
  }
  return 'http://localhost:5000'
}

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: getApiTarget(),
        changeOrigin: true,
      },
    },
  },
})
