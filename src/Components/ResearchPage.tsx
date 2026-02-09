import React, { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import * as THREE from 'three';
import researchData from '../Data/research.json';
import { ArrowUpRight, Database, Code, Cpu, ChevronLeft, ChevronRight } from 'lucide-react';

const NeuralNetworkBackground: React.FC = () => {
    const mountRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const mount = mountRef.current;
        if (!mount) return;

        let width = mount.clientWidth;
        let height = mount.clientHeight;

        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
        camera.position.z = 50;

        const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
        renderer.setSize(width, height);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        mount.appendChild(renderer.domElement);

        // Nodes (Neurons)
        const particleCount = 60;
        const geometry = new THREE.BufferGeometry();
        const positions = new Float32Array(particleCount * 3);
        const velocities: { x: number, y: number, z: number }[] = [];

        for (let i = 0; i < particleCount; i++) {
            positions[i * 3] = (Math.random() - 0.5) * 100;
            positions[i * 3 + 1] = (Math.random() - 0.5) * 100;
            positions[i * 3 + 2] = (Math.random() - 0.5) * 50;
            velocities.push({
                x: (Math.random() - 0.5) * 0.1,
                y: (Math.random() - 0.5) * 0.1,
                z: (Math.random() - 0.5) * 0.05
            });
        }

        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        const material = new THREE.PointsMaterial({
            color: 0x00f2ff,
            size: 0.8,
            transparent: true,
            opacity: 0.8
        });
        const particles = new THREE.Points(geometry, material);
        scene.add(particles);

        // Connections (Synapses)
        const lineMaterial = new THREE.LineBasicMaterial({
            color: 0x00f2ff,
            transparent: true,
            opacity: 0.15
        });

        const linesGeometry = new THREE.BufferGeometry();
        const lines = new THREE.LineSegments(linesGeometry, lineMaterial);
        scene.add(lines);

        const animate = () => {
            requestAnimationFrame(animate);

            // Update positions
            const positionsArray = particles.geometry.attributes.position.array as Float32Array;
            for (let i = 0; i < particleCount; i++) {
                positionsArray[i * 3] += velocities[i].x;
                positionsArray[i * 3 + 1] += velocities[i].y;
                positionsArray[i * 3 + 2] += velocities[i].z; // 3D movement

                // Bounce off boundaries or wrap around? Let's buffer bounce
                if (Math.abs(positionsArray[i * 3]) > 60) velocities[i].x *= -1;
                if (Math.abs(positionsArray[i * 3 + 1]) > 40) velocities[i].y *= -1;
                if (Math.abs(positionsArray[i * 3 + 2]) > 30) velocities[i].z *= -1;
            }
            particles.geometry.attributes.position.needsUpdate = true;

            // Update connections
            const linePositions: number[] = [];
            const connectionDistance = 25;

            for (let i = 0; i < particleCount; i++) {
                for (let j = i + 1; j < particleCount; j++) {
                    const dx = positionsArray[i * 3] - positionsArray[j * 3];
                    const dy = positionsArray[i * 3 + 1] - positionsArray[j * 3 + 1];
                    const dz = positionsArray[i * 3 + 2] - positionsArray[j * 3 + 2];
                    const distSq = dx * dx + dy * dy + dz * dz;

                    if (distSq < connectionDistance * connectionDistance) {
                        linePositions.push(
                            positionsArray[i * 3], positionsArray[i * 3 + 1], positionsArray[i * 3 + 2],
                            positionsArray[j * 3], positionsArray[j * 3 + 1], positionsArray[j * 3 + 2]
                        );
                    }
                }
            }
            lines.geometry.setAttribute('position', new THREE.Float32BufferAttribute(linePositions, 3));

            // Subtle rotation
            particles.rotation.y += 0.001;
            lines.rotation.y += 0.001;

            renderer.render(scene, camera);
        };

        animate();

        const handleResize = () => {
            if (!mount) return;
            width = mount.clientWidth;
            height = mount.clientHeight;
            renderer.setSize(width, height);
            camera.aspect = width / height;
            camera.updateProjectionMatrix();
        };

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
            if (mount) mount.removeChild(renderer.domElement);
            geometry.dispose();
            material.dispose();
            lineMaterial.dispose();
            linesGeometry.dispose();
            renderer.dispose();
        };
    }, []);

    return <div ref={mountRef} className="position-absolute w-100 h-100 top-0 start-0 z-0" style={{ pointerEvents: 'none' }} />;
};

const ResearchPage: React.FC = () => {
    const scrollContainerRef = useRef<HTMLDivElement>(null);

    const scroll = (direction: 'left' | 'right') => {
        if (scrollContainerRef.current) {
            const scrollAmount = 450;
            scrollContainerRef.current.scrollBy({
                left: direction === 'right' ? scrollAmount : -scrollAmount,
                behavior: 'smooth'
            });
        }
    };

    return (
        <div className="bg-black text-white min-vh-100 position-relative d-flex flex-column overflow-hidden">
            {/* 3D Background */}
            <NeuralNetworkBackground />

            {/* Gradient Overlay for Readability */}
            <div className="position-absolute w-100 h-100 top-0 start-0 z-0"
                style={{ background: 'radial-gradient(circle at center, transparent 0%, #000 90%)', pointerEvents: 'none' }}
            />

            <div className="position-relative z-1 flex-grow-1 d-flex flex-column justify-content-center">
                {/* Header Section - Added explicit top padding to clear Navbar */}
                <div className="container" style={{ paddingTop: '160px' }}>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="text-center mb-5"
                    >
                        <span className="badge border border-info text-info rounded-pill px-3 py-2 mb-3 bg-transparent">LABORATORY // RESTRICTED</span>
                        <h1 className="display-3 fw-bold text-uppercase tracking-tighter mb-4">
                            Research <span className="text-info">&</span> Development
                        </h1>
                        <p className="lead text-white-50 mx-auto" style={{ maxWidth: '600px' }}>
                            Pushing the boundaries of decentralized technology. Exploring new primitives, scalability solutions, and security paradigms.
                        </p>
                    </motion.div>
                </div>

                {/* Horizontal Cards Section */}
                <div className="container-fluid py-4 position-relative">
                    {/* Scroll Buttons */}
                    <div className="container position-relative d-flex justify-content-end gap-2 mb-3">
                        <button
                            onClick={() => scroll('left')}
                            className="btn btn-outline-light rounded-circle p-2 d-flex align-items-center justify-content-center hover-bg-white hover-text-black transition-all"
                            style={{ width: '40px', height: '40px' }}
                        >
                            <ChevronLeft size={20} />
                        </button>
                        <button
                            onClick={() => scroll('right')}
                            className="btn btn-outline-light rounded-circle p-2 d-flex align-items-center justify-content-center hover-bg-white hover-text-black transition-all"
                            style={{ width: '40px', height: '40px' }}
                        >
                            <ChevronRight size={20} />
                        </button>
                    </div>

                    {/* Cards Container */}
                    <div
                        ref={scrollContainerRef}
                        className="d-flex align-items-stretch overflow-x-auto gap-4 px-4 px-lg-5 pb-5 hide-scrollbar"
                        style={{
                            scrollBehavior: 'smooth',
                            scrollbarWidth: 'none',
                            msOverflowStyle: 'none'
                        }}
                    >
                        {researchData.map((item, index) => (
                            <div key={item.id} className="flex-shrink-0" style={{ width: '400px' }}>
                                <motion.div
                                    className="p-4 rounded-4 border border-white border-opacity-10 bg-black bg-opacity-75 backdrop-blur-md h-100 d-flex flex-column shadow-lg"
                                    whileHover={{ scale: 1.02, borderColor: 'rgba(0, 242, 255, 0.5)', backgroundColor: 'rgba(0,0,0,0.9)' }}
                                    transition={{ duration: 0.3 }}
                                >
                                    <div className="d-flex justify-content-between align-items-start mb-4">
                                        <div className="p-2 rounded bg-white bg-opacity-10">
                                            {index % 3 === 0 ? <Database size={24} className="text-info" /> :
                                                index % 3 === 1 ? <Cpu size={24} className="text-warning" /> :
                                                    <Code size={24} className="text-success" />}
                                        </div>
                                        <span className={`badge rounded-pill bg-opacity-25 ${item.status === 'Published' ? 'bg-success text-success' :
                                            item.status === 'In Progress' ? 'bg-warning text-warning' :
                                                'bg-info text-info'
                                            }`}>
                                            {item.status}
                                        </span>
                                    </div>

                                    <h3 className="h4 fw-bold mb-3">{item.title}</h3>
                                    <p className="text-white-50 small mb-4 flex-grow-1">
                                        {item.description}
                                    </p>

                                    <div className="mt-auto">
                                        <div className="d-flex flex-wrap gap-2 mb-3">
                                            {item.tags.map(tag => (
                                                <span key={tag} className="small text-white-50 border border-white border-opacity-10 px-2 py-1 rounded">
                                                    #{tag}
                                                </span>
                                            ))}
                                        </div>
                                        <a href={item.link} className="btn btn-sm btn-outline-light w-100 d-flex align-items-center justify-content-center gap-2 group">
                                            <span>Read Paper</span>
                                            <ArrowUpRight size={14} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                                        </a>
                                    </div>
                                </motion.div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <style>
                {`
                .hide-scrollbar::-webkit-scrollbar {
                    display: none;
                }
                `}
            </style>
        </div>
    );
};

export default ResearchPage;
