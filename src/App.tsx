import { BrowserRouter as Router, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import Header from './Components/NavBar';
import HomePage from './Components/HomePage';
import { lazy, Suspense, useEffect, useState } from 'react';
import Footer from './Components/Footer';
import PageMetadata from './Components/PageMetadata';
const ContactPage = lazy(() => import('./Components/ContactPage'));
const ProjectsPage = lazy(() => import('./Components/ProjectsPage'));
const ResearchPage = lazy(() => import('./Components/ResearchPage'));
const RequestAuditPage = lazy(() => import('./Components/RequestAuditPage'));
const ServicesPage = lazy(() => import('./Components/ServicesPage'));
const FlowOfAuditPage = lazy(() => import('./Components/FlowOfAuditPage'));
const PartnerWithUsPage = lazy(() => import('./Components/PartnerWithUsPage'));
const ParticleBackground = lazy(() => import('./Components/ParticleBackground'));

function Background() {
  const [ready, setReady] = useState(false);
  useEffect(() => {
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (motion.matches) return;
    if (typeof window.requestIdleCallback === 'function') {
      const id = window.requestIdleCallback(() => setReady(true));
      return () => window.cancelIdleCallback(id);
    }
    const id = window.setTimeout(() => setReady(true), 1000);
    return () => window.clearTimeout(id);
  }, []);
  return ready ? <Suspense fallback={null}><ParticleBackground /></Suspense> : null;
}

function ScrollToSection() {
  const { pathname, hash } = useLocation();
  useEffect(() => {
    const section = hash && document.getElementById(hash.slice(1));
    if (section) {
      section.scrollIntoView();
    } else {
      window.scrollTo(0, 0);
    }
  }, [pathname, hash]);
  return null;
}

// Wrapper to inject navigation into Header pending refactor
const Layout = ({ children }: { children: React.ReactNode }) => {
  const navigate = useNavigate();

  const handleNavigate = (page: 'home' | 'projects' | 'contact' | 'research' | 'audit' | 'services' | 'flowofaudit' | 'partnerwithus') => {
    if (page === 'home') navigate('/');
    if (page === 'projects') navigate('/projects');
    if (page === 'contact') navigate('/inquiry');
    if (page === 'research') navigate('/research');
    if (page === 'audit') navigate('/request-audit');
    if (page === 'services') navigate('/services');
    if (page === 'flowofaudit') navigate('/flowofaudit');
    if (page === 'partnerwithus') navigate('/partnerwithus');
  };

  return (
    <div className="app-container min-vh-100">
      <Background />
      <div className="bg-layer-extra"></div>
      <div className="bg-layer-nodes"></div>
      <Header onNavigate={handleNavigate} />
      <main>
        {children}
      </main>
      <Footer />
    </div>
  );
};

function App() {
  return (
    <Router>
      <PageMetadata />
      <Layout>
        <Suspense fallback={<div className="route-loading" role="status">Loading page…</div>}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/projects" element={<ProjectsPage />} />
          <Route path="/research" element={<ResearchPage />} />
          <Route path="/inquiry" element={<ContactPage />} />
          <Route path="/request-audit" element={<RequestAuditPage />} />
          <Route path="/services" element={<ServicesPage />} />
          <Route path="/flowofaudit" element={<FlowOfAuditPage />} />
          <Route path="/partnerwithus" element={<PartnerWithUsPage />} />
        </Routes>
        <ScrollToSection />
        </Suspense>
      </Layout>
    </Router>
  );
}

export default App;
