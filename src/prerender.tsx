import { renderToStaticMarkup } from 'react-dom/server';
import { MemoryRouter } from 'react-router-dom';
import NavBar from './Components/NavBar';
import HomePage from './Components/HomePage';
import Footer from './Components/Footer';
import { MotionConfig } from 'framer-motion';
import ServicesPage from './Components/ServicesPage';
import ProjectsPage from './Components/ProjectsPage';
import ResearchPage from './Components/ResearchPage';
import ContactPage from './Components/ContactPage';
import RequestAuditPage from './Components/RequestAuditPage';
import FlowOfAuditPage from './Components/FlowOfAuditPage';
import PartnerWithUsPage from './Components/PartnerWithUsPage';
export { pages, getPage, siteUrl, socialImage, structuredData } from './seo';

const routeComponents = {
  '/': HomePage, '/services': ServicesPage, '/projects': ProjectsPage,
  '/research': ResearchPage, '/inquiry': ContactPage,
  '/request-audit': RequestAuditPage, '/flowofaudit': FlowOfAuditPage,
  '/partnerwithus': PartnerWithUsPage,
};

export function renderPage(pathname: keyof typeof routeComponents) {
  const Page = routeComponents[pathname];
  return renderToStaticMarkup(
    <MemoryRouter initialEntries={[pathname]}>
      <MotionConfig reducedMotion="always">
      <div className="app-container min-vh-100">
        <canvas data-particles="" className="three-canvas-container" aria-hidden="true" style={{width: '100%', height: '100%'}} />
        <div className="bg-layer-extra" />
        <div className="bg-layer-nodes" />
        <NavBar onNavigate={() => {}} />
        <main><Page /></main>
        <Footer />
      </div>
      </MotionConfig>
    </MemoryRouter>,
  );
}
