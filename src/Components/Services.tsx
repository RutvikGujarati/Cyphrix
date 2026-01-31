import React from 'react';
import './Services.css';

interface ServiceProps {
    title: string;
    description: string;
    tags: string[];
    icon?: string;
    index?: number;
}

const ServiceCard: React.FC<ServiceProps> = ({ title, description, tags, icon, index = 0 }) => {
    return (
        <div className="col-lg-4 col-md-6 mb-4" style={{ animationDelay: `${index * 0.1}s` }}>
            <div className="service-card glass-card p-4 h-100 d-flex flex-column">
                {/* Icon Header */}
                <div className="service-header mb-3">
                    {icon && <div className="service-icon">{icon}</div>}
                    <h4 className="service-title fw-bold mb-0">{title}</h4>
                </div>
                
                {/* Description */}
                <p className="service-description text-white-50 small flex-grow-1 mb-3">
                    {description}
                </p>
                
                {/* Tags */}
                <div className="service-tags mt-auto">
                    {tags.map((tag, idx) => (
                        <span 
                            key={tag} 
                            className="service-tag"
                            style={{ animationDelay: `${(index * 0.1) + (idx * 0.05)}s` }}
                        >
                            {tag}
                        </span>
                    ))}
                </div>
                
                {/* Hover Arrow */}
                <div className="service-arrow">
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                        <path 
                            d="M4 10H16M16 10L10 4M16 10L10 16" 
                            stroke="currentColor" 
                            strokeWidth="2" 
                            strokeLinecap="round" 
                            strokeLinejoin="round"
                        />
                    </svg>
                </div>
            </div>
        </div>
    );
};

export default ServiceCard;