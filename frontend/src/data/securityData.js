const securityData = {
  lastUpdated: "2026-03-03",

  sections: [
    {
      id: "infrastructure",
      title: "1. Infrastructure Security",
      content: `
Our infrastructure is built with secure hosting environments,
network isolation, and firewall protection to ensure system integrity.
Access to production environments is strictly controlled.
      `,
    },
    {
      id: "data-encryption",
      title: "2. Data Encryption",
      content: `
All sensitive data is encrypted in transit using HTTPS/TLS protocols.
Where applicable, data at rest is protected using industry-standard encryption mechanisms.
      `,
    },
    {
      id: "authentication",
      title: "3. Authentication & Access Control",
      content: `
We implement secure authentication flows and role-based access control.
Administrative privileges are restricted and monitored.
      `,
    },
    {
      id: "monitoring",
      title: "4. Monitoring & Incident Response",
      content: `
System activity is monitored to detect suspicious behavior.
We maintain incident response procedures to address security events promptly.
      `,
    },
    {
      id: "compliance",
      title: "5. Compliance & Best Practices",
      content: `
Our security practices align with GDPR principles,
data protection regulations, and industry security standards.
      `,
    },
    {
      id: "responsible-disclosure",
      title: "6. Responsible Disclosure",
      content: `
If you discover a vulnerability, please report it responsibly.
We commit to investigating and addressing legitimate security concerns.
      `,
    },
  ],
}

export default securityData