/// <reference types="vite/client" />
import { defineConfig } from 'vite';

export default defineConfig({
  optimizeDeps: {
    exclude: [],
    include: [],
    force: false,
    esbuildOptions: {
      // Evitar errores en la optimización de dependencias
      logLevel: 'error'
    }
  },
  server: {
    fs: {
      // Permite acceso a archivos fuera del root si es necesario
      strict: false
    }
  },
  build: {
    rollupOptions: {
      output: {
        // Manejo seguro de imports
        manualChunks: undefined
      }
    }
  }
});
