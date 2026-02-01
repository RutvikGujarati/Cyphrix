import { useEffect, useState, useCallback } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Header from './Components/NavBar';
import HeroVisual from './Components/HeroVisual';
import BeyondSection from './Components/BeyondSection';

const SCROLL_TRANSITION = 800; // Increased for a smoother feel

function App() {
  const [transitionProgress, setTransitionProgress] = useState(0);
  const [transitionComplete, setTransitionComplete] = useState(false);
  const [showBeyond, setShowBeyond] = useState(false);

  // 1. Calculate Logo Progress (0 to 1)
  const logoProgress = Math.min(1, transitionProgress / SCROLL_TRANSITION);

  // 2. Strict Bi-directional Scroll Jack
  const handleWheel = useCallback((e: WheelEvent) => {
    // If we are at the very top and trying to morph/deshape the logo
    if (!transitionComplete || (window.scrollY <= 0 && e.deltaY < 0)) {

      // Stop the page from actually scrolling
      if (e.cancelable) e.preventDefault();

      setTransitionProgress((prev) => {
        const next = Math.max(0, Math.min(SCROLL_TRANSITION, prev + e.deltaY));

        // Only allow scrolling to the next section if logo is 100% done
        if (next >= SCROLL_TRANSITION) {
          setTransitionComplete(true);
          setShowBeyond(true);
        } else {
          setTransitionComplete(false);
          setShowBeyond(false);
        }
        return next;
      });
    }
  }, [transitionComplete]);

  useEffect(() => {
    window.addEventListener('wheel', handleWheel, { passive: false });
    return () => window.removeEventListener('wheel', handleWheel);
  }, [handleWheel]);

  // 3. Prevent scroll-jump on refresh
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div
      className="bg-black text-white font-monospace overflow-x-hidden"
      style={{
        // Logic: 100vh for the Hero, plus 100vh for BeyondSection ONLY when logo is ready
        height: transitionComplete ? '200vh' : '100vh',
        transition: 'height 0.5s ease'
      }}
    >
      {/* FIXED HEADER */}
      <div className="position-fixed top-0 start-0 w-100 z-3">
        <Header />
      </div>

      {/* HERO VISUAL: Particles */}
      <div
        className="position-fixed top-0 start-0 w-100 h-100 z-0"
        style={{
          // Fade out slightly when moving to BeyondSection
          opacity: showBeyond && window.scrollY > 100 ? 0.3 : 1,
          transition: 'opacity 1s ease',
          pointerEvents: !transitionComplete ? 'auto' : 'none'
        }}
      >
        <HeroVisual logoProgress={logoProgress} />
      </div>

      {/* HERO TITLE: Fixed until Morph is done */}
      {!transitionComplete && (
        <section
          className="position-fixed bottom-0 start-0 w-100 d-flex flex-column align-items-center justify-content-end px-4 pb-5 z-2"
          style={{
            opacity: 1 - (logoProgress * 1.5), // Fades out as logo forms
            pointerEvents: 'none'
          }}
        >
          <h1 className="display-1 fw-bold text-uppercase m-0 p-0 opacity-25 lh-1 text-center">
            Cyphrix Technologies
          </h1>
          <div className="mt-3 pt-3 border-top border-white border-opacity-10 opacity-50 small text-center">
            SCROLL TO INITIALIZE SECURE PROTOCOL ↓
          </div>
        </section>
      )}

      {/* MAIN CONTENT AREA */}
      <main className="position-relative z-1">
        {/* Empty Spacer for the Logo phase */}
        <div style={{ height: '100vh' }} />

        {/* BEYOND SECTION: Effectively enters only after transitionComplete */}
        {showBeyond && (
          <div
            style={{
              minHeight: '100vh',
              animation: 'fadeIn 1s ease forwards'
            }}
          >
            <BeyondSection />
          </div>
        )}
      </main>

      <footer className="position-fixed bottom-0 start-0 w-100 p-4 z-3 d-flex justify-content-between opacity-25 small pointer-events-none">
        <div> {logoProgress < 1 ? 'MORPHING' : 'STABLE'}</div>
        <div>{Math.round(logoProgress * 100)}% COMPLETE</div>
      </footer>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(50px); }
          to { opacity: 1; transform: translateY(0); }
        }
        body {
          scrollbar-width: none; /* Firefox */
          -ms-overflow-style: none;  /* IE/Edge */
        }
        body::-webkit-scrollbar {
          display: none; /* Chrome/Safari */
        }
      `}</style>
    </div>
  );
}

export default App;