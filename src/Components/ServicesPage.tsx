import React, { useState, useMemo, useEffect, useRef, type JSX } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import servicesData from '../Data/services.json';
import { 
    ShieldCheck, Link, Zap, Lock, Cpu, Coins, Binary, Layers, 
    Network, CheckCircle, Shield, Layout, UserCheck, Webhook, 
    Infinity, Component, ClipboardList, ArrowRight, Code2, ShieldAlert, TestTube2
} from 'lucide-react';
import SecurityCTA from './SecurityCTA';

const ServicesPage: React.FC = () => {
    const [activeTab, setActiveTab] = useState<'Development' | 'Security' | 'QA'>('Development');
    const sectionRef = useRef<HTMLDivElement>(null);

    const data = servicesData as any;

    const categories = [
        { id: 'Development', icon: <Code2 size={18} />, label: 'Development' }, // Shortened for mobile
        { id: 'Security', icon: <ShieldAlert size={18} />, label: 'Security' },
        { id: 'QA', icon: <TestTube2 size={18} />, label: 'Assurance' }
    ];

    // Auto-scroll to top of services when category changes
    useEffect(() => {
        if (sectionRef.current) {
            const yOffset = -140; // Offset for sticky header
            const y = sectionRef.current.getBoundingClientRect().top + window.pageYOffset + yOffset;
            window.scrollTo({ top: y, behavior: 'smooth' });
        }
    }, [activeTab]);

    const getIcon = (iconName: string) => {
        const iconProps = { size: 24 };
        const iconMap: Record<string, JSX.Element> = {
            'FileCode': <Binary {...iconProps} />,
            'ShieldCheck': <ShieldCheck {...iconProps} />,
            'Globe': <Network {...iconProps} />,
            'Zap': <Zap {...iconProps} />,
            'MonitorSmartphone': <Layers {...iconProps} />,
            'CloudCog': <Cpu {...iconProps} />,
            'Sparkles': <Link {...iconProps} />,
            'Network': <Lock {...iconProps} />,
            'Coins': <Coins {...iconProps} />,
            'CheckCircle': <CheckCircle {...iconProps} />,
            'Shield': <Shield {...iconProps} />,
            'Layout': <Layout {...iconProps} />,
            'UserCheck': <UserCheck {...iconProps} />,
            'Webhook': <Webhook {...iconProps} />,
            'Infinity': <Infinity {...iconProps} />,
            'Component': <Component {...iconProps} />,
            'ClipboardList': <ClipboardList {...iconProps} />
        };
        return iconMap[iconName] || <ShieldCheck {...iconProps} />;
    };

    const categorizedServices = useMemo(() => {
        return {
            Development: data.services.filter((s: any) => [1, 2, 4, 5, 6, 7].includes(s.id)),
            Security: data.services.filter((s: any) => [3, 8, 11].includes(s.id)),
            QA: data.services.filter((s: any) => [9, 10, 12, 13, 14, 15, 16, 17].includes(s.id))
        };
    }, [data.services]);

    const activeServices = categorizedServices[activeTab];

    return (
        <div className="services-page">
            <header className="page-hero" style={{ paddingBottom: '20px' }}>
                <motion.div 
                    className="container"
                    animate={{ opacity: 1, y: 0 }}
                    
                >
                    <span className="section-label">Engineering Hub</span>
                    <h1 style={{ fontSize: 'clamp(32px, 8vw, 72px)' }}>Our <span className="text-gradient">Core Matrix</span></h1>
                    <p style={{ maxWidth: '700px', margin: '24px auto', fontSize: '16px', color: 'var(--text-muted)' }}>
                        Precision-engineered solutions for the next generation of decentralized infrastructure.
                    </p>
                </motion.div>
            </header>

            {/* STICKY TAB SWITCHER - OPTIMIZED FOR MOBILE */}
            <div style={{ position: 'sticky', top: '70px', zIndex: 100, background: 'rgba(3, 5, 8, 0.95)', backdropFilter: 'blur(10px)', padding: '12px 0', borderBottom: '1px solid var(--border)' }}>
                <div className="container">
                    <div style={{ 
                        display: 'flex', 
                        justifyContent: 'center', 
                        gap: '8px', 
                        overflowX: 'auto', 
                        padding: '4px 0',
                        scrollbarWidth: 'none',
                        msOverflowStyle: 'none'
                    }}>
                        {categories.map((cat) => (
                            <button
                                key={cat.id}
                                onClick={() => setActiveTab(cat.id as any)}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '8px',
                                    padding: '10px 18px',
                                    borderRadius: '50px',
                                    border: '1px solid',
                                    borderColor: activeTab === cat.id ? 'var(--accent-blue)' : 'var(--border)',
                                    background: activeTab === cat.id ? 'rgba(0, 212, 255, 0.1)' : 'transparent',
                                    color: activeTab === cat.id ? '#fff' : 'var(--text-muted)',
                                    fontSize: '11px',
                                    fontWeight: '800',
                                    textTransform: 'uppercase',
                                    whiteSpace: 'nowrap',
                                    transition: 'all 0.2s ease',
                                    cursor: 'pointer'
                                }}
                            >
                                {cat.icon}
                                {cat.label}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            <section ref={sectionRef} style={{ padding: '60px 0' }}>
                <div className="container">
                    <AnimatePresence mode="wait">
                        <motion.div 
                            key={activeTab}
                            initial={{ opacity: 0, x: 10 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -10 }}
                            transition={{ duration: 0.2 }}
                            className="services-grid"
                        >
                            {activeServices.map((service: any, index: number) => (
                                <motion.div 
                                    className="service-card" 
                                    key={service.id}
                                    style={{ padding: '0', overflow: 'hidden', minHeight: '320px' }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.02 }}
                                >
                                    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                                        <div style={{ padding: '24px', background: 'rgba(255,255,255,0.02)', borderBottom: '1px solid var(--border)' }}>
                                            <div style={{ color: 'var(--accent-mint)', marginBottom: '16px' }}>
                                                {getIcon(service.icon)}
                                            </div>
                                            <h3 style={{ fontSize: '18px', fontWeight: '800', marginBottom: '4px' }}>{service.title}</h3>
                                            <p style={{ fontSize: '10px', fontWeight: '800', color: 'var(--accent-blue)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{service.tagline}</p>
                                        </div>

                                        <div style={{ padding: '24px', flex: 1 }}>
                                            <p style={{ fontSize: '13px', lineHeight: '1.6', color: 'var(--text-muted)', marginBottom: '20px' }}>
                                                {service.detail || service.summary}
                                            </p>
                                        </div>

                                        <div 
                                            style={{ padding: '16px 24px', background: 'rgba(255,255,255,0.03)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' }}
                                            onClick={() => window.location.href='/inquiry'}
                                        >
                                            <span style={{ fontSize: '10px', fontWeight: '900', letterSpacing: '0.1em' }}>INITIATE</span>
                                            <ArrowRight size={14} />
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </motion.div>
                    </AnimatePresence>
                </div>
            </section>

            <SecurityCTA />
        </div>
    );
};

export default ServicesPage;
