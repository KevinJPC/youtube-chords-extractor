import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vitejs.dev/config/
export default defineConfig(({ command, mode }) => {
  const envDir = `${process.cwd()}/../../`
  const env = loadEnv(mode, envDir, '')
  return {
    server: {
      proxy: {
        '/api': env.VITE_BACKEND_URL
      }
    },
    plugins: [react()]
  }
})
