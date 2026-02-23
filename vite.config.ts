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
  const ALLOWED_PATH = /^[a-zA-Z0-9_\-]+\.mov$/

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
      // Debug test page: visit /test-video to check if a signed video plays at all
      server.middlewares.use('/test-video', async (_req, res) => {
        if (!supabaseUrl || !supabaseKey) {
          res.statusCode = 503
          res.end('Env vars not set')
          return
        }
        const supabase = createClient(supabaseUrl, supabaseKey)
        const { data } = await supabase.storage
          .from(BUCKET)
          .createSignedUrl('621d9b84869a493198b1ec99e116b128.mov', EXPIRES)
        const url = data?.signedUrl || ''
        res.setHeader('Content-Type', 'text/html')
        res.end(`<!DOCTYPE html><html><body style="background:#111;color:#fff;font-family:sans-serif;padding:2rem">
          <h2>Video playback test</h2>
          <p>Signed URL: <code style="word-break:break-all;font-size:11px">${url.slice(0, 80)}...</code></p>
          <video src="${url}" autoplay loop muted playsinline controls width="320"
            style="border:2px solid lime;margin-top:1rem"
            onloadeddata="document.getElementById('s').textContent='✅ loadeddata fired'"
            onerror="document.getElementById('s').textContent='❌ error: '+this.error?.message"></video>
          <p id="s" style="margin-top:1rem;font-size:18px">⏳ Loading...</p>
        </body></html>`)
      })

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
