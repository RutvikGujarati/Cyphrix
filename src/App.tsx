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
        <section className="min-vh-100 d-flex flex-column justify-content-end px-4 px-lg-5 pb-5">
          <div className="position-relative z-2">
            <div className="d-flex gap-4 mb-3 opacity-50 small tracking-widest fw-bold">
              <span>[ 01_INFRASTRUCTURE ]</span>
            </div>

            <h1 className="fw-bold text-uppercase m-0 p-0" 
                style={{ fontSize: 'clamp(3rem, 16vw, 18rem)', lineHeight: '0.8', letterSpacing: '-0.06em', color: 'rgba(255, 255, 255, 0.8)' }}>
              Cyphrix<br />Technologies
            </h1>

            <div className="row mt-4 pt-4 border-top border-white border-opacity-10 opacity-40">
              <div className="col-12 small tracking-widest">SCROLL TO INITIALIZE SECURE PROTOCOL ↓</div>
            </div>
          </div>
        </section>

        <section className="min-vh-100 d-flex align-items-center px-4 px-lg-5">
           <div className="col-lg-5 border-start border-info ps-4 opacity-75">
              <h2 className="h1 fw-bold text-uppercase mb-4">Securing the Mesh</h2>
              <p className="small ls-1 text-secondary">
             
              </p>
           </div>
        </section>
      </main>

      <footer className="position-fixed bottom-0 start-0 w-100 p-4 z-3 d-flex justify-content-between opacity-25 small">
      </footer>
    </div>
  );
}

export default App;