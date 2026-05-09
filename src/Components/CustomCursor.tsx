import React, { useEffect, useState } from 'react';
import { motion, useSpring } from 'framer-motion';

const CustomCursor: React.FC = () => {
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
    const [isPointer, setIsPointer] = useState(false);

    const springConfig = { damping: 20, stiffness: 150, mass: 0.5 };
    const springX = useSpring(0, springConfig);
    const springY = useSpring(0, springConfig);

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            setMousePos({ x: e.clientX, y: e.clientY });
            springX.set(e.clientX);
            springY.set(e.clientY);

            const target = e.target as HTMLElement;
            setIsPointer(window.getComputedStyle(target).cursor === 'pointer');
        };

        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, [springX, springY]);

    return (
        <>
            {/* The Dot (Instant) */}
            <div 
                className="cursor-dot" 
                style={{ 
                    left: `${mousePos.x}px`, 
                    top: `${mousePos.y}px`,
                    transform: isPointer ? 'translate(-50%, -50%) scale(1.5)' : 'translate(-50%, -50%)'
                }} 
            />
            
            {/* The Ring (Lagging with Spring) */}
            <motion.div 
                className="cursor-ring"
                style={{ 
                    left: 0,
                    top: 0,
                    width: isPointer ? 60 : 40,
                    height: isPointer ? 60 : 40,
                    borderColor: isPointer ? 'var(--accent-mint)' : 'rgba(0, 255, 204, 0.4)',
                    background: isPointer ? 'rgba(0, 255, 204, 0.05)' : 'transparent'
                }}
            />
        </>
    );
};

export default CustomCursor;
