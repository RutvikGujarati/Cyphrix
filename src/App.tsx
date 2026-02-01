import 'bootstrap/dist/css/bootstrap.min.css';
import Header from './Components/NavBar';
import HeroVisual from './Components/HeroVisual';

function App() {
  return (
    <div className="bg-black text-white font-monospace" style={{ minHeight: '250vh' }}>
      <HeroVisual />

      <div className="position-fixed top-0 start-0 w-100 z-3">
        <Header />
      </div>

      <main className="position-relative">
        <section className="position-fixed bottom-0 start-0 w-100 d-flex flex-column align-items-center justify-content-end px-4 pb-5 z-2">
          <h1 className="display-1 fw-bold text-uppercase m-0 p-0 opacity-25 lh-1 text-center">
            Cyphrix Technologies
          </h1>
          <div className="mt-3 pt-3 border-top border-white border-opacity-10 opacity-50 small text-center">
            SCROLL TO INITIALIZE SECURE PROTOCOL ↓
          </div>
        </section>
      </main>

      <footer className="position-fixed bottom-0 start-0 w-100 p-4 z-3 d-flex justify-content-between opacity-25 small">
      </footer>
    </div>
  );
}

export default App;