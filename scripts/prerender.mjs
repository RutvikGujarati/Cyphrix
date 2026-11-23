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
  const { renderHome } = await import(pathToFileURL(`${serverBuild}/prerender.js`).href);
  let html = await readFile('dist/index.html', 'utf8');
  const cssFiles = (await readdir('dist/assets')).filter(name => name.endsWith('.css'));
  cssFiles.sort((left, right) => Number(right.startsWith('index-')) - Number(left.startsWith('index-')) || left.localeCompare(right));
  const css = (await Promise.all(cssFiles.map(name => readFile(`dist/assets/${name}`, 'utf8')))).join('\n');
  html = html.replace(/<link\b[^>]*rel="stylesheet"[^>]*>/g, '');
  html = html.replace('</head>', `<style>${css.replace(/<\/style/gi, '<\\/style')}</style>\n</head>`);
  await writeFile('dist/app.html', html);
  let home = html.replace('<div id="root"></div>', `<div id="root" data-prerendered="true">${renderHome()}</div>`);
  if (home === html) throw new Error('Homepage root was not found');
  const particleSource = (await readFile('src/particles.ts', 'utf8')).replace('export function mountParticles', 'function mountParticles');
  const { code } = await transformWithEsbuild(`${particleSource}\nconst canvas = document.querySelector('[data-particles]'); if (canvas) mountParticles(canvas);`, 'particles.ts', { loader: 'ts', minify: true, format: 'iife' });
  const hash = `sha256-${createHash('sha256').update(code).digest('base64')}`;
  const config = JSON.parse(await readFile('vercel.json', 'utf8'));
  const csp = config.headers.flatMap(rule => rule.headers).find(header => header.key === 'Content-Security-Policy').value;
  if (!csp.includes(`'${hash}'`)) throw new Error(`Add '${hash}' to the deployment script-src policy before releasing the inline particle script.`);
  home = home.replace(/<script\b[^>]*type="module"[^>]*>[\s\S]*?<\/script>/g, '');
  home = home.replace('</body>', `<script>${code}</script>\n</body>`);
  await writeFile('dist/index.html', home);
} finally {
  await rm(serverBuild, { recursive: true, force: true });
}
