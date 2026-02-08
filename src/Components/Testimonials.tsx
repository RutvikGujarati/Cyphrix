import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import testimonialsData from '../Data/testimonials.json';
import { Quote, Star } from 'lucide-react';

const Testimonials: React.FC = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start end", "end start"]
    });

    const y = useTransform(scrollYProgress, [0, 1], [0, -50]);

    return (
        <section ref={containerRef} className="py-5 position-relative overflow-hidden">
            {/* Dynamic Background */}
            {/* Dynamic Background Removed */}

            <div className="container position-relative z-1 py-5">
                <div className="row justify-content-center mb-5">
                    <div className="col-lg-8 text-center">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6 }}
                        >
                            <span className="text-info small tracking-widest text-uppercase fw-bold mb-2 d-block">
                                // Trust & Reliability
                            </span>
                            <h2 className="display-4 fw-bold text-white mb-3 text-uppercase" style={{ letterSpacing: '-1px' }}>
                                Client <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-secondary">Feedback</span>
                            </h2>
                            <p className="lead text-white-50 mx-auto" style={{ maxWidth: '600px' }}>
                                Securing the future of Web3, one protocol at a time.
                            </p>
                        </motion.div>
                    </div>
                </div>

                <div className="row g-4">
                    {testimonialsData.map((testimonial, index) => (
                        <div key={testimonial.id} className="col-lg-4 col-md-6">
                            <motion.div
                                initial={{ opacity: 0, y: 40 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.15, duration: 0.5 }}
                                style={{ y: index % 2 === 1 ? y : 0 }}
                                className="h-100 p-0 position-relative group"
                            >
                                {/* Card Glow Effect */}
                                <div className="position-absolute -inset-1 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-4 opacity-0 group-hover:opacity-20 transition duration-500 blur-lg" />

                                <div className="h-100 p-4 rounded-4 position-relative border border-white border-opacity-10 d-flex flex-column hover-lift transition-all duration-300"
                                    style={{
                                        background: 'rgba(255, 255, 255, 0.03)',
                                        backdropFilter: 'blur(10px)',
                                        boxShadow: '0 4px 30px rgba(0, 0, 0, 0.1)'
                                    }}
                                >
                                    {/* Quote Icon Background */}
                                    <Quote
                                        className="position-absolute top-0 end-0 text-white opacity-5 m-3"
                                        size={80}
                                        style={{ transform: 'rotate(180deg)' }}
                                    />

                                    {/* Stars */}
                                    <div className="d-flex gap-1 mb-4 text-warning opacity-75">
                                        {[...Array(5)].map((_, i) => (
                                            <Star key={i} size={14} fill="currentColor" />
                                        ))}
                                    </div>

                                    <p className="text-white opacity-90 mb-4 position-relative z-1 fst-italic" style={{ fontSize: '1.05rem', lineHeight: '1.7' }}>
                                        "{testimonial.quote}"
                                    </p>

                                    <div className="d-flex align-items-center gap-3 mt-auto pt-4 border-top border-white border-opacity-5">
                                        <div className="rounded-circle d-flex align-items-center justify-content-center text-black fw-bold position-relative overflow-hidden"
                                            style={{ width: '48px', height: '48px', background: '#ccc' }}>
                                            {/* Placeholder Avatar Gradient if no image */}
                                            <div className="w-100 h-100 position-absolute top-0 start-0 bg-gradient-to-br from-white to-gray-400" />
                                            <span className="position-relative z-1">{testimonial.author.charAt(0)}</span>
                                        </div>
                                        <div>
                                            <h6 className="text-white mb-0 fw-bold tracking-wide">{testimonial.author}</h6>
                                            <small className="text-white-50 d-block mt-1" style={{ fontSize: '0.75rem' }}>
                                                {testimonial.role} <span className="mx-1 text-secondary">•</span> {testimonial.company}
                                            </small>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Testimonials;
