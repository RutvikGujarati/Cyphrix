import React, { memo } from 'react';
import auditsData from '../Data/audits.json';
import { ExternalLink, FileText } from 'lucide-react';
import { motion } from 'framer-motion';

const AuditItem = memo(({ audit }: { audit: any }) => (
    <motion.div 
        
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-20px" }}
        className="service-card" 
        style={{ 
            padding: '24px 40px', 
            flexDirection: 'row', 
            alignItems: 'center', 
            justifyContent: 'space-between',
            minHeight: 'auto'
        }}
    >
        <div style={{ display: 'flex', alignItems: 'center', gap: '24px', flex: 1 }}>
            <div style={{ width: '48px', height: '48px', background: 'rgba(0, 255, 204, 0.05)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent-mint)' }}>
                <FileText size={20} />
            </div>
            <div>
                <h3 style={{ fontSize: '18px', margin: 0, fontWeight: '800' }}>{audit.protocol}</h3>
                <p style={{ fontSize: '12px', margin: 0, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{audit.client} • {audit.date}</p>
            </div>
        </div>

        <div style={{ display: 'flex', gap: '12px', flex: 1, justifyContent: 'center' }}>
            {audit.issues?.critical > 0 && (
                <span className="tag" style={{ color: '#ff4d4d', borderColor: 'rgba(255, 77, 77, 0.2)', background: 'rgba(255, 77, 77, 0.05)' }}>{audit.issues.critical} CRITICAL</span>
            )}
            {audit.issues?.high > 0 && (
                <span className="tag" style={{ color: '#ffb800', borderColor: 'rgba(255, 184, 0, 0.2)', background: 'rgba(255, 184, 0, 0.05)' }}>{audit.issues.high} HIGH</span>
            )}
            {audit.issues?.critical === 0 && audit.issues?.high === 0 && (
                <span className="tag" style={{ color: 'var(--accent-mint)', borderColor: 'rgba(0, 255, 204, 0.2)', background: 'rgba(0, 255, 204, 0.05)' }}>SECURE ✓</span>
            )}
        </div>

        <div style={{ flex: 1, display: 'flex', justifyContent: 'flex-end' }}>
            <a 
                href={audit.link} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="tag"
                style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', transition: '0.3s' }}
            >
                REPORT <ExternalLink size={14} />
            </a>
        </div>
    </motion.div>
));

const AuditList: React.FC = () => {
    return (
        <section style={{ padding: '40px 0 100px' }}>
            <div className="container">
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    {auditsData.map((audit) => (
                        <AuditItem key={audit.id} audit={audit} />
                    ))}
                </div>
            </div>
        </section>
    );
};

export default memo(AuditList);
