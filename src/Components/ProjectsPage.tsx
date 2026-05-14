import React, { memo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import projectsData from "../Data/projects.json";
import { Activity, ShieldCheck, Cpu, ExternalLink, X } from "lucide-react";
import AuditList from "./AuditList";
import Testimonials from "./Testimonials";
import SecurityCTA from "./SecurityCTA";

const ProjectCard = memo(({ project, getProjectIcon, onOpen }: any) => (
  <motion.div
    className="service-card"
    style={{ cursor: "pointer", height: "100%", minHeight: "280px" }}
    whileHover={{ translateY: -10 }}
    onClick={() => onOpen(project)}
    whileInView={{ opacity: 1, y: 0 }}
  >
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "flex-start",
        marginBottom: "32px",
      }}
    >
      <div className="s-icon" style={{ margin: 0 }}>
        {getProjectIcon(project.id)}
      </div>
    </div>

    <h3
      style={{
        fontSize: "24px",
        fontWeight: "800",
        marginBottom: "12px",
        color: "#fff",
      }}
    >
      {project.title}
    </h3>
    <p
      style={{
        fontSize: "14px",
        color: "var(--text-muted)",
        marginBottom: "24px",
        lineHeight: "1.6",
      }}
    >
      {project.tagline}
    </p>

    <div
      style={{
        marginTop: "auto",
        display: "flex",
        alignItems: "center",
        gap: "8px",
        fontSize: "11px",
        color: "var(--accent-mint)",
        fontWeight: "800",
        letterSpacing: "0.05em",
      }}
    >
      CLICK TO VIEW ARCHITECTURE
    </div>
  </motion.div>
));

const ProjectsPage: React.FC = () => {
  const [selectedProject, setSelectedProject] = useState<any>(null);

  const getProjectIcon = (id: number) => {
    if (id === 1) return <Activity size={24} />;
    if (id === 2) return <Cpu size={24} />;
    return <ShieldCheck size={24} />;
  };

  return (
    <div className="projects-page">
      <header className="page-hero">
        <motion.div
          className="container"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <span className="section-label">Institutional Portfolio</span>
          <h1>
            Engineered <span className="text-gradient">Case Studies</span>
          </h1>
          <p
            style={{
              maxWidth: "700px",
              margin: "24px auto",
              fontSize: "20px",
              color: "var(--text-muted)",
            }}
          >
            Deep-dive security analysis and high-performance infrastructure
            deployments for industry-leading protocols.
          </p>
        </motion.div>
      </header>

      <section style={{ padding: "80px 0" }}>
        <div className="container">
          <div className="services-grid">
            {projectsData.map((project, index) => (
              <ProjectCard
                key={project.id}
                project={project}
                index={index}
                getProjectIcon={getProjectIcon}
                onOpen={setSelectedProject}
              />
            ))}
          </div>
        </div>
      </section>

      {/* MODAL SYSTEM */}
      <AnimatePresence>
        {selectedProject && (
          <motion.div
            className="modal-overlay"
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedProject(null)}
            style={{ zIndex: 99999, pointerEvents: "auto" }}
          >
            <motion.div
              className="modal-content"
              initial={{ scale: 0.9, opacity: 0, y: 50 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 50 }}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                className="modal-close"
                onClick={() => setSelectedProject(null)}
              >
                <X size={20} />
              </button>

              <div className="modal-body">
                <span
                  className="section-label"
                  style={{ marginBottom: "16px" }}
                >
                  Technical Analysis
                </span>
                <h2
                  style={{
                    fontSize: "32px",
                    marginBottom: "24px",
                    color: "#fff",
                  }}
                >
                  {selectedProject.title}
                </h2>
                <p
                  style={{
                    fontSize: "16px",
                    color: "var(--text-muted)",
                    lineHeight: "1.8",
                    marginBottom: "40px",
                  }}
                >
                  {selectedProject.description}
                </p>

                <div style={{ marginBottom: "40px" }}>
                  <p
                    style={{
                      fontSize: "12px",
                      fontWeight: "900",
                      color: "#fff",
                      marginBottom: "16px",
                      textTransform: "uppercase",
                      letterSpacing: "0.1em",
                    }}
                  >
                    Core Stack
                  </p>
                  <div
                    style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}
                  >
                    {selectedProject.techStack.map((tech: string) => (
                      <span
                        key={tech}
                        className="tag"
                        style={{
                          background: "rgba(255,255,255,0.05)",
                          fontSize: "11px",
                        }}
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
                    gap: "16px",
                    marginBottom: "48px",
                  }}
                >
                  {selectedProject.stats?.map((stat: any, i: number) => (
                    <div
                      key={i}
                      className="project-stat-box"
                      style={{
                        background: "rgba(0, 255, 204, 0.03)",
                        padding: "20px",
                      }}
                    >
                      <div
                        style={{
                          fontSize: "10px",
                          color: "var(--text-muted)",
                          textTransform: "uppercase",
                          fontWeight: "800",
                          letterSpacing: "0.05em",
                          marginBottom: "8px",
                        }}
                      >
                        {stat.label}
                      </div>
                      <div
                        style={{
                          fontSize: "14px",
                          fontWeight: "800",
                          color: "var(--accent-mint)",
                        }}
                      >
                        {stat.value}
                      </div>
                    </div>
                  ))}
                </div>

                {selectedProject.link && (
                  <a
                    href={selectedProject.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-primary"
                    style={{
                      width: "100%",
                      textAlign: "center",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "12px",
                      padding: "18px",
                      textDecoration: "none",
                    }}
                  >
                    {selectedProject.id === 4
                      ? "VIEW FULL REPORT SUITE"
                      : "EXPLORE PROTOCOL"}{" "}
                    <ExternalLink size={18} />
                  </a>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Audit & Testimonials */}
      <div
        style={{
          padding: "100px 0",
          background: "rgba(0, 255, 204, 0.02)",
          borderTop: "1px solid var(--border)",
        }}
      >
        <div
          className="container"
          style={{ textAlign: "center", marginBottom: "80px" }}
        >
          <span className="section-label">Historical Record</span>
          <h2>Audit Integrity Registry</h2>
        </div>
        <AuditList />
      </div>

      <div style={{ padding: "100px 0", borderTop: "1px solid var(--border)" }}>
        <div
          className="container"
          style={{ textAlign: "center", marginBottom: "80px" }}
        >
          <span className="section-label">Protocol Partners</span>
          <h2>Trust from the Core</h2>
        </div>
        <Testimonials />
      </div>

      <SecurityCTA />
    </div>
  );
};

export default ProjectsPage;
