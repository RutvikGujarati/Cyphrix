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

// Wrapper to inject navigation into Header pending refactor
const Layout = ({ children }: { children: React.ReactNode }) => {
  const navigate = useNavigate();
  const location = useLocation();

  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  const handleNavigate = (page: 'home' | 'projects' | 'contact' | 'research' | 'audit') => {
    if (page === 'home') navigate('/');
    if (page === 'projects') navigate('/projects');
    if (page === 'contact') navigate('/inquiry');
    if (page === 'research') navigate('/research');
    if (page === 'audit') navigate('/request-audit');
  };

  return (
    <div className="app-container bg-black min-vh-100">
      <div className="position-fixed top-0 start-0 w-100 z-3">
        <Header onNavigate={handleNavigate} />
      </div>
      {children}
      {location.pathname !== '/' && <Footer />}
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
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;