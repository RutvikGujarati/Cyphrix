import { motion } from 'framer-motion';
import NeuralNetworkBackground from './NeuralNetworkBackground';
import './FlowOfAuditPage.css';

const overviewSteps = [
  {
    title: 'Step 1',
    text: 'Conduct an in-depth review of the smart contract code to identify any potential vulnerabilities or security flaws.',
  },
  {
    title: 'Step 2',
    text: 'Perform security tests and analysis to ensure the protocol is safe from any type of attack.',
  },
  {
    title: 'Step 3',
    text: 'Deliver a detailed audit report outlining the findings, recommendations, and any necessary code fixes.',
  },
];

const businessLogicAreas = [
  'Functionality checks',
  'Access control & authorization',
  'Escrow manipulation',
  'Token supply manipulation',
  'User balances manipulation',
  'Data consistency manipulation',
  'Kill-switch mechanism',
  'Operation trails & event generation',
];

const automatedTools = [
  'Mythril / MythX',
  'Solgraph',
  'Solidity Coverage',
  'Slither',
  'Solidity Visual Developer',
];

const toolsFooter = ['Slither', 'Mythril', 'MythX', 'Echidna', 'Manticore', 'Surya', 'Remix', 'Foundry', 'Hardhat'];

const steps = [
  {
    id: '1',
    title: 'Specification gathering / prepare for a security audit',
    body: (
      <>
        <p>
          This is the most crucial stage because detail is key for a successful smart contract security audit. Here is how you can prepare for it:
        </p>
        <h4 className="flow-audit-subheading">Code quality</h4>
        <ul>
          <li>Remove dead code and comments.</li>
          <li>Keep a consistent coding style.</li>
          <li>Follow the Solidity / Rust (Solana) style guide.</li>
          <li>Use comments to document complex parts of the code, and keep them consistent with the code.</li>
        </ul>
        <h4 className="flow-audit-subheading">Test the code</h4>
        <ul>
          <li>Make sure the contracts compile and are fully tested.</li>
          <li>Perform high coverage and high-quality unit tests so auditing can focus on difficult parts of the code.</li>
          <li>
            Auditing should not discover that some functions are uncallable or do not behave as expected under straightforward inputs. Optimal auditing focuses on unexpected, corner-case, and possibly adversarial behavior.
          </li>
        </ul>
        <h4 className="flow-audit-subheading">Code freeze</h4>
        <ul>
          <li>Freeze the code and specify the commit hash, or deploy on testnet and share the link.</li>
        </ul>
      </>
    ),
  },
  {
    id: '2',
    title: 'Manual review',
    body: (
      <>
        <p>
          We look for undefined or unexpected behavior and common security vulnerabilities. The goal is to get as many skilled eyes on the contract code as possible.
        </p>
        <p className="mb-2"><strong>Aims of manual review:</strong></p>
        <ul>
          <li>Focus on security, attacks, mathematical errors, logical issues, and similar risks.</li>
          <li>Check the code for vulnerabilities that can be exploited.</li>
          <li>Verify that every detail in the specification is implemented in the smart contract.</li>
          <li>Verify that the contract has no behavior that is not specified.</li>
          <li>Verify that the contract does not violate the originally intended behavior of the specifications.</li>
        </ul>
      </>
    ),
  },
  {
    id: '3',
    title: 'Functional testing',
    body: (
      <>
        <p>
          The smart contract is manually deployed in a sandbox environment (testnet, mainnet forks, Hardhat, Ganache, etc.). Functions are tested across parameters and conditions so all paths behave as intended and match the specification.
        </p>
        <p>
          We also check that functions do not consume unnecessary gas and verify gas limits where relevant.
        </p>
      </>
    ),
  },
  {
    id: '4',
    title: 'Testing against latest attack vectors',
    body: (
      <>
        <p>
          The team researches newly discovered attacks (market manipulation, LP pricing, front-running vectors, and more) and attempts to replicate them against the project to confirm it is not vulnerable.
        </p>
        <p>If a vulnerability is found, we recommend switching to a safer implementation.</p>
      </>
    ),
  },
  {
    id: '5',
    title: 'Testing with automated tools',
    body: (
      <>
        <p>
          Automated tooling helps catch issues humans miss. Tools are chosen based on requirements and auditor preference. Examples include:
        </p>
        <ul className="flow-audit-tools-inline">
          {automatedTools.map((t) => (
            <li key={t}>{t}</li>
          ))}
        </ul>
      </>
    ),
  },
  {
    id: '6',
    title: 'Initial audit report',
    body: (
      <>
        <p>
          We deliver a comprehensive <strong>Initial Audit Report (IAR)</strong>: a full audit write-up and recommended fixes for any vulnerabilities found. We expect your team to resolve identified issues and adjust the code accordingly.
        </p>
      </>
    ),
  },
  {
    id: '7',
    title: 'Final audit report',
    body: (
      <>
        <p>
          After fixes from the initial round, the process is repeated and a <strong>Final Audit Report</strong> is delivered. Some issues may remain or new ones may appear after changes. You decide—using the severity table—whether to iterate again or proceed.
        </p>
      </>
    ),
  },
  {
    id: '8',
    title: 'Delivery',
    body: (
      <>
        <p>
          Once the previous step is cleared, the report goes to design for a polished PDF presentation of the audit.
        </p>
        <p className="mb-2"><strong>Tools we may reference across the stack:</strong></p>
        <div className="flow-audit-chip-row">
          {toolsFooter.map((t) => (
            <span key={t} className="flow-audit-chip">
              {t}
            </span>
          ))}
        </div>
      </>
    ),
  },
];

const sectionMotion = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-60px' },
  transition: { duration: 0.45 },
};

const FlowOfAuditPage = () => {
  return (
    <div className="flow-audit-page text-white min-vh-100 position-relative overflow-x-hidden bg-black">
      {/* Fixed viewport Three.js layer — same network as R&D */}
      <div
        className="flow-audit-bg-layer position-fixed top-0 start-0 w-100 h-100 z-0"
        style={{ pointerEvents: 'none' }}
      >
        <NeuralNetworkBackground />
      </div>

      <div
        className="flow-audit-bg-layer position-fixed top-0 start-0 w-100 h-100 z-0"
        style={{
          background: 'radial-gradient(circle at center, transparent 0%, #000 90%)',
          pointerEvents: 'none',
        }}
      />

      <div className="position-relative z-1">
        <div className="container px-3 px-md-4 flow-audit-inner">
          <motion.header
            className="flow-audit-hero mb-5"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
  
            <h1 className="flow-audit-title mb-3">
              Flow of <span className="text-info">audit</span>
            </h1>
            <p className="flow-audit-lead text-white-50 mb-4 mx-auto" style={{ maxWidth: '640px' }}>
              How Cyphrix structures smart contract security work—from preparation through reporting and delivery.
            </p>

            <motion.section
              className="flow-audit-card border border-white border-opacity-10 rounded-4 p-4 mb-4 bg-black bg-opacity-50 backdrop-blur-md"
              {...sectionMotion}
            >
              <h2 className="flow-audit-section-title h5 text-info mb-3">Auditing process (overview)</h2>
              <ol className="flow-audit-overview list-unstyled mb-0">
                {overviewSteps.map((s) => (
                  <li key={s.title} className="mb-3">
                    <span className="flow-audit-step-label text-info me-2">{s.title}</span>
                    {s.text}
                  </li>
                ))}
              </ol>
            </motion.section>

            <motion.section
              className="flow-audit-card border border-white border-opacity-10 rounded-4 p-4 bg-black bg-opacity-50 backdrop-blur-md"
              {...sectionMotion}
              transition={{ duration: 0.45, delay: 0.05 }}
            >
              <h2 className="flow-audit-section-title h5 text-info mb-3">Business logic review</h2>
              <p className="text-white-50 small mb-3">Typical areas we examine include:</p>
              <ul className="flow-audit-list-two-col mb-0">
                {businessLogicAreas.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </motion.section>
          </motion.header>

          <div className="flow-audit-steps pb-5">
            <motion.h2
              className="flow-audit-section-title h4 mb-4 pb-2 border-bottom border-info border-opacity-25"
              {...sectionMotion}
            >
              Detailed steps
            </motion.h2>
            {steps.map((step, index) => (
              <motion.article
                key={step.id}
                className="flow-audit-step mb-5 flow-audit-glass border border-white border-opacity-10 rounded-4 p-4 p-md-5"
                id={`step-${step.id}`}
                initial={{ opacity: 0, y: 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-80px' }}
                transition={{ duration: 0.5, delay: index * 0.03 }}
              >
                <h3 className="flow-audit-step-title">
                  <span className="flow-audit-step-num">{step.id}</span>
                  {step.title}
                </h3>
                <div className="flow-audit-step-body text-white-50">{step.body}</div>
              </motion.article>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FlowOfAuditPage;
