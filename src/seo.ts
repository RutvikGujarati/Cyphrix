export const siteUrl = 'https://www.cyphrixtech.com';
export const socialImage = `${siteUrl}/social-preview.jpg`;

export const pages = [
  { path: '/', label: 'Home', title: 'Cyphrix Technologies | Smart Contract Audits & Security', description: 'Secure your smart contracts, blockchain infrastructure and web applications with Cyphrix Technologies. Explore security audits, engineering and published reports.' },
  { path: '/services', label: 'Services', title: 'Blockchain Development & Security Services | Cyphrix', description: 'Explore Cyphrix services for smart contract development, security auditing, penetration testing, Web3 infrastructure, zero-knowledge proofs and QA testing.' },
  { path: '/projects', label: 'Projects & Reports', title: 'Blockchain Projects & Published Audit Reports | Cyphrix', description: 'Explore Cyphrix blockchain engineering projects and published security reports, including smart contract audits and web application penetration assessments.' },
  { path: '/research', label: 'Research', title: 'Blockchain Security Research & RWA Engineering | Cyphrix', description: 'Explore Cyphrix research into blockchain security, real-world asset tokenization, protocol governance, smart contract analysis and security engineering.' },
  { path: '/flowofaudit', label: 'Audit Methodology', title: 'Smart Contract Audit Process & Methodology | Cyphrix', description: 'Understand the Cyphrix security audit process, from specification and manual code review through testing, findings, remediation, verification and delivery.' },
  { path: '/partnerwithus', label: 'Partner Alliance', title: 'Security & Blockchain Referral Partnerships | Cyphrix', description: 'Learn about the Cyphrix partner alliance, referral eligibility, commissions, payments and the process for connecting clients with blockchain security services.' },
  { path: '/inquiry', label: 'Contact & Team', title: 'Contact Our Blockchain & Security Engineering Team | Cyphrix', description: 'Contact Cyphrix Technologies for smart contract audits, penetration testing and blockchain engineering. Meet the team and submit a verified project inquiry.' },
  { path: '/request-audit', label: 'Request an Audit', title: 'Request a Smart Contract or Security Audit | Cyphrix', description: 'Request a security audit from Cyphrix Technologies. Share your project scope, audit requirements and contact details through our verified audit intake form.' },
] as const;

export function getPage(pathname: string) {
  const path = pathname.replace(/\/$/, '') || '/';
  return pages.find(page => page.path === path) ?? pages[0];
}

export function structuredData(pathname: string) {
  const page = getPage(pathname);
  const organization = `${siteUrl}/#organization`;
  const graph: Record<string, unknown>[] = [
    {
      '@type': 'Organization', '@id': organization,
      name: 'Cyphrix Technologies', url: `${siteUrl}/`,
      logo: { '@type': 'ImageObject', url: `${siteUrl}/social-preview.jpg`, width: 1200, height: 1200 },
      description: 'Blockchain and cybersecurity engineering, smart contract security audits, Web3 infrastructure and penetration testing.',
      email: 'cyphrixsupport@cyphrixtech.com',
      sameAs: ['https://www.linkedin.com/company/cyphrixtechnologies/', 'https://www.instagram.com/cyphrixtechnologies/'],
      contactPoint: { '@type': 'ContactPoint', contactType: 'Project inquiries', email: 'cyphrixsupport@cyphrixtech.com', url: `${siteUrl}/inquiry` },
    },
    { '@type': 'WebSite', '@id': `${siteUrl}/#website`, name: 'Cyphrix Technologies', url: `${siteUrl}/`, publisher: { '@id': organization }, inLanguage: 'en' },
    { '@type': page.path === '/inquiry' ? 'ContactPage' : 'WebPage', '@id': `${siteUrl}${page.path}#webpage`, url: `${siteUrl}${page.path}`, name: page.title, description: page.description, isPartOf: { '@id': `${siteUrl}/#website` }, about: { '@id': organization }, inLanguage: 'en' },
  ];
  if (page.path !== '/') {
    graph.push({ '@type': 'BreadcrumbList', itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: `${siteUrl}/` },
      { '@type': 'ListItem', position: 2, name: page.label, item: `${siteUrl}${page.path}` },
    ] });
  }
  if (page.path === '/inquiry') {
    for (const person of [
      { name: 'Rutvik Gujarati', jobTitle: 'Lead Smart Contract Developer', sameAs: ['https://www.linkedin.com/in/rutvik-gujarati/'] },
      { name: 'Vishal Baraiya', jobTitle: 'Senior Smart Contract Auditor', sameAs: ['https://www.linkedin.com/in/vishal-baraiya-05989a151/'] },
      { name: 'Shristi Vyas', jobTitle: 'Penetration Tester', sameAs: ['https://www.linkedin.com/in/shristi-vyas-b8535b196/'] },
    ]) graph.push({ '@type': 'Person', ...person, worksFor: { '@id': organization } });
  }
  return { '@context': 'https://schema.org', '@graph': graph };
}
