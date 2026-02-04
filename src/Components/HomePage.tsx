import { useEffect, useState, useRef, useCallback } from 'react';
import HeroVisual from './HeroVisual';
import BeyondSection from './BeyondSection';

const SCROLL_THRESHOLD = 800;

export default function HomePage() {
    const [logoProgress, setLogoProgress] = useState(0);
    const [isLocked, setIsLocked] = useState(true);
    const virtualY = useRef(0);
    const touchStartY = useRef(0);

    // Unified logic to update progress
    const updateProgress = useCallback((delta: number) => {
        virtualY.current += delta;
        virtualY.current = Math.max(0, Math.min(SCROLL_THRESHOLD, virtualY.current));

        const currentProgress = virtualY.current / SCROLL_THRESHOLD;
        setLogoProgress(currentProgress);
    }, []);

    useEffect(() => {
        if (logoProgress < 1) {
            setIsLocked(true);
        }
    }, [logoProgress]);

    const handleVisualComplete = useCallback(() => {
        setIsLocked(false);
    }, []);

    const handleWheel = useCallback((e: WheelEvent) => {
        if (isLocked || (window.scrollY <= 0 && e.deltaY < 0)) {
            if (e.cancelable) e.preventDefault();
            updateProgress(e.deltaY);
        }
    }, [isLocked, updateProgress]);

    const handleTouchStart = (e: TouchEvent) => {
        touchStartY.current = e.touches[0].clientY;
    };

    const handleTouchMove = useCallback((e: TouchEvent) => {
        if (isLocked || (window.scrollY <= 0)) {
            const currentY = e.touches[0].clientY;
            const deltaY = touchStartY.current - currentY;
            touchStartY.current = currentY;

            if (isLocked || deltaY < 0) {
                if (e.cancelable) e.preventDefault();
                updateProgress(deltaY * 1.5);
            }
        }
    }, [isLocked, updateProgress]);

    useEffect(() => {
        window.scrollTo(0, 0);
        window.addEventListener('wheel', handleWheel, { passive: false });
        window.addEventListener('touchstart', handleTouchStart, { passive: true });
        window.addEventListener('touchmove', handleTouchMove, { passive: false });

        return () => {
            window.removeEventListener('wheel', handleWheel);
            window.removeEventListener('touchstart', handleTouchStart);
            window.removeEventListener('touchmove', handleTouchMove);
        };
    }, [handleWheel, handleTouchMove]);

    return (
        <div className={`bg-black text-white font-monospace overflow-x-hidden ${isLocked ? 'vh-100' : ''}`}
            style={{
                minHeight: isLocked ? '100vh' : '200vh',
                msOverflowStyle: 'none',
                scrollbarWidth: 'none'
            }}>

            <div className="position-fixed top-0 start-0 w-100 h-100 z-0">
                <HeroVisual logoProgress={logoProgress} onVisualComplete={handleVisualComplete} />
            </div>

            {isLocked && (
                <section className="position-fixed bottom-0 start-0 w-100 d-flex flex-column align-items-center justify-content-end px-4 pb-5 z-2"
                    style={{ opacity: Math.max(0, 1 - logoProgress * 2), pointerEvents: 'none' }}>
                    <h1 className="display-4 fw-bold text-uppercase m-0 p-0 opacity-25 text-center">
                        Cyphrix Technologies
                    </h1>
                    <div className="mt-3 pt-3 border-top border-white border-opacity-10 opacity-50 small text-center text-uppercase">
                        {logoProgress < 0.9 ? 'Swipe to Initialize' : 'Security Ready'}
                    </div>
                </section>
            )}

            <main className="position-relative z-1">
                <div className="vh-100" />
                {!isLocked && (
                    <div className="min-vh-100 bg-black" style={{ animation: 'fadeIn 1s ease-in-out' }}>
                        <BeyondSection />
                    </div>
                )}
            </main>

            <footer className="position-fixed bottom-0 start-0 w-100 p-4 z-3 d-flex justify-content-between opacity-25 small pointer-event-none">
                <div>PROTOCOL: <span className={isLocked ? "text-warning" : "text-info"}>
                    {isLocked ? "GATED" : "ACTIVE"}
                </span></div>
                <div className="fw-bold">{Math.round(logoProgress * 100)}%</div>
            </footer>
        </div>
    );
}
