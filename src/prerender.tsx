import { renderToStaticMarkup } from 'react-dom/server';
import { MemoryRouter } from 'react-router-dom';
import NavBar from './Components/NavBar';
import HomePage from './Components/HomePage';
import Footer from './Components/Footer';

export function renderHome() {
  return renderToStaticMarkup(
    <MemoryRouter initialEntries={['/']}>
      <div className="app-container min-vh-100">
        <canvas data-particles="" className="three-canvas-container" aria-hidden="true" style={{width: '100%', height: '100%'}} />
        <div className="bg-layer-extra" />
        <div className="bg-layer-nodes" />
        <NavBar onNavigate={() => {}} />
        <main><HomePage /></main>
        <Footer />
      </div>
    </MemoryRouter>,
  );
}
