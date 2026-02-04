import { BrowserRouter as Router, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import Header from './Components/NavBar';
import HomePage from './Components/HomePage';
import ContactPage from './Components/ContactPage';
import { useEffect } from 'react';

// Wrapper to inject navigation into Header pending refactor
const Layout = ({ children }: { children: React.ReactNode }) => {
  const navigate = useNavigate();
  const location = useLocation();

  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  const handleNavigate = (page: 'home' | 'contact') => {
    if (page === 'home') navigate('/');
    if (page === 'contact') navigate('/inquiry');
  };

  return (
    <>
      <div className="position-fixed top-0 start-0 w-100 z-3">
        <Header onNavigate={handleNavigate} />
      </div>
      {children}
    </>
  );
};

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/inquiry" element={<ContactPage />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;