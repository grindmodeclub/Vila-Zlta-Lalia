// Keeps <title>, description and canonical in sync when the visitor navigates inside the app.
// The crawler-facing version of the same data is baked into dist/<route>/index.html by scripts/postbuild.mjs.
import seo from '../seo-routes.json';

export function applySeo(pathname: string) {
  const clean = pathname.replace(/\/+$/, '') || '/';
  const route = seo.routes.find((r) => r.path === clean) || seo.routes[0];
  const url = seo.site + (route.path === '/' ? '/' : route.path);
  document.title = route.title;
  const set = (selector: string, attr: string, value: string) => {
    const el = document.head.querySelector<HTMLElement>(selector);
    if (el) el.setAttribute(attr, value);
  };
  set('meta[name="description"]', 'content', route.description || seo.name);
  set('meta[property="og:title"]', 'content', route.title);
  set('meta[property="og:description"]', 'content', route.description || seo.name);
  set('meta[property="og:url"]', 'content', url);
  set('link[rel="canonical"]', 'href', url);
  set('meta[name="robots"]', 'content', (route as { noindex?: boolean }).noindex ? 'noindex, nofollow' : 'index, follow');
}
