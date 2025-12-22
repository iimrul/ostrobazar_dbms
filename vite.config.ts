import { defineConfig } from 'vite';

// Use a dynamic import for plugin-react to avoid require() of an ESM module
// when Vite's Node API is invoked from CommonJS environments.
// https://vitejs.dev/config/
export default defineConfig(async () => {
  const reactPlugin = (await import('@vitejs/plugin-react')).default;

  return {
    plugins: [reactPlugin()],
    server: {
      proxy: {
        '/api': {
          target: 'http://127.0.0.1:3000',
          changeOrigin: true,
          secure: false,
        },
        '/public': {
          target: 'http://127.0.0.1:3000',
          changeOrigin: true,
          secure: false,
        }
      }
    }
  };
});