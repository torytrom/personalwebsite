import { defineConfig, loadEnv } from 'vite'
import path from 'path'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { createClient } from '@supabase/supabase-js'
import type { IncomingMessage, ServerResponse } from 'http'

// ── Dev-only middleware that mimics the Vercel serverless function ─────────────
function videoSignedUrlDev() {
  let supabaseUrl = ''
  let supabaseKey = ''

  const BUCKET = 'website-video'
  const EXPIRES = 600 // 10 min
  const ALLOWED_PATH = /^[a-zA-Z0-9_\-]+\.(mov|mp4)$/

  return {
    name: 'video-signed-url-dev',

    configResolved(config: { mode: string }) {
      // loadEnv with '' prefix loads ALL env vars from .env / .env.local
      const env = loadEnv(config.mode, process.cwd(), '')
      supabaseUrl = env.SUPABASE_URL || ''
      supabaseKey = env.SUPABASE_SERVICE_ROLE_KEY || ''

      if (!supabaseUrl || !supabaseKey) {
        console.warn(
          '\n⚠️  SUPABASE_URL and/or SUPABASE_SERVICE_ROLE_KEY missing.\n' +
            '   Create a .env.local with both to enable video signed URLs in dev.\n'
        )
      }
    },

    configureServer(server: { middlewares: { use: (path: string, handler: (req: IncomingMessage, res: ServerResponse) => void) => void } }) {
      server.middlewares.use('/api/video-signed-url', async (req, res) => {
        res.setHeader('Content-Type', 'application/json')

        if (!supabaseUrl || !supabaseKey) {
          res.statusCode = 503
          res.end(JSON.stringify({ error: 'Server env vars not configured. See .env.local' }))
          return
        }

        // Parse query string from the URL
        const url = new URL(req.url || '/', `http://${req.headers.host}`)
        const filePath = url.searchParams.get('path')

        if (!filePath || !ALLOWED_PATH.test(filePath)) {
          res.statusCode = 400
          res.end(JSON.stringify({ error: 'Invalid path parameter' }))
          return
        }

        try {
          const supabase = createClient(supabaseUrl, supabaseKey)
          const { data, error } = await supabase.storage
            .from(BUCKET)
            .createSignedUrl(filePath, EXPIRES)

          if (error || !data?.signedUrl) {
            console.error(`[dev] signed-url error for "${filePath}":`, error?.message)
            res.statusCode = 502
            res.end(JSON.stringify({ error: 'Failed to generate signed URL' }))
            return
          }

          res.statusCode = 200
          res.end(JSON.stringify({ signedUrl: data.signedUrl }))
        } catch (err) {
          console.error('[dev] signed-url unexpected error:', err)
          res.statusCode = 500
          res.end(JSON.stringify({ error: 'Internal server error' }))
        }
      })
    },
  }
}

export default defineConfig({
  plugins: [react(), tailwindcss(), videoSignedUrlDev()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})
