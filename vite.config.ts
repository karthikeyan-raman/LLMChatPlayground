import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import mix from 'vite-plugin-mix';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(),mix({ handler: './src/api/index.ts' })],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  // For environment variables to be properly loaded
  define: {
    // Make sure environment variables are properly injected
    'import.meta.env.VITE_ANTHROPIC_API_KEY': JSON.stringify(process.env.VITE_ANTHROPIC_API_KEY),
    'import.meta.env.VITE_OPENAI_API_KEY': JSON.stringify(process.env.VITE_OPENAI_API_KEY),
    'import.meta.env.VITE_AWS_ACCESS_KEY': JSON.stringify(process.env.VITE_AWS_ACCESS_KEY),
    'import.meta.env.VITE_AWS_SECRET_KEY': JSON.stringify(process.env.VITE_AWS_SECRET_KEY),
  },
})