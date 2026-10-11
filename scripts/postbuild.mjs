// Runs after `vite build`. For every route in src/seo-routes.json it writes dist/<route>/index.html with
// route-specific <title>/description/canonical/OG tags, a BreadcrumbList, and (when available) the prerendered
// HTML from prerender/<key>.html inside <div id="root">, so search engines and AI crawlers that do not run
// JavaScript still see the page content. React replaces that content on mount, visitors notice nothing.
import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve(new URL('.', import.meta.url).pathname, '..');
const seo = JSON.parse(fs.readFileSync(path.join(root, 'src/seo-routes.json'), 'utf8'));
const distIndex = path.join(root, 'dist/index.html');
if (!fs.existsSync(distIndex)) { console.error('dist/index.html missing – run vite build first'); process.exit(1); }
// strip a snapshot left by a previous run so every route starts from the pristine Vite output
const base = fs.readFileSync(distIndex, 'utf8').replace(/<div id="root"><!--prerender-->[\s\S]*?<!--\/prerender--><\/div>/, '<div id="root"></div>');
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

function render(route) {
  const url = seo.site + (route.path === '/' ? '/' : route.path);
  let html = base
    .replace(/<title>[^<]*<\/title>/, `<title>${esc(route.title)}</title>`)
    .replace(/(<meta name="description" content=")[^"]*(")/, `$1${esc(route.description)}$2`)
    .replace(/(<meta property="og:title" content=")[^"]*(")/, `$1${esc(route.title)}$2`)
    .replace(/(<meta property="og:description" content=")[^"]*(")/, `$1${esc(route.description || seo.name)}$2`)
    .replace(/(<meta name="twitter:title" content=")[^"]*(")/, `$1${esc(route.title)}$2`)
    .replace(/(<meta name="twitter:description" content=")[^"]*(")/, `$1${esc(route.description || seo.name)}$2`)
    .replace(/(<link rel="canonical" href=")[^"]*(")/, `$1${url}$2`);
  if (!/property="og:url"/.test(html)) html = html.replace('</head>', `    <meta property="og:url" content="${url}" />\n  </head>`);
  else html = html.replace(/(<meta property="og:url" content=")[^"]*(")/, `$1${url}$2`);
  if (route.noindex) html = html.replace(/<meta name="robots" content="[^"]*"\s*\/?>/, '<meta name="robots" content="noindex, nofollow" />');
  if (route.path !== '/' && !route.noindex) {
    const crumbs = { '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Domov', item: seo.site + '/' },
      { '@type': 'ListItem', position: 2, name: route.title.split(' | ')[0].split(' – ')[0], item: url }] };
    html = html.replace('</head>', `    <script type="application/ld+json">${JSON.stringify(crumbs)}</script>\n  </head>`);
  }
  const snap = path.join(root, 'prerender', `${route.key}.html`);
  if (fs.existsSync(snap) && !route.noindex) {
    const content = fs.readFileSync(snap, 'utf8').trim();
    html = html.replace(/<div id="root"><\/div>/, `<div id="root"><!--prerender-->${content}<!--/prerender--></div>`);
  }
  return html;
}

let written = 0;
for (const route of seo.routes) {
  const out = route.path === '/' ? distIndex : path.join(root, 'dist', route.path.replace(/^\//, ''), 'index.html');
  fs.mkdirSync(path.dirname(out), { recursive: true });
  fs.writeFileSync(out, render(route));
  written++;
}
console.log(`[postbuild] wrote ${written} route pages (prerender snapshots: ${fs.existsSync(path.join(root, 'prerender')) ? fs.readdirSync(path.join(root, 'prerender')).filter(f => f.endsWith('.html')).length : 0})`);
