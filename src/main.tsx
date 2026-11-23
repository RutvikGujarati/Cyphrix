import 'bootstrap/dist/css/bootstrap.min.css'
import './index.css'
import { mountParticles } from './particles'

function start() {
  const root = document.getElementById('root')!;
  if (window.location.pathname === '/' && root.dataset.prerendered === 'true') {
    const canvas = document.querySelector<HTMLCanvasElement>('[data-particles]');
    if (canvas) mountParticles(canvas);
  } else {
    void import('./client');
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', start, { once: true });
} else {
  start();
}
