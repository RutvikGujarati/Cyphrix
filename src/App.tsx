import { BrowserRouter as Router, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import Header from './Components/NavBar';
import HomePage from './Components/HomePage';
import { lazy, Suspense, useEffect } from 'react';
import Footer from './Components/Footer';
import CustomCursor from './Components/CustomCursor';
import RouteTransition from './Components/RouteTransition';
import { SecurityExperienceProvider } from './experience/SecurityExperience';
import './living-system.css';
import './route-experience.css';
import './visual-polish.css';

const ContactPage = lazy(() => import('./Components/ContactPage'));
const ProjectsPage = lazy(() => import('./Components/ProjectsPage'));
const ResearchPage = lazy(() => import('./Components/ResearchPage'));
const RequestAuditPage = lazy(() => import('./Components/RequestAuditPage'));
const ServicesPage = lazy(() => import('./Components/ServicesPage'));
const FlowOfAuditPage = lazy(() => import('./Components/FlowOfAuditPage'));
const PartnerWithUsPage = lazy(() => import('./Components/PartnerWithUsPage'));

// Wrapper to inject navigation into Header pending refactor
const Layout = ({ children }: { children: React.ReactNode }) => {
  const navigate = useNavigate();
  const location = useLocation();

  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

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
    <SecurityExperienceProvider pathname={location.pathname}>
      <div className="app-container">
        <CustomCursor />
        <Header onNavigate={handleNavigate} />
        <RouteTransition routeKey={location.pathname} />
        <main key={location.pathname} className="route-stage">
          {children}
        </main>
        <Footer />
      </div>
    </SecurityExperienceProvider>
  );
};

function App() {
  return (
    <Router>
      <Layout>
        <Suspense fallback={<div className="route-loading" aria-live="polite">Loading secure route…</div>}>
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
        </Suspense>
      </Layout>
    </Router>
  );
}

export default App;
