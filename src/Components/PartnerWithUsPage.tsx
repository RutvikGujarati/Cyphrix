import { motion } from "framer-motion";
import { Handshake, CircleCheckBig, BadgeDollarSign } from "lucide-react";

const eligibility = [
  "The referred client must be a new protocol/entity.",
  "Referral must be communicated before initial scoping.",
  "Applicable only after the first milestone payment.",
];

const payments = [
  "Commission paid within 72h of client settlement.",
  "Processed via Stablecoins (USDC/USDT) or Bank Transfer.",
  "Milestone-based payouts for complex multi-phase audits.",
];

const PartnerWithUsPage = () => {
  const revealVariant = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: "easeOut" },
    },
  };

  const containerVariant = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  return (
    <div className="partner-page">
      <header className="page-hero">
        <motion.div
          className="container"
          animate="visible"
          variants={revealVariant}
        >
          <span className="section-label">Partnership Program</span>
          <h1>
            Partner With <span className="text-gradient">Cyphrix</span>
          </h1>
          <p
            style={{
              maxWidth: "700px",
              margin: "24px auto",
              fontSize: "18px",
              color: "var(--text-muted)",
            }}
          >
            Earn a{" "}
            <span style={{ color: "var(--accent-mint)", fontWeight: "800" }}>
              10% commission
            </span>{" "}
            on every successful protocol referral. Help us harden the Web3
            ecosystem.
          </p>
        </motion.div>
      </header>

      <section style={{ padding: "80px 0" }}>
        <div className="container">
          <motion.div
            style={{
              display: "flex",
              gap: "48px",
              justifyContent: "center",
              flexWrap: "wrap",
              marginBottom: "80px",
            }}
            animate="visible"
            variants={containerVariant}
          >
            <motion.div
              style={{ textAlign: "center" }}
              animate="visible"
              variants={revealVariant}
            >
              <div
                style={{
                  fontSize: "3rem",
                  fontWeight: "800",
                  color: "var(--accent-mint)",
                }}
              >
                10%
              </div>
              <div
                style={{
                  fontSize: "12px",
                  fontWeight: "800",
                  color: "var(--text-muted)",
                  textTransform: "uppercase",
                  letterSpacing: "0.1em",
                }}
              >
                Commission Rate
              </div>
            </motion.div>
            <motion.div
              style={{ textAlign: "center" }}
              animate="visible"
              variants={revealVariant}
            >
              <div
                style={{
                  fontSize: "3rem",
                  fontWeight: "800",
                  color: "var(--accent-blue)",
                }}
              >
                $20k+
              </div>
              <div
                style={{
                  fontSize: "12px",
                  fontWeight: "800",
                  color: "var(--text-muted)",
                  textTransform: "uppercase",
                  letterSpacing: "0.1em",
                }}
              >
                Avg. Referral Value
              </div>
            </motion.div>
            <motion.div
              style={{ textAlign: "center" }}
              animate="visible"
              variants={revealVariant}
            >
              <div
                style={{
                  fontSize: "3rem",
                  fontWeight: "800",
                  color: "var(--accent-gold)",
                }}
              >
                Fast
              </div>
              <div
                style={{
                  fontSize: "12px",
                  fontWeight: "800",
                  color: "var(--text-muted)",
                  textTransform: "uppercase",
                  letterSpacing: "0.1em",
                }}
              >
                Settlement
              </div>
            </motion.div>
          </motion.div>

          <motion.div
            className="service-card"
            style={{ marginBottom: "64px" }}
            animate="visible"
            variants={revealVariant}
          >
            <h3
              style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                marginBottom: "24px",
              }}
            >
              <Handshake size={24} color="var(--accent-mint)" /> Referral
              Program Overview
            </h3>
            <p
              style={{
                color: "var(--text-muted)",
                fontSize: "18px",
                lineHeight: "1.7",
              }}
            >
              We reward individuals and ecosystem partners who help us secure
              new protocols. If your referral signs a project agreement, you
              receive a{" "}
              <span style={{ color: "var(--accent-mint)", fontWeight: "700" }}>
                10% commission
              </span>{" "}
              on the total audit value, paid instantly upon client settlement.
            </p>
          </motion.div>

          <motion.div
            className="services-grid"
            style={{ marginBottom: "64px" }}
            animate="visible"
            variants={containerVariant}
          >
            <motion.div
              className="service-card"
              animate="visible"
              variants={revealVariant}
            >
              <div className="s-icon">
                <CircleCheckBig size={24} />
              </div>
              <h3>Eligibility</h3>
              <div style={{ marginTop: "24px" }}>
                {eligibility.map((item, i) => (
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "12px",
                      marginBottom: "16px",
                    }}
                    key={i}
                  >
                    <div
                      style={{
                        width: "6px",
                        height: "6px",
                        borderRadius: "50%",
                        background: "var(--accent-mint)",
                      }}
                    ></div>
                    <span
                      style={{
                        fontSize: "14px",
                        fontWeight: "600",
                        color: "var(--text-muted)",
                      }}
                    >
                      {item}
                    </span>
                  </div>
                ))}
              </div>
            </motion.div>
            <motion.div
              className="service-card"
              animate="visible"
              variants={revealVariant}
            >
              <div className="s-icon">
                <BadgeDollarSign size={24} />
              </div>
              <h3>Commission Payouts</h3>
              <div style={{ marginTop: "24px" }}>
                {payments.map((item, i) => (
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "12px",
                      marginBottom: "16px",
                    }}
                    key={i}
                  >
                    <div
                      style={{
                        width: "6px",
                        height: "6px",
                        borderRadius: "50%",
                        background: "var(--accent-blue)",
                      }}
                    ></div>
                    <span
                      style={{
                        fontSize: "14px",
                        fontWeight: "600",
                        color: "var(--text-muted)",
                      }}
                    >
                      {item}
                    </span>
                  </div>
                ))}
              </div>
            </motion.div>
          </motion.div>

          <motion.div
            className="service-card"
            style={{ textAlign: "center", marginBottom: "80px" }}
            animate="visible"
            variants={revealVariant}
          >
            <h3 style={{ marginBottom: "16px", color: "var(--accent-gold)" }}>
              Example Calculation
            </h3>
            <p style={{ fontSize: "20px", color: "var(--text-muted)" }}>
              On a{" "}
              <span style={{ color: "#fff", fontWeight: "800" }}>$15,000</span>{" "}
              project, your referral commission will be{" "}
              <span style={{ color: "var(--accent-mint)", fontWeight: "800" }}>
                $1,500 (10%)
              </span>
              .
            </p>
          </motion.div>
        </div>
      </section>

      <motion.div
        className="cta-section"
        style={{ textAlign: "center" }}
        animate="visible"
        variants={revealVariant}
      >
        <div className="container">
          <span className="section-label">Join the Network</span>
          <h2>Start Referring Today</h2>
          <p
            style={{
              maxWidth: "600px",
              margin: "24px auto 40px",
              color: "var(--text-muted)",
              fontSize: "18px",
            }}
          >
            Connect with our partnership team to join the Cyphrix network and
            start securing protocol incentives.
          </p>
          <div style={{ display: "flex", justifyContent: "center" }}>
            <a
              href="mailto:cyphrixsupport@cyphrixtech.com"
              className="nav-cta"
              style={{ padding: "16px 48px" }}
            >
              cyphrixsupport@cyphrixtech.com
            </a>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default PartnerWithUsPage;
