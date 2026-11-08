import { defineConfig, loadEnv, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'

function calendlyEarlyFrame(fromFile: string | undefined): Plugin {
  return {
    name: 'calendly-early-frame',
    transformIndexHtml(html) {
      const raw = process.env.VITE_CALENDLY_URL?.trim() || fromFile?.trim()
      if (!raw) return html
      let parsed: URL
      try {
        parsed = new URL(raw)
      } catch {
        return html
      }
      const host = parsed.hostname.toLowerCase()
      if (parsed.protocol !== 'https:' || !(host === 'calendly.com' || host.endsWith('.calendly.com'))) return html
      const script = `<script>
(function () {
  if (location.pathname !== '/appel') return
  var base = new URL(${JSON.stringify(parsed.toString())})
  base.searchParams.set('embed_domain', location.hostname)
  base.searchParams.set('embed_type', 'Inline')
  base.searchParams.set('hide_gdpr_banner', '1')
  base.searchParams.set('hide_event_type_details', '1')
  base.searchParams.set('primary_color', '3b6cf6')
  var frame = document.createElement('iframe')
  frame.id = 'calendly-early'
  frame.title = 'Réserver un appel de 20 minutes'
  frame.loading = 'eager'
  frame.setAttribute('fetchpriority', 'high')
  frame.src = base.toString()
  frame.style.cssText = 'position:absolute;width:100%;height:760px;top:0;left:0;visibility:hidden;border:0'
  document.body.appendChild(frame)
})()
</script>`
      return html.replace(
        /<script type="module"[^>]*src="[^"]+"><\/script>/,
        `${script}\n    $&`,
      )
    },
  }
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  return {
    plugins: [
      react(),
      tailwindcss(),
      calendlyEarlyFrame(env.VITE_CALENDLY_URL),
    ],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
  }
})
