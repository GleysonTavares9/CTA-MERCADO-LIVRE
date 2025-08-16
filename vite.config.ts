import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import type { Plugin } from 'vite';

// https://vitejs.dev/config/
// Dev-only helper plugin: server-side fetchers for ML API/HTML
const mlDevApiPlugin = (): Plugin => ({
  name: 'ml-dev-api',
  configureServer(server) {
    server.middlewares.use(async (req, res, next) => {
      try {
        const url = req.url || '';
        if (url.startsWith('/dev-ml/search')) {
          const u = new URL(url, 'http://localhost');
          const q = u.searchParams.get('q') || '';
          const limit = u.searchParams.get('limit') || '5';
          const site = u.searchParams.get('site') || 'MLB';
          const target = `https://api.mercadolibre.com/sites/${site}/search?q=${encodeURIComponent(q)}&limit=${encodeURIComponent(limit)}`;
          let r = await fetch(target, {
            headers: {
              'Accept': 'application/json',
              'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0 Safari/537.36',
              'Accept-Language': 'pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7',
              'Referer': 'https://www.mercadolivre.com.br/',
              'Origin': 'https://www.mercadolivre.com.br',
              'Connection': 'keep-alive'
            }
          });
          // Fallback 1: domain_discovery if 401/403
          if (r.status === 401 || r.status === 403) {
            const alt = `https://api.mercadolibre.com/sites/${site}/domain_discovery/search?q=${encodeURIComponent(q)}&limit=${encodeURIComponent(limit)}`;
            r = await fetch(alt, {
              headers: {
                'Accept': 'application/json',
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0 Safari/537.36',
                'Accept-Language': 'pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7',
                'Referer': 'https://www.mercadolivre.com.br/',
                'Origin': 'https://www.mercadolivre.com.br',
                'Connection': 'keep-alive'
              }
            });
          }
          // Fallback 2: parse web search when API still blocked
          if (r.status === 401 || r.status === 403) {
            const web = `https://www.mercadolivre.com.br/jm/search?as_word=${encodeURIComponent(q)}`;
            const wr = await fetch(web, { redirect: 'follow' });
            const whtml = await wr.text();
            const match = whtml.match(/https?:\/\/[^"']*(?:mercadolivre|mercadolibre)[^"']*(?:\/p\/[^"']+|MLB-\d+[^"']*)/i);
            const permalink = match ? match[0] : null;
            res.statusCode = permalink ? 200 : 204;
            res.setHeader('Content-Type', 'application/json; charset=utf-8');
            return res.end(JSON.stringify({ results: permalink ? [{ permalink }] : [] }));
          }
          const body = await r.text();
          res.statusCode = r.status;
          res.setHeader('Content-Type', 'application/json; charset=utf-8');
          return res.end(body);
        }

        if (url.startsWith('/dev-ml/fetch')) {
          const u = new URL(url, 'http://localhost');
          const target = u.searchParams.get('url');
          if (!target) {
            res.statusCode = 400;
            return res.end('Missing url');
          }
          const r = await fetch(target, {
            redirect: 'follow',
            headers: {
              'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0 Safari/537.36',
              'Accept-Language': 'pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7',
              'Referer': 'https://www.mercadolivre.com.br/',
              'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
              'Connection': 'keep-alive'
            }
          });
          const text = await r.text();
          res.statusCode = r.status;
          res.setHeader('Content-Type', 'text/html; charset=utf-8');
          return res.end(text);
        }

        if (url.startsWith('/dev-ml/resolve')) {
          const u = new URL(url, 'http://localhost');
          const target = u.searchParams.get('url');
          if (!target) {
            res.statusCode = 400;
            return res.end(JSON.stringify({ error: 'Missing url' }));
          }
          const r = await fetch(target, {
            redirect: 'follow',
            headers: {
              'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0 Safari/537.36',
              'Accept-Language': 'pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7',
              'Referer': 'https://www.mercadolivre.com.br/',
              'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
              'Connection': 'keep-alive'
            }
          });
          let finalUrl = (r as any).url as string;
          // If no redirect occurred (finalUrl === target), try to extract canonical/og:url from HTML
          if (finalUrl === target) {
            try {
              const html = await r.text();
              const canonicalMatch = html.match(/<link[^>]*rel=["']canonical["'][^>]*href=["']([^"]+)["'][^>]*>/i);
              const ogUrlMatch = html.match(/<meta[^>]*property=["']og:url["'][^>]*content=["']([^"]+)["'][^>]*>/i);
              const found = canonicalMatch?.[1] || ogUrlMatch?.[1];
              if (found) finalUrl = found;
            } catch {}
          }
          res.statusCode = 200;
          res.setHeader('Content-Type', 'application/json; charset=utf-8');
          return res.end(JSON.stringify({ finalUrl, status: r.status }));
        }

        // Fetch ML item details server-side to avoid CORS/401 in dev
        if (url.startsWith('/dev-ml/items')) {
          const u = new URL(url, 'http://localhost');
          const id = u.searchParams.get('id');
          if (!id) {
            res.statusCode = 400;
            return res.end(JSON.stringify({ error: 'Missing id' }));
          }
          const target = `https://api.mercadolibre.com/items/${encodeURIComponent(id)}`;
          const r = await fetch(target, {
            headers: {
              'Accept': 'application/json',
              'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0 Safari/537.36',
              'Accept-Language': 'pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7',
              'Referer': 'https://www.mercadolivre.com.br/',
              'Origin': 'https://www.mercadolivre.com.br'
            }
          });
          const body = await r.text();
          res.statusCode = r.status;
          res.setHeader('Content-Type', 'application/json; charset=utf-8');
          return res.end(body);
        }
      } catch (e: any) {
        res.statusCode = 500;
        return res.end(`Dev middleware error: ${e?.message || e}`);
      }
      next();
    });
  }
});

export default defineConfig({
  plugins: [react(), mlDevApiPlugin()],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
    minify: 'terser',
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          utils: ['html2canvas', 'axios']
        }
      }
    }
  },
  base: './',
  server: {
    port: 3000,
    open: true,
    proxy: {
      '/ml-api': {
        target: 'https://api.mercadolibre.com',
        changeOrigin: true,
        secure: true,
        rewrite: (path) => path.replace(/^\/ml-api/, '')
      },
      '/ml-page': {
        target: 'https://www.mercadolivre.com.br',
        changeOrigin: true,
        secure: true,
        rewrite: (path) => path.replace(/^\/ml-page/, '')
      },
      '/ml-produto': {
        target: 'https://produto.mercadolivre.com.br',
        changeOrigin: true,
        secure: true,
        rewrite: (path) => path.replace(/^\/ml-produto/, '')
      },
      '/ml-root': {
        target: 'https://mercadolivre.com',
        changeOrigin: true,
        secure: true,
        rewrite: (path) => path.replace(/^\/ml-root/, '')
      }
    }
  },
  preview: {
    port: 4173,
    open: true
  }
});
