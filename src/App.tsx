import { BrowserRouter as Router, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import Header from './Components/NavBar';
import HomePage from './Components/HomePage';
import ContactPage from './Components/ContactPage';
import ProjectsPage from './Components/ProjectsPage';
import { useEffect } from 'react';
import Footer from './Components/Footer';
import ResearchPage from './Components/ResearchPage';

import RequestAuditPage from './Components/RequestAuditPage';
import ServicesPage from './Components/ServicesPage';
import FlowOfAuditPage from './Components/FlowOfAuditPage';
import PartnerWithUsPage from './Components/PartnerWithUsPage';
import ThreeBackground from './Components/ThreeBackground';

// Wrapper to inject navigation into Header pending refactor
const Layout = ({ children }: { children: React.ReactNode }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const { pathname, hash } = location;
  useEffect(() => {
    const section = hash && document.getElementById(hash.slice(1));
    if (section) {
      section.scrollIntoView();
    } else {
      window.scrollTo(0, 0);
    }
  }, [pathname, hash]);

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
      <ThreeBackground />
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
      <Layout>
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
      </Layout>
    </Router>
  );
}

export default App;
