import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { motion } from 'framer-motion';
import projectsData from '../Data/projects.json';
import { ArrowRight, Activity, ShieldCheck, Cpu } from 'lucide-react';
import AuditList from './AuditList';
import Testimonials from './Testimonials';

const ProjectsPage: React.FC = () => {
    const mountRef = useRef<HTMLDivElement>(null);
    const OBJECT_SPACING = 10;

    useEffect(() => {
        if (!mountRef.current) return;

        const scene = new THREE.Scene();

        // --- Static Starfield ---
        const starGeometry = new THREE.BufferGeometry();
        const starCount = 4000;
        const starPos = new Float32Array(starCount * 3);

        for (let i = 0; i < starCount * 3; i++) {
            starPos[i] = (Math.random() - 0.5) * 200;
        }

        starGeometry.setAttribute('position', new THREE.BufferAttribute(starPos, 3));
        const starMaterial = new THREE.PointsMaterial({
            size: 0.1,
            color: 0xffffff,
            transparent: true,
            opacity: 0.5,
            sizeAttenuation: true
        });
        const starField = new THREE.Points(starGeometry, starMaterial);
        scene.add(starField);

        const camera = new THREE.PerspectiveCamera(65, window.innerWidth / window.innerHeight, 0.1, 1000);
        camera.position.z = 8;

        // Safety check: clear any existing canvas to prevent duplicates
        while (mountRef.current.firstChild) {
            mountRef.current.removeChild(mountRef.current.firstChild);
        }

        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); // Limit pixel ratio for performance
        mountRef.current.appendChild(renderer.domElement);

        const ambientLight = new THREE.AmbientLight(0xffffff, 0.8); // Increased from 0.5
        scene.add(ambientLight);

        const pointLight = new THREE.PointLight(0x00f2ff, 1.5, 50);
        pointLight.position.set(5, 10, 5);
        scene.add(pointLight);

        const secondaryLight = new THREE.PointLight(0xff0066, 1.5, 50);
        secondaryLight.position.set(-5, -10, 5);
        scene.add(secondaryLight);

        let scrollY = window.scrollY;

        const handleScroll = () => {
            scrollY = window.scrollY;
        };

        window.addEventListener('scroll', handleScroll);

        const animate = () => {
            requestAnimationFrame(animate);
            const H = window.innerHeight;

            // Camera Scroll Sync Logic
            // Intro (80vh) + Sections (80vh each)
            // Slope tuned for 0.8H sections
            const targetCameraY = - (scrollY / H) * (OBJECT_SPACING / 0.85) + (1.5 * OBJECT_SPACING);

            camera.position.y += (targetCameraY - camera.position.y) * 0.1;

            renderer.render(scene, camera);
        };

        animate();

        const handleResize = () => {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        };
        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('scroll', handleScroll);
            window.removeEventListener('resize', handleResize);
            if (mountRef.current && renderer.domElement) {
                mountRef.current.removeChild(renderer.domElement);
            }
            // Cleanup
            starGeometry.dispose();
            renderer.dispose();
        };
    }, []);

    const getProjectIcon = (id: number) => {
        if (id === 1) return <Activity size={20} />;
        if (id === 2) return <Cpu size={20} />;
        return <ShieldCheck size={20} />;
    };

    return (
        <div className="position-relative w-100 bg-black text-white" style={{ overflowX: 'hidden' }}>

            {/* Background Layer */}
            <div
                ref={mountRef}
                className="position-fixed top-0 start-0 w-100 h-100"
                style={{
                    zIndex: 0,
                    pointerEvents: 'none',
                    background: 'radial-gradient(circle at center, #0a0a0a 0%, #000 90%)'
                }}
            />

            {/* Content Layer */}
            <div className="position-relative" style={{ zIndex: 1, paddingBottom: '20vh' }}>

                {/* Intro Screen */}
                <div className="container d-flex flex-column align-items-center justify-content-center text-center" style={{ height: '80vh' }}>
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.8 }}
                    >
                        <h1 className="display-1 fw-bold text-uppercase tracking-widest mb-4" style={{ textShadow: '0 0 40px rgba(0,242,255,0.2)' }}>
                            <span className="text-white">Our</span> <span style={{ color: '#00f2ff' }}>Work</span>
                        </h1>
                        <div className="d-flex align-items-center justify-content-center gap-3 opacity-50 small tracking-widest mb-5">
                            <span>INNOVATION</span> // <span>SCALE</span> // <span>SECURITY</span>
                        </div>
                        <ArrowRight className="text-white animate-bounce opacity-75" size={24} style={{ transform: 'rotate(90deg)' }} />
                    </motion.div>
                </div>

                {/* Projects Loop */}
                {projectsData.map((project, index) => (
                    <section
                        key={project.id}
                        className="py-5 d-flex align-items-center"
                        style={{
                            minHeight: '80vh',
                            position: 'relative'
                        }}
                    >
                        <div className="container">
                            <div className={`row align-items-center ${index % 2 !== 0 ? 'flex-row-reverse' : ''}`}>

                                {/* 1. Content Card */}
                                <div className="col-lg-5">
                                    <motion.div
                                        initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
                                        whileInView={{ opacity: 1, x: 0 }}
                                        viewport={{ margin: "-20%" }}
                                        transition={{ duration: 0.5 }}
                                    >
                                        <div className="mb-4">
                                            <span className="text-uppercase tracking-widest small fw-bold" style={{ color: project.color }}>
                                                // Project 0{index + 1}
                                            </span>
                                            <h2 className="display-4 fw-bold mt-2 mb-3">{project.title}</h2>
                                            <p className="lead text-white-50" style={{ fontSize: '1.1rem' }}>
                                                {project.description}
                                            </p>
                                        </div>

                                        <div className="glass-card-sm p-4 mb-4" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)' }}>
                                            <h6 className="text-uppercase small tracking-widest text-secondary mb-3">Technologies</h6>
                                            <div className="d-flex flex-wrap gap-2">
                                                {project.techStack.map(tech => (
                                                    <span
                                                        key={tech}
                                                        className="px-2 py-1 small rounded border border-secondary text-secondary"
                                                        style={{ background: 'transparent' }}
                                                    >
                                                        {tech}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>

                                        {(project as any).link && (
                                            <a
                                                href={(project as any).link}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="btn btn-outline-light rounded-pill px-4 py-2 small fw-bold text-uppercase tracking-widest d-inline-flex align-items-center gap-2 hover-scale"
                                                style={{ borderColor: 'rgba(255,255,255,0.2)' }}
                                            >
                                                Visit Project <ArrowRight size={16} />
                                            </a>
                                        )}
                                    </motion.div>
                                </div>

                                {/* 2. Spacer Column (Visual Balance) */}
                                <div className="col-lg-2"></div>

                                {/* 3. Stats / Details Card */}
                                <div className="col-lg-5 text-end d-none d-lg-block">
                                    <motion.div
                                        initial={{ opacity: 0, x: index % 2 === 0 ? 30 : -30 }} // Intro opposite side
                                        whileInView={{ opacity: 1, x: 0 }}
                                        viewport={{ margin: "-20%" }}
                                        transition={{ duration: 0.5, delay: 0.2 }}
                                        className={`d-flex flex-column ${index % 2 === 0 ? 'align-items-end' : 'align-items-start'}`}
                                    >
                                        <div className="p-4 rounded-4" style={{ background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(5px)', border: '1px solid rgba(255,255,255,0.05)', maxWidth: '300px' }}>
                                            <div className="d-flex align-items-center gap-3 mb-4 text-white-50">
                                                {getProjectIcon(project.id)}
                                                <span className="small text-uppercase tracking-widest">Key Metrics</span>
                                            </div>

                                            <div className="d-flex flex-column gap-4">
                                                {project.stats && project.stats.map((stat, i) => (
                                                    <div key={i} className={index % 2 === 0 ? 'text-end' : 'text-start'}>
                                                        <h3 className="display-6 fw-bold m-0" style={{ color: project.color }}>{stat.value}</h3>
                                                        <p className="small text-white-50 m-0 text-uppercase tracking-widest">{stat.label}</p>
                                                    </div>
                                                ))}
                                            </div>

                                        </div>
                                    </motion.div>
                                </div>

                            </div>
                        </div>
                    </section>
                ))}

                {/* New Sections: Audits & Feedback */}
                <div className="position-relative z-2">
                    <div className="py-5">
                        <AuditList />
                    </div>
                    <div className="py-5 border-top border-white border-opacity-10">
                        <Testimonials />
                    </div>
                </div>

            </div>
        </div>
    );
};

export default ProjectsPage;
