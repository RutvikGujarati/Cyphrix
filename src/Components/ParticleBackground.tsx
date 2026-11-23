import { memo, useEffect, useRef } from 'react';
import { mountParticles } from '../particles';

function ParticleBackground() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    useEffect(() => {
        if (canvasRef.current) return mountParticles(canvasRef.current);
    }, []);
    return <canvas ref={canvasRef} className="three-canvas-container" aria-hidden="true" style={{ width: '100%', height: '100%' }} />;
}

export default memo(ParticleBackground);
