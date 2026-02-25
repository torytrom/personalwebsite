import { defineConfig, loadEnv } from 'vite'
import path from 'path'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import type { IncomingMessage, ServerResponse } from 'http'

// ── Dev-only middleware that mimics the Vercel serverless function ─────────────
function videoSignedUrlDev() {
  let r2Endpoint = ''
  let r2AccessKeyId = ''
  let r2SecretAccessKey = ''

  const BUCKET = 'website-video'
  const EXPIRES = 600 // 10 min
  const ALLOWED_PATH = /^[a-zA-Z0-9_\-]+\.mp4$/

  return {
    name: 'video-signed-url-dev',

    configResolved(config: { mode: string }) {
      // loadEnv with '' prefix loads ALL env vars from .env / .env.local
      const env = loadEnv(config.mode, process.cwd(), '')
      r2Endpoint = env.R2_ENDPOINT || ''
      r2AccessKeyId = env.R2_ACCESS_KEY_ID || ''
      r2SecretAccessKey = env.R2_SECRET_ACCESS_KEY || ''

      if (!r2Endpoint || !r2AccessKeyId || !r2SecretAccessKey) {
        console.warn(
          '\n⚠️  R2_ENDPOINT, R2_ACCESS_KEY_ID, and/or R2_SECRET_ACCESS_KEY missing.\n' +
            '   Create a .env.local with all three to enable video signed URLs in dev.\n'
        )
      }
    },

    configureServer(server: { middlewares: { use: (path: string, handler: (req: IncomingMessage, res: ServerResponse) => void) => void } }) {
      server.middlewares.use('/api/video-signed-url', async (req, res) => {
        res.setHeader('Content-Type', 'application/json')

        if (!r2Endpoint || !r2AccessKeyId || !r2SecretAccessKey) {
          res.statusCode = 503
          res.end(JSON.stringify({ error: 'R2 env vars not configured. See .env.local' }))
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
          const s3 = new S3Client({
            region: 'auto',
            endpoint: r2Endpoint,
            credentials: {
              accessKeyId: r2AccessKeyId,
              secretAccessKey: r2SecretAccessKey,
            },
          })

          const command = new GetObjectCommand({
            Bucket: BUCKET,
            Key: filePath,
          })

          const signedUrl = await getSignedUrl(s3, command, {
            expiresIn: EXPIRES,
          })

          res.statusCode = 200
          res.end(JSON.stringify({ signedUrl }))
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
