import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { createReadStream, existsSync, statSync } from 'node:fs';
import { extname, join, normalize } from 'node:path';
import type { Plugin } from 'vite';

// The MaxiJuegos web build lives at the repository root (../maxijuegos) and is published as is,
// without going through Vite. This serves it during `npm run dev` and `npm run start`.
const GAME_DIR = join(import.meta.dirname, '..', 'maxijuegos');
const GAME_TYPES: Record<string, string> = {'.html':'text/html; charset=utf-8','.js':'text/javascript','.wasm':'application/wasm','.pck':'application/octet-stream','.png':'image/png'};
function serveGame(): Plugin {
  const handler = (req: {url?: string}, res: any, next: () => void) => {
    const match = (req.url ?? '').split('?')[0].match(/\/maxijuegos\/(.*)$/);
    if (!match) return next();
    const file = normalize(join(GAME_DIR, match[1] || 'index.html'));
    if (!file.startsWith(GAME_DIR) || !existsSync(file) || !statSync(file).isFile()) return next();
    res.setHeader('Content-Type', GAME_TYPES[extname(file)] ?? 'application/octet-stream');
    createReadStream(file).pipe(res);
  };
  return {name:'serve-maxijuegos', configureServer(server){server.middlewares.use(handler)}, configurePreviewServer(server){server.middlewares.use(handler)}};
}
export default defineConfig(({ command }) => ({
  plugins: [react(), serveGame()],
  base: command === 'build' ? '/Portfolio/' : '/',
  server: { port: 5173 },
  build: { outDir: 'dist-pages' },
}));

