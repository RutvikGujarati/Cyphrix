import React from 'react';
import { motion } from 'framer-motion';
import auditsData from '../Data/audits.json';
import { ExternalLink } from 'lucide-react';

const AuditList: React.FC = () => {
    return (
        <section className="py-5 position-relative">
            <div className="container">
                <div className="row justify-content-center mb-5">
                    <div className="col-lg-8 text-center">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                        >
                            <h2 className="display-5 fw-bold text-white mb-3">Security Audits</h2>
                            <p className="lead text-white-50">Transparancy and rigor in every line of code we review.</p>
                        </motion.div>
                    </div>
                </div>

                <div className="table-responsive">
                    <table className="table table-dark table-hover align-middle" style={{ background: 'transparent', '--bs-table-bg': 'transparent', '--bs-table-hover-bg': 'rgba(255,255,255,0.05)' } as React.CSSProperties}>
                        <thead>
                            <tr className="border-bottom border-white border-opacity-10 text-uppercase small tracking-widest text-secondary">
                                <th scope="col" className="py-3 ps-4">Protocol</th>
                                <th scope="col" className="py-3">Date</th>
                                <th scope="col" className="py-3 text-center">Findings</th>
                                <th scope="col" className="py-3 text-end pe-4">Report</th>
                            </tr>
                        </thead>
                        <tbody>
                            {auditsData.map((audit, index) => (
                                <motion.tr
                                    key={audit.id}
                                    initial={{ opacity: 0, y: 10 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: index * 0.1 }}
                                    className="border-bottom border-white border-opacity-10"
                                >
                                    <td className="py-4 ps-4">
                                        <div className="fw-bold text-white">{audit.protocol}</div>
                                        <div className="small text-white-50">{audit.client}</div>
                                    </td>
                                    <td className="py-4 text-white-50 font-monospace small">{audit.date}</td>
                                    <td className="py-4 text-center">
                                        <div className="d-flex justify-content-center gap-3">
                                            {audit.issues?.critical > 0 && <span className="badge bg-danger bg-opacity-10 text-danger border border-danger border-opacity-25">{audit.issues.critical} Crit</span>}
                                            {audit.issues?.high > 0 && <span className="badge bg-warning bg-opacity-10 text-warning border border-warning border-opacity-25">{audit.issues.high} High</span>}
                                            {audit.issues?.medium > 0 && <span className="badge bg-info bg-opacity-10 text-info border border-info border-opacity-25">{audit.issues.medium} Med</span>}
                                            {audit.issues?.critical === 0 && audit.issues?.high === 0 && audit.issues?.medium === 0 && <span className="badge bg-success bg-opacity-10 text-success border border-success border-opacity-25">Clean</span>}
                                        </div>
                                    </td>
                                    <td className="py-4 text-end pe-4">
                                        <a
                                            href={audit.link}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="btn btn-sm btn-outline-light rounded-pill px-3 opacity-75 hover-scale"
                                        >
                                            View <ExternalLink size={14} className="ms-1" />
                                        </a>
                                    </td>
                                </motion.tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </section>
    );
};

export default AuditList;
