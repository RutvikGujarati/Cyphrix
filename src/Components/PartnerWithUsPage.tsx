import { motion } from 'framer-motion';
import { Handshake, Percent, CircleCheckBig, BadgeDollarSign, Mail } from 'lucide-react';
import './PartnerWithUsPage.css';
import AuroraCanvas from './AuroraCanvas';

const eligibility = [
  'The referred client must be a new client.',
  'The referral must be communicated to our team before or at the time of the first client meeting.',
  'The commission is applicable only after the client makes the first payment for the project.',
];

const payments = [
  'The referral commission will be paid after we receive the initial payment from the client.',
  'Payments will be processed via bank transfer or any mutually agreed payment method.',
  'If the project is executed in multiple phases, commission may be paid proportionally based on payments received.',
];

const PartnerWithUsPage = () => {
  return (
    <div className="partner-page text-white min-vh-100 position-relative overflow-x-hidden bg-black">
      <AuroraCanvas />
      <div className="partner-wave partner-wave-a" />
      <div className="partner-wave partner-wave-b" />
      <div className="partner-wave partner-wave-c" />
      <div className="partner-rings" />
      <div className="partner-accent partner-accent-a" />
      <div className="partner-accent partner-accent-b" />
      <div className="partner-grid-overlay" />

      <div className="position-relative z-1 partner-inner container px-3 px-md-4">
        <motion.header
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="text-center mb-5"
        >
          <span className="badge border border-info text-info rounded-pill px-3 py-2 mb-3 bg-transparent">
            PARTNERSHIP PROGRAM
          </span>
          <h1 className="display-5 fw-bold mb-3">Partner With Us</h1>
          <p className="text-white-50 lead mx-auto" style={{ maxWidth: '760px' }}>
            Referral Program - <span className="text-info fw-semibold">15% commission on total project value</span>
          </p>
          <div className="partner-hero-chip mt-3 mx-auto">
            Earn 15% on every successful referred project
          </div>
        </motion.header>

        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.45 }}
          className="row g-3 mb-4"
        >
          <div className="col-12 col-md-4">
            <div className="partner-metric p-3 rounded-4 h-100">
              <div className="partner-metric-value">15%</div>
              <div className="partner-metric-label">Commission Rate</div>
            </div>
          </div>
          <div className="col-12 col-md-4">
            <div className="partner-metric p-3 rounded-4 h-100">
              <div className="partner-metric-value">New Clients</div>
              <div className="partner-metric-label">Valid Referral Type</div>
            </div>
          </div>
          <div className="col-12 col-md-4">
            <div className="partner-metric p-3 rounded-4 h-100">
              <div className="partner-metric-value">Fast Payout</div>
              <div className="partner-metric-label">After First Payment Received</div>
            </div>
          </div>
        </motion.section>

        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.45 }}
          className="partner-glass rounded-4 border border-info border-opacity-25 p-4 p-md-5 mb-4"
        >
          <div className="d-flex align-items-center gap-2 mb-3">
            <Handshake size={22} className="text-info" />
            <h2 className="h4 mb-0">Referral Program Overview</h2>
          </div>
          <p className="text-white-50 mb-0">
            We reward individuals and partners who help us grow by introducing new clients and projects to Cyphrix.
            If your referral signs a project agreement with us, you will receive a
            <span className="text-info fw-semibold"> 15% commission </span>
            on the total project cost (excluding taxes and applicable third-party costs).
          </p>
        </motion.section>

        <div className="row g-4 mb-4">
          <div className="col-12 col-lg-6">
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.45, delay: 0.05 }}
              className="partner-glass rounded-4 border border-white border-opacity-10 p-4 h-100"
            >
              <div className="d-flex align-items-center gap-2 mb-3">
                <CircleCheckBig size={20} className="text-info" />
                <h3 className="h5 mb-0">Eligibility</h3>
              </div>
              <ul className="mb-0 text-white-50 partner-list">
                {eligibility.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </motion.section>
          </div>

          <div className="col-12 col-lg-6">
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.45, delay: 0.08 }}
              className="partner-glass rounded-4 border border-white border-opacity-10 p-4 h-100"
            >
              <div className="d-flex align-items-center gap-2 mb-3">
                <BadgeDollarSign size={20} className="text-info" />
                <h3 className="h5 mb-0">Commission Payment</h3>
              </div>
              <ul className="mb-0 text-white-50 partner-list">
                {payments.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </motion.section>
          </div>
        </div>

        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.45, delay: 0.1 }}
          className="partner-glass rounded-4 border border-white border-opacity-10 p-4 p-md-5 mb-4"
        >
          <div className="d-flex align-items-center gap-2 mb-3">
            <Percent size={20} className="text-info" />
            <h3 className="h5 mb-0">Example</h3>
          </div>
          <p className="text-white-50 mb-0">
            If the total project value is <strong>$10,000</strong>, your referral commission will be
            <strong className="text-info"> $1,500 (15%)</strong>.
          </p>
        </motion.section>

        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.45, delay: 0.12 }}
          className="partner-glass rounded-4 border border-info border-opacity-25 p-4 p-md-5 mb-4"
        >
          <h3 className="h5 mb-2">Our goal</h3>
          <p className="text-white-50 mb-0">
            This program is built to create long-term partnerships and reward contributors who help us expand our
            network and business opportunities.
          </p>
        </motion.section>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.45, delay: 0.14 }}
          className="partner-contact rounded-4 border border-white border-opacity-10 p-4 mb-5"
        >
          <div className="d-flex align-items-center gap-2 mb-2">
            <Mail size={18} className="text-info" />
            <span className="fw-semibold">For referrals or more details:</span>
          </div>
          <a href="mailto:cyphrixsupport@cyphrixtech.com" className="text-info text-decoration-none">
            cyphrixsupport@cyphrixtech.com
          </a>
        </motion.div>
      </div>
    </div>
  );
};

export default PartnerWithUsPage;
