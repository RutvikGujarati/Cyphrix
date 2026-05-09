import React, { memo } from 'react';
import testimonialsData from '../Data/testimonials.json';
import { Quote, Star } from 'lucide-react';
import { motion } from 'framer-motion';

const TestimonialItem = memo(({ testimonial }: { testimonial: any }) => (
    <motion.div 
        
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        className="service-card" 
        style={{ padding: '48px' }}
    >
        <div style={{ display: 'flex', gap: '4px', marginBottom: '24px', color: 'var(--accent-gold)' }}>
            {[...Array(5)].map((_, i) => (
                <Star key={i} size={14} fill="currentColor" />
            ))}
        </div>
        
        <p style={{ fontSize: '18px', fontStyle: 'italic', lineHeight: '1.7', color: '#fff', marginBottom: '40px' }}>
            "{testimonial.quote}"
        </p>

        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginTop: 'auto', paddingTop: '32px', borderTop: '1px solid var(--border)' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'var(--accent-blue)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '900', color: '#000' }}>
                {testimonial.author.charAt(0)}
            </div>
            <div>
                <h4 style={{ fontSize: '16px', margin: 0, fontWeight: '800' }}>{testimonial.author}</h4>
                <p style={{ fontSize: '12px', margin: 0, color: 'var(--text-muted)' }}>{testimonial.role} • {testimonial.company}</p>
            </div>
        </div>

        <Quote size={40} style={{ position: 'absolute', top: '40px', right: '40px', opacity: 0.05 }} />
    </motion.div>
));

const Testimonials: React.FC = () => {
    return (
        <section style={{ padding: '80px 0' }}>
            <div className="container">
                <div className="services-grid">
                    {testimonialsData.map((testimonial) => (
                        <TestimonialItem key={testimonial.id} testimonial={testimonial} />
                    ))}
                </div>
            </div>
        </section>
    );
};

export default memo(Testimonials);
