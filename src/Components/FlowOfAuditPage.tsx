import { motion } from "framer-motion";
import {
  ClipboardCheck,
  Search,
  FlaskConical,
  Binary,
  FileText,
  BadgeCheck,
  ShieldAlert,
  Activity,
} from "lucide-react";
import SecurityCTA from "./SecurityCTA";

const detailedSteps = [
  {
    id: "1",
    title: "Specification gathering / prepare for a security audit",
    body: "This is the most crucial stage because detail is key for a successful smart contract security audit. Here is how you can prepare for it:",
    points: [
      "Code quality",
      "Remove dead code and comments.",
      "Keep a consistent coding style.",
      "Follow the Solidity / Rust (Solana) style guide.",
      "Use comments to document complex parts of the code, and keep them consistent with the code.",
    ],
    Icon: ClipboardCheck,
    color: "var(--accent-mint)",
  },
  {
    id: "2",
    title: "Manual review",
    body: "We look for undefined or unexpected behavior and common security vulnerabilities. The goal is to get as many skilled eyes on the contract code as possible.",
    aimsTitle: "Aims of manual review:",
    aims: [
      "Focus on security, attacks, mathematical errors, logical issues, and similar risks.",
      "Check the code for vulnerabilities that can be exploited.",
      "Verify that every detail in the specification is implemented in the smart contract.",
      "Verify that the contract has no behavior that is not specified.",
      "Verify that the contract does not violate the originally intended behavior of the specifications.",
    ],
    Icon: Search,
    color: "var(--accent-blue)",
  },
  {
    id: "3",
    title: "Functional testing",
    body: "The smart contract is manually deployed in a sandbox environment (testnet, mainnet forks, Hardhat, Ganache, etc.). Functions are tested across parameters and conditions so all paths behave as intended and match the specification.",
    extra:
      "We also check that functions do not consume unnecessary gas and verify gas limits where relevant.",
    Icon: FlaskConical,
    color: "var(--accent-mint)",
  },
  {
    id: "4",
    title: "Testing against latest attack vectors",
    body: "The team researches newly discovered attacks (market manipulation, LP pricing, front-running vectors, and more) and attempts to replicate them against the project to confirm it is not vulnerable.",
    extra:
      "If a vulnerability is found, we recommend switching to a safer implementation.",
    Icon: ShieldAlert,
    color: "var(--accent-blue)",
  },
  {
    id: "5",
    title: "Testing with automated tools",
    body: "Automated tooling helps catch issues humans miss. Tools are chosen based on requirements and auditor preference. Examples include:",
    tools: [
      "Mythril / MythX",
      "Slither",
      "Solgraph",
      "Solidity Visual Developer",
      "Solidity Coverage",
    ],
    Icon: Binary,
    color: "var(--accent-mint)",
  },
  {
    id: "6",
    title: "Initial audit report",
    body: "We deliver a comprehensive Initial Audit Report (IAR): a full audit write-up and recommended fixes for any vulnerabilities found. We expect your team to resolve identified issues and adjust the code accordingly.",
    Icon: FileText,
    color: "var(--accent-blue)",
  },
  {
    id: "7",
    title: "Final audit report",
    body: "After fixes from the initial round, the process is repeated and a Final Audit Report is delivered. Some issues may remain or new ones may appear after changes. You decide—using the severity table—whether to iterate again or proceed.",
    Icon: BadgeCheck,
    color: "var(--accent-gold)",
  },
  {
    id: "8",
    title: "Delivery",
    body: "Once the previous step is cleared, the report goes to design for a polished PDF presentation of the audit.",
    footerToolsTitle: "Tools we may reference across the stack:",
    footerTools: [
      "Slither",
      "Mythril",
      "MythX",
      "Echidna",
      "Manticore",
      "Surya",
      "Remix",
      "Foundry",
      "Hardhat",
    ],
    Icon: Activity,
    color: "var(--accent-mint)",
  },
];

const FlowOfAuditPage = () => {
  const revealVariant = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  return (
    <div className="flow-audit-page">
      <header className="page-hero">
        <motion.div
          className="container"
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
        >
          <span className="section-label">Institutional Methodology</span>
          <h1>
            Flow Of <span className="text-gradient">Audit</span>
          </h1>
          <p
            style={{
              maxWidth: "700px",
              margin: "24px auto",
              fontSize: "18px",
              color: "var(--text-muted)",
            }}
          >
            How Cyphrix structures smart contract security work—from preparation
            through reporting and delivery.
          </p>
        </motion.div>
      </header>

      <section style={{ padding: "60px 0" }}>
        <div className="container">
          <div className="row g-4 mb-5">
            {/* Auditing Process Overview */}
            <motion.div
              className="col-lg-6"
              animate="visible"
              variants={revealVariant}
            >
              <div className="service-card h-100">
                <h3
                  style={{
                    fontSize: "18px",
                    color: "var(--accent-blue)",
                    marginBottom: "24px",
                    fontWeight: "800",
                  }}
                >
                  Auditing process (overview)
                </h3>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "20px",
                  }}
                >
                  <div>
                    <span
                      style={{
                        color: "var(--accent-blue)",
                        fontWeight: "900",
                        fontSize: "12px",
                        display: "block",
                        marginBottom: "4px",
                      }}
                    >
                      STEP 1
                    </span>
                    <p style={{ fontSize: "14px", margin: 0 }}>
                      Conduct an in-depth review of the smart contract code to
                      identify any potential vulnerabilities or security flaws.
                    </p>
                  </div>
                  <div>
                    <span
                      style={{
                        color: "var(--accent-blue)",
                        fontWeight: "900",
                        fontSize: "12px",
                        display: "block",
                        marginBottom: "4px",
                      }}
                    >
                      STEP 2
                    </span>
                    <p style={{ fontSize: "14px", margin: 0 }}>
                      Perform security tests and analysis to ensure the protocol
                      is safe from any type of attack.
                    </p>
                  </div>
                  <div>
                    <span
                      style={{
                        color: "var(--accent-blue)",
                        fontWeight: "900",
                        fontSize: "12px",
                        display: "block",
                        marginBottom: "4px",
                      }}
                    >
                      STEP 3
                    </span>
                    <p style={{ fontSize: "14px", margin: 0 }}>
                      Deliver a detailed audit report outlining the findings,
                      recommendations, and any necessary code fixes.
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Business Logic Review */}
            <motion.div
              className="col-lg-6"
              animate="visible"
              variants={revealVariant}
            >
              <div className="service-card h-100">
                <h3
                  style={{
                    fontSize: "18px",
                    color: "var(--accent-blue)",
                    marginBottom: "12px",
                    fontWeight: "800",
                  }}
                >
                  Business logic review
                </h3>
                <p
                  style={{
                    fontSize: "13px",
                    color: "var(--text-muted)",
                    marginBottom: "24px",
                  }}
                >
                  Typical areas we examine include:
                </p>
                <div className="row g-3">
                  <div className="col-6">
                    <ul
                      style={{
                        padding: 0,
                        listStyle: "none",
                        fontSize: "13px",
                        display: "flex",
                        flexDirection: "column",
                        gap: "12px",
                      }}
                    >
                      <li
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "10px",
                        }}
                      >
                        <div
                          style={{
                            width: "5px",
                            height: "5px",
                            background: "#fff",
                            borderRadius: "50%",
                          }}
                        ></div>{" "}
                        Functionality checks
                      </li>
                      <li
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "10px",
                        }}
                      >
                        <div
                          style={{
                            width: "5px",
                            height: "5px",
                            background: "#fff",
                            borderRadius: "50%",
                          }}
                        ></div>{" "}
                        Escrow manipulation
                      </li>
                      <li
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "10px",
                        }}
                      >
                        <div
                          style={{
                            width: "5px",
                            height: "5px",
                            background: "#fff",
                            borderRadius: "50%",
                          }}
                        ></div>{" "}
                        User balances manipulation
                      </li>
                      <li
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "10px",
                        }}
                      >
                        <div
                          style={{
                            width: "5px",
                            height: "5px",
                            background: "#fff",
                            borderRadius: "50%",
                          }}
                        ></div>{" "}
                        Kill-switch mechanism
                      </li>
                    </ul>
                  </div>
                  <div className="col-6">
                    <ul
                      style={{
                        padding: 0,
                        listStyle: "none",
                        fontSize: "13px",
                        display: "flex",
                        flexDirection: "column",
                        gap: "12px",
                      }}
                    >
                      <li
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "10px",
                        }}
                      >
                        <div
                          style={{
                            width: "5px",
                            height: "5px",
                            background: "#fff",
                            borderRadius: "50%",
                          }}
                        ></div>{" "}
                        Access control & authorization
                      </li>
                      <li
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "10px",
                        }}
                      >
                        <div
                          style={{
                            width: "5px",
                            height: "5px",
                            background: "#fff",
                            borderRadius: "50%",
                          }}
                        ></div>{" "}
                        Token supply manipulation
                      </li>
                      <li
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "10px",
                        }}
                      >
                        <div
                          style={{
                            width: "5px",
                            height: "5px",
                            background: "#fff",
                            borderRadius: "50%",
                          }}
                        ></div>{" "}
                        Data consistency manipulation
                      </li>
                      <li
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "10px",
                        }}
                      >
                        <div
                          style={{
                            width: "5px",
                            height: "5px",
                            background: "#fff",
                            borderRadius: "50%",
                          }}
                        ></div>{" "}
                        Operation trails & event generation
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Detailed Steps Header */}
          <motion.h2
            style={{
              fontSize: "24px",
              fontWeight: "800",
              margin: "80px 0 40px",
              borderBottom: "1px solid var(--border)",
              paddingBottom: "20px",
            }}
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
          >
            Detailed steps
          </motion.h2>

          {/* Detailed Steps Timeline Container */}
          <div
            style={{
              position: "relative",
              display: "flex",
              flexDirection: "column",
              gap: "48px",
            }}
          >
            {/* THE CONNECTING LINE */}
            <div
              style={{
                position: "absolute",
                top: "24px",
                left: "64px", // Aligned with the center of the number circles (40px padding + 24px half circle)
                bottom: "24px",
                width: "2px",
                background:
                  "linear-gradient(to bottom, var(--accent-mint), var(--accent-blue), var(--accent-gold), var(--accent-mint))",
                opacity: 0.2,
                zIndex: 0,
              }}
            />

            {detailedSteps.map((step) => (
              <motion.div
                key={step.id}
                className="service-card"
                style={{
                  textAlign: "left",
                  padding: "40px",
                  position: "relative",
                  zIndex: 1,
                }}
                animate="visible"
                variants={revealVariant}
              >
                <div style={{ display: "flex", gap: "32px" }}>
                  <div
                    style={{
                      width: "48px",
                      height: "48px",
                      borderRadius: "50%",
                      border: `2px solid ${step.color}`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                      fontWeight: "800",
                      color: step.color,
                      background: "var(--bg)", // Keep number background opaque to "cut" the line
                      boxShadow: `0 0 15px ${step.color}44`,
                      position: "relative",
                      zIndex: 2,
                    }}
                  >
                    {step.id}
                  </div>
                  <div style={{ flex: 1 }}>
                    <h3
                      style={{
                        fontSize: "20px",
                        fontWeight: "800",
                        marginBottom: "24px",
                      }}
                    >
                      {step.title}
                    </h3>
                    <p
                      style={{
                        fontSize: "15px",
                        color: "var(--text-muted)",
                        marginBottom: "24px",
                        lineHeight: "1.6",
                      }}
                    >
                      {step.body}
                    </p>

                    {step.points && (
                      <div
                        style={{
                          background: "rgba(255,255,255,0.02)",
                          padding: "24px",
                          borderRadius: "16px",
                          border: "1px solid var(--border)",
                        }}
                      >
                        <p
                          style={{
                            fontWeight: "800",
                            fontSize: "14px",
                            marginBottom: "16px",
                          }}
                        >
                          {step.points[0]}
                        </p>
                        <ul
                          style={{
                            padding: 0,
                            listStyle: "none",
                            display: "flex",
                            flexDirection: "column",
                            gap: "10px",
                          }}
                        >
                          {step.points.slice(1).map((p, i) => (
                            <li
                              key={i}
                              style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "12px",
                                fontSize: "14px",
                                color: "var(--text-muted)",
                              }}
                            >
                              <div
                                style={{
                                  width: "6px",
                                  height: "6px",
                                  background: step.color,
                                  borderRadius: "50%",
                                }}
                              ></div>
                              {p}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {step.aims && (
                      <div style={{ marginTop: "24px" }}>
                        <p
                          style={{
                            fontWeight: "800",
                            fontSize: "14px",
                            marginBottom: "16px",
                          }}
                        >
                          {step.aimsTitle}
                        </p>
                        <ul
                          style={{
                            padding: 0,
                            listStyle: "none",
                            display: "flex",
                            flexDirection: "column",
                            gap: "10px",
                          }}
                        >
                          {step.aims.map((a, i) => (
                            <li
                              key={i}
                              style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "12px",
                                fontSize: "14px",
                                color: "var(--text-muted)",
                              }}
                            >
                              <div
                                style={{
                                  width: "6px",
                                  height: "6px",
                                  background: step.color,
                                  borderRadius: "50%",
                                }}
                              ></div>
                              {a}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {step.extra && (
                      <p
                        style={{
                          fontSize: "14px",
                          color: "var(--text-muted)",
                          marginTop: "20px",
                        }}
                      >
                        {step.extra}
                      </p>
                    )}

                    {step.tools && (
                      <div className="row g-3 mt-2">
                        {step.tools.map((t, i) => (
                          <div key={i} className="col-md-4">
                            <div
                              style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "10px",
                                fontSize: "14px",
                              }}
                            >
                              <div
                                style={{
                                  width: "5px",
                                  height: "5px",
                                  background: step.color,
                                  borderRadius: "50%",
                                }}
                              ></div>
                              {t}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {step.footerTools && (
                      <div style={{ marginTop: "32px" }}>
                        <p
                          style={{
                            fontWeight: "800",
                            fontSize: "14px",
                            marginBottom: "16px",
                          }}
                        >
                          {step.footerToolsTitle}
                        </p>
                        <div
                          style={{
                            display: "flex",
                            flexWrap: "wrap",
                            gap: "10px",
                          }}
                        >
                          {step.footerTools.map((t, i) => (
                            <span
                              key={i}
                              className="tag"
                              style={{
                                background: "rgba(0, 255, 204, 0.05)",
                                borderColor: "rgba(0, 255, 204, 0.2)",
                                padding: "6px 16px",
                                borderRadius: "30px",
                              }}
                            >
                              {t}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Security & Cloud Assurance Box */}
          <SecurityCTA />
        </div>
      </section>
    </div>
  );
};

export default FlowOfAuditPage;
