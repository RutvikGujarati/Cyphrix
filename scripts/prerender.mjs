import { mkdir, mkdtemp, readFile, readdir, rm, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { createHash } from 'node:crypto';
import { build, transformWithEsbuild } from 'vite';
import react from '@vitejs/plugin-react';

const cache = resolve('node_modules/.cache');
await mkdir(cache, { recursive: true });
const serverBuild = await mkdtemp(`${cache}/cyphrix-prerender-`);
try {
  await build({
    configFile: false,
    plugins: [react()],
    build: { ssr: 'src/prerender.tsx', outDir: serverBuild, emptyOutDir: true, minify: false },
  });
  const { renderPage, pages, siteUrl, socialImage, structuredData } = await import(pathToFileURL(`${serverBuild}/prerender.js`).href);
  let html = await readFile('dist/index.html', 'utf8');
  const cssFiles = (await readdir('dist/assets')).filter(name => name.endsWith('.css'));
  cssFiles.sort((left, right) => Number(right.startsWith('index-')) - Number(left.startsWith('index-')) || left.localeCompare(right));
  const css = (await Promise.all(cssFiles.map(name => readFile(`dist/assets/${name}`, 'utf8')))).join('\n');
  html = html.replace(/<link\b[^>]*rel="stylesheet"[^>]*>/g, '');
  html = html.replace('</head>', `<style>${css.replace(/<\/style/gi, '<\\/style')}</style>\n</head>`);
  if (!html.includes('<div id="root"></div>')) throw new Error('Page root was not found');
  const escape = value => value.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  function metadata(template, page) {
    let result = template.replace(/<title>[\s\S]*?<\/title>/, `<title>${escape(page.title)}</title>`);
    result = result.replace(/<meta\s+name="description"[\s\S]*?>/, `<meta name="description" content="${escape(page.description)}" />`);
    const tags = [
      ['property', 'og:type', 'website'], ['property', 'og:site_name', 'Cyphrix Technologies'],
      ['property', 'og:title', page.title], ['property', 'og:description', page.description],
      ['property', 'og:url', `${siteUrl}${page.path}`], ['property', 'og:image', socialImage],
      ['property', 'og:image:type', 'image/jpeg'], ['property', 'og:image:width', '1200'],
      ['property', 'og:image:height', '1200'], ['property', 'og:image:alt', 'Cyphrix Technologies emblem'],
      ['property', 'og:locale', 'en_US'], ['name', 'twitter:card', 'summary_large_image'],
      ['name', 'twitter:title', page.title], ['name', 'twitter:description', page.description],
      ['name', 'twitter:image', socialImage], ['name', 'twitter:image:alt', 'Cyphrix Technologies emblem'],
    ].map(([attribute, key, value]) => `<meta ${attribute}="${key}" content="${escape(value)}" />`).join('\n');
    const schema = JSON.stringify(structuredData(page.path)).replace(/</g, '\\u003c');
    return result.replace('</head>', `<link rel="canonical" href="${siteUrl}${page.path}" />\n${tags}\n<script id="site-schema" type="application/ld+json">${schema}</script>\n</head>`);
  }

  function extractStyles(markup) {
    const rules = new Map();
    const result = markup.replace(/<[a-z][^>]*\sstyle="([^"]*)"[^>]*>/gi, (tag, style) => {
      // Pre-rendered content must be visible before client-side animations load.
      const visibleStyle = style.replace(/(^|;)opacity:0(?=;|$)/g, '$1opacity:1');
      if (!rules.has(visibleStyle)) rules.set(visibleStyle, `static-style-${rules.size}`);
      const name = rules.get(visibleStyle);
      let element = tag.replace(/\sstyle="[^"]*"/, '');
      if (/\sclass="/.test(element)) element = element.replace(/\sclass="([^"]*)"/, ` class="$1 ${name}"`);
      else element = element.replace(/\s*\/?>$/, match => ` class="${name}"${match}`);
      return element;
    });
    const css = [...rules].map(([style, name]) => `#root .${name}{${style.replace(/&quot;/g, '"').replace(/&#x27;/g, "'").replace(/&amp;/g, '&')}}`).join('');
    return { markup: result, css };
  }

  await writeFile('dist/app.html', metadata(html, pages[0]));
  const particleSource = (await readFile('src/particles.ts', 'utf8')).replace('export function mountParticles', 'function mountParticles');
  const { code } = await transformWithEsbuild(`${particleSource}\nconst canvas = document.querySelector('[data-particles]'); if (canvas) mountParticles(canvas);`, 'particles.ts', { loader: 'ts', minify: true, format: 'iife' });
  const hash = `sha256-${createHash('sha256').update(code).digest('base64')}`;
  const config = JSON.parse(await readFile('vercel.json', 'utf8'));
  const csp = config.headers.flatMap(rule => rule.headers).find(header => header.key === 'Content-Security-Policy').value;
  if (!csp.includes(`'${hash}'`)) throw new Error(`Add '${hash}' to the deployment script-src policy before releasing the inline particle script.`);
  for (const page of pages) {
    const content = extractStyles(renderPage(page.path));
    let output = metadata(html, page).replace('<div id="root"></div>', `<div id="root" data-prerendered="true">${content.markup}</div>`);
    output = output.replace('</head>', `<style>${content.css}</style>\n</head>`);
    if (page.path === '/') {
      output = output.replace(/<script\b[^>]*type="module"[^>]*>[\s\S]*?<\/script>/g, '');
      output = output.replace('</body>', `<script>${code}</script>\n</body>`);
      await writeFile('dist/index.html', output);
    } else {
      await mkdir(`dist${page.path}`, { recursive: true });
      await writeFile(`dist${page.path}/index.html`, output);
    }
  }
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${pages.map(page => `<url><loc>${siteUrl}${page.path}</loc></url>`).join('')}</urlset>\n`;
  await writeFile('dist/sitemap.xml', sitemap);
} finally {
  await rm(serverBuild, { recursive: true, force: true });
}
