import { memo, useEffect, useRef } from 'react';

function ParticleBackground() {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        const context = canvas?.getContext('2d');
        if (!canvas || !context) return;

        const particles = Array.from({ length: 100 }, () => ({
            x: (Math.random() - 0.5) * 20,
            y: (Math.random() - 0.5) * 20,
            z: (Math.random() - 0.5) * 10,
        }));
        const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
        let frame = 0;
        let lastTime = 0;
        let elapsed = 0;
        let width = 0;
        let height = 0;

        function resize() {
            width = window.innerWidth;
            height = window.innerHeight;
            const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
            canvas!.width = Math.round(width * dpr);
            canvas!.height = Math.round(height * dpr);
            context!.setTransform(dpr, 0, 0, dpr, 0, 0);
        }

        function draw(time: number) {
            if (document.hidden) return;
            if (lastTime) elapsed += Math.min(time - lastTime, 100);
            lastTime = time;
            const angle = motion.matches ? 0 : elapsed * 0.00005;
            const cosine = Math.cos(angle);
            const sine = Math.sin(angle);
            const scale = height / (2 * Math.tan(Math.PI / 8));
            context!.clearRect(0, 0, width, height);
            context!.fillStyle = 'rgba(0, 212, 255, 0.12)';
            for (const particle of particles) {
                const depth = 10 - (particle.z * cosine - particle.x * sine);
                const x = width / 2 + (particle.x * cosine + particle.z * sine) * scale / depth;
                const y = height / 2 - (particle.y - window.scrollY * 0.0004) * scale / depth;
                context!.beginPath();
                context!.arc(x, y, Math.max(0.4, 0.015 * scale / depth), 0, Math.PI * 2);
                context!.fill();
            }
            if (!motion.matches) frame = requestAnimationFrame(draw);
        }

        function restart() {
            cancelAnimationFrame(frame);
            lastTime = 0;
            if (!document.hidden) frame = requestAnimationFrame(draw);
        }

        function onResize() {
            resize();
            restart();
        }

        resize();
        restart();
        window.addEventListener('resize', onResize);
        document.addEventListener('visibilitychange', restart);
        motion.addEventListener('change', restart);
        return () => {
            cancelAnimationFrame(frame);
            window.removeEventListener('resize', onResize);
            document.removeEventListener('visibilitychange', restart);
            motion.removeEventListener('change', restart);
        };
    }, []);

    return <canvas ref={canvasRef} className="three-canvas-container" aria-hidden="true" style={{ width: '100%', height: '100%' }} />;
}

export default memo(ParticleBackground);
