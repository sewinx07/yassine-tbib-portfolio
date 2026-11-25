import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import type { Connect } from 'vite'

function serveAdminIndex() {
  const middleware: Connect.NextHandleFunction = (req, _res, next) => {
    const path = (req.url ?? '').split('?')[0]
    if (path === '/admin' || path === '/admin/') {
      const query = (req.url ?? '').slice(path.length)
      req.url = `/admin/index.html${query}`
    }
    next()
  }
  return {
    name: 'serve-admin-index',
    configureServer(server: { middlewares: Connect.Server }) {
      server.middlewares.use(middleware)
    },
    configurePreviewServer(server: { middlewares: Connect.Server }) {
      server.middlewares.use(middleware)
    },
  }
}

export default defineConfig({
  plugins: [react(), serveAdminIndex()],
  define: {
    __VERCEL_ENV__: JSON.stringify(process.env.VERCEL_ENV ?? ''),
  },
  build: {
    target: 'es2020',
    cssTarget: 'chrome100',
    rollupOptions: {
      output: {
        manualChunks: {
          three: ['three', '@react-three/fiber', '@react-three/drei'],
          motion: ['gsap', 'lenis'],
        },
      },
    },
  },
})
