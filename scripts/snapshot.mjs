// Captures the rendered HTML of every route into prerender/<key>.html (used by scripts/postbuild.mjs).
// Run locally after `npm run build` whenever page texts change:  npm run snapshot
// Needs Playwright + Chromium (npm i -g playwright && npx playwright install chromium). Not run on Netlify.
import fs from 'node:fs';
import path from 'node:path';
import http from 'node:http';
import { createRequire } from 'node:module';
import { execSync } from 'node:child_process';

const require = createRequire(import.meta.url);
function loadPlaywright() {
  const tries = ['playwright', ...(process.env.NODE_PATH || '').split(':').filter(Boolean).map(p => path.join(p, 'playwright'))];
  try { tries.push(path.join(execSync('npm root -g', { stdio: ['ignore', 'pipe', 'ignore'] }).toString().trim(), 'playwright')); } catch { }
  for (const t of tries) { try { return require(t); } catch { } }
  throw new Error('playwright not found');
}
const { chromium } = loadPlaywright();
const root = path.resolve(new URL('.', import.meta.url).pathname, '..');
const dist = path.join(root, 'dist');
const seo = JSON.parse(fs.readFileSync(path.join(root, 'src/seo-routes.json'), 'utf8'));
const MIME = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.webp': 'image/webp', '.png': 'image/png', '.jpg': 'image/jpeg', '.svg': 'image/svg+xml', '.json': 'application/json', '.woff2': 'font/woff2' };

const server = http.createServer((req, res) => {
  let p = decodeURIComponent(req.url.split('?')[0]);
  let file = path.join(dist, p);
  if (!fs.existsSync(file) || fs.statSync(file).isDirectory()) file = fs.existsSync(path.join(file, 'index.html')) ? path.join(file, 'index.html') : path.join(dist, 'index.html');
  res.setHeader('Content-Type', MIME[path.extname(file)] || 'application/octet-stream');
  fs.createReadStream(file).pipe(res);
});
await new Promise(r => server.listen(0, '127.0.0.1', r));
const port = server.address().port;
const browser = await chromium.launch({ headless: true, args: ['--no-sandbox'] });
const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 }, locale: 'sk-SK' });
// decide cookies up front so the consent banner does not end up in the snapshot (it lives outside #root anyway)
await ctx.addInitScript(() => { try { localStorage.setItem('gm_cc', JSON.stringify({ v: 1, id: 'snapshot', ts: Date.now(), c: { necessary: true, functional: false }, all: false })); } catch { } });
fs.mkdirSync(path.join(root, 'prerender'), { recursive: true });
for (const route of seo.routes) {
  if (route.noindex || route.snapshot === false) continue;
  const page = await ctx.newPage();
  await page.goto(`http://127.0.0.1:${port}${route.path}`, { waitUntil: 'networkidle', timeout: 30000 });
  await page.waitForTimeout(800);
  const html = await page.evaluate(() => {
    const rootEl = document.getElementById('root'); if (!rootEl) return '';
    const clone = rootEl.cloneNode(true);
    clone.querySelectorAll('script, iframe, noscript, [data-snapshot-skip]').forEach(e => e.remove());
    clone.querySelectorAll('*').forEach(e => { for (const a of [...e.attributes]) if (/^on/i.test(a.name)) e.removeAttribute(a.name); });
    return clone.innerHTML;
  });
  fs.writeFileSync(path.join(root, 'prerender', `${route.key}.html`), html);
  console.log(`[snapshot] ${route.path} -> prerender/${route.key}.html (${(html.length / 1024).toFixed(0)} kB)`);
  await page.close();
}
await browser.close(); server.close();
