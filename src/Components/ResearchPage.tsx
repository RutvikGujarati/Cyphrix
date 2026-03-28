import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import researchData from '../Data/research.json';
import { ArrowUpRight, Database, Code, Cpu, ChevronLeft, ChevronRight } from 'lucide-react';
import NeuralNetworkBackground from './NeuralNetworkBackground';

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
