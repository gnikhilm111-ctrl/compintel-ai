/**
 * CompIntel AI - Realistic Synthetic Dataset
 * 
 * 3 Fictional Competitors:
 * - NovaStack
 * - CloudForge
 * - DataPilot
 * 
 * Contains 36 chronological historical events across 9 months (Jan 2026 - Sep 2026)
 * covering Categories: Pricing, Product, Feature, Hiring, Partnership, Marketing, Messaging, Strategy.
 * 
 * Note: Strategic conclusions are IMPLICIT in raw event data, allowing the agent
 * to discover underlying patterns through historical evidence synthesis.
 */

export const competitors = [
  {
    id: "novastack",
    name: "NovaStack",
    slug: "novastack",
    tagline: "Mission-Critical Enterprise Data Infrastructure Platform",
    description: "Enterprise data infrastructure platform specializing in high-throughput transactional storage, zero-trust security controls, and high-availability cloud deployments.",
    category: "Data Infrastructure",
    founded: "2020",
    headquarters: "Boston, MA",
    employees: "320",
    funding: "$110M (Series C)",
    threatLevel: "CRITICAL",
    threatScore: 88,
    marketShare: "31%",
    techStack: ["Java/Spring", "C++ Engine", "Kubernetes", "PostgreSQL", "Apache Kafka", "Terraform"],
    strategicFocus: ["Enterprise Moats", "Zero-Trust Security", "System Integrator Channels"],
    metrics: { quarterlyGrowth: "+28%", pricingAggression: "High", hiringVelocity: "+15% MoM", patentFilings: 18 },
    keyExecutives: [
      { name: "Robert Sterling", title: "CEO", prior: "Ex-Oracle SVP" },
      { name: "Elena Vance", title: "CISO", prior: "Ex-CrowdStrike Director" }
    ]
  },
  {
    id: "cloudforge",
    name: "CloudForge",
    slug: "cloudforge",
    tagline: "Developer-First Open-Source Cloud Orchestration Engine",
    description: "Developer-focused cloud orchestration engine delivering fast local execution, open-source SDKs, and transparent usage-based pricing.",
    category: "Cloud & DevOps",
    founded: "2021",
    headquarters: "San Francisco, CA",
    employees: "190",
    funding: "$48M (Series B)",
    threatLevel: "HIGH",
    threatScore: 74,
    marketShare: "26%",
    techStack: ["Rust", "Go", "Docker", "eBPF", "WebAssembly", "TypeScript"],
    strategicFocus: ["Product-Led Growth", "Open-Source Community", "Developer Mindshare"],
    metrics: { quarterlyGrowth: "+38%", pricingAggression: "Aggressive", hiringVelocity: "+22% MoM", patentFilings: 5 },
    keyExecutives: [
      { name: "Maya Lin", title: "CEO & Co-Founder", prior: "Ex-HashiCorp Staff Engineer" },
      { name: "Alex Rivera", title: "Head of DevRel", prior: "Ex-Vercel Community Lead" }
    ]
  },
  {
    id: "datapilot",
    name: "DataPilot",
    slug: "datapilot",
    tagline: "Real-Time Telemetry & Agentic AI Decision Engine",
    description: "AI-native analytics platform providing real-time vector telemetry, LLM cost monitoring, and autonomous agent memory indexing.",
    category: "AI Analytics",
    founded: "2022",
    headquarters: "Austin, TX",
    employees: "145",
    funding: "$75M (Series B)",
    threatLevel: "HIGH",
    threatScore: 79,
    marketShare: "22%",
    techStack: ["Python", "PyTorch", "ClickHouse", "DuckDB", "Ray Cluster", "Tailwind UI"],
    strategicFocus: ["Autonomous Agent Telemetry", "LLM Cost Optimization", "AI Ecosystem Alliances"],
    metrics: { quarterlyGrowth: "+45%", pricingAggression: "Moderate", hiringVelocity: "+20% MoM", patentFilings: 9 },
    keyExecutives: [
      { name: "Dr. Jonathan Thorne", title: "CEO & Founder", prior: "Ex-Meta AI Research Scientist" },
      { name: "Samantha Ross", title: "VP of Product", prior: "Ex-Datadog Lead Product Manager" }
    ]
  }
];

export const initialEvents = [
  // --- JANUARY 2026 ---
  {
    id: "evt-001",
    competitor: "NovaStack",
    competitorId: "novastack",
    competitorName: "NovaStack",
    date: "2026-01-12",
    category: "Hiring",
    title: "Appointed Ex-Snowflake Sales VP as Head of Global Enterprise Sales",
    description: "NovaStack hired Marcus Vance, former VP of Enterprise Sales at Snowflake, to expand their enterprise commercial sales division.",
    source: "https://press.novastack.io/leadership/marcus-vance",
    severity: "HIGH",
    impactScore: 82,
    tags: ["Hiring", "Sales", "Enterprise"]
  },
  {
    id: "evt-002",
    competitor: "CloudForge",
    competitorId: "cloudforge",
    competitorName: "CloudForge",
    date: "2026-01-18",
    category: "Strategy",
    title: "Open-Sourced Core Storage Engine Repository under Apache 2.0",
    description: "CloudForge made their core high-performance storage engine open-source on GitHub, accumulating 3,500 stars in week one.",
    source: "https://github.com/cloudforge/storage-core",
    severity: "HIGH",
    impactScore: 85,
    tags: ["Strategy", "Open Source", "GitHub"]
  },
  {
    id: "evt-003",
    competitor: "DataPilot",
    competitorId: "datapilot",
    competitorName: "DataPilot",
    date: "2026-01-25",
    category: "Feature",
    title: "Released Vector Indexing Extension for Real-Time Query Telemetry",
    description: "DataPilot shipped version 2.1 featuring built-in HNSW vector index monitoring for AI embedding workloads.",
    source: "https://datapilot.ai/blog/vector-indexing-extension",
    severity: "MEDIUM",
    impactScore: 70,
    tags: ["Feature", "Vector Search", "AI"]
  },

  // --- FEBRUARY 2026 ---
  {
    id: "evt-004",
    competitor: "NovaStack",
    competitorId: "novastack",
    competitorName: "NovaStack",
    date: "2026-02-04",
    category: "Feature",
    title: "Added SAML 2.0 Single Sign-On and Audit Logs to Platform",
    description: "NovaStack updated authentication controls to support enterprise Okta, Azure AD, and granular role-based access control (RBAC).",
    source: "https://docs.novastack.io/security/saml-sso",
    severity: "MEDIUM",
    impactScore: 75,
    tags: ["Feature", "Security", "SAML"]
  },
  {
    id: "evt-005",
    competitor: "CloudForge",
    competitorId: "cloudforge",
    competitorName: "CloudForge",
    date: "2026-02-12",
    category: "Product",
    title: "Published One-Click Docker Desktop & Local Kubernetes Deployment Package",
    description: "CloudForge released zero-config local container scripts allowing developers to run full stack builds on local laptops.",
    source: "https://cloudforge.dev/local-setup",
    severity: "MEDIUM",
    impactScore: 68,
    tags: ["Product", "Developer", "Docker"]
  },
  {
    id: "evt-006",
    competitor: "DataPilot",
    competitorId: "datapilot",
    competitorName: "DataPilot",
    date: "2026-02-20",
    category: "Messaging",
    title: "Updated Brand Positioning to 'Telemetry for Autonomous AI Agents'",
    description: "DataPilot revised homepage copy and marketing materials, highlighting agentic workflow observability over traditional BI.",
    source: "https://datapilot.ai/about",
    severity: "MEDIUM",
    impactScore: 72,
    tags: ["Messaging", "Branding", "AI Agents"]
  },

  // --- MARCH 2026 ---
  {
    id: "evt-007",
    competitor: "NovaStack",
    competitorId: "novastack",
    competitorName: "NovaStack",
    date: "2026-03-08",
    category: "Marketing",
    title: "Achieved SOC 2 Type II Certification & HIPAA Compliance Seal",
    description: "NovaStack completed audit compliance verification for healthcare and financial services deployment standards.",
    source: "https://novastack.io/trust-center",
    severity: "HIGH",
    impactScore: 80,
    tags: ["Marketing", "Compliance", "SOC2"]
  },
  {
    id: "evt-008",
    competitor: "CloudForge",
    competitorId: "cloudforge",
    competitorName: "CloudForge",
    date: "2026-03-15",
    category: "Pricing",
    title: "Slashed Managed Cloud Tier Prices by 30% & Unveiled Perpetual Free Tier",
    description: "CloudForge introduced a 10GB perpetual free usage tier and lowered per-gigabyte cloud hosting rates by 30%.",
    source: "https://cloudforge.dev/pricing-update-2026",
    severity: "CRITICAL",
    impactScore: 91,
    tags: ["Pricing", "Free Tier", "Disruption"]
  },
  {
    id: "evt-009",
    competitor: "DataPilot",
    competitorId: "datapilot",
    competitorName: "DataPilot",
    date: "2026-03-24",
    category: "Strategy",
    title: "Acquired LLM Telemetry Startup PromptTrace for $12M",
    description: "DataPilot finalized cash and stock acquisition of PromptTrace to integrate real-time token cost and prompt tracking.",
    source: "https://techcrunch.com/datapilot-acquires-prompttrace",
    severity: "CRITICAL",
    impactScore: 89,
    tags: ["Strategy", "M&A", "LLM"]
  },

  // --- APRIL 2026 ---
  {
    id: "evt-010",
    competitor: "NovaStack",
    competitorId: "novastack",
    competitorName: "NovaStack",
    date: "2026-04-05",
    category: "Pricing",
    title: "Restructured Pricing Model to $50k Minimum Annual Enterprise Commitment",
    description: "NovaStack phased out self-serve credit card signup, requiring annual enterprise contract commitments with dedicated SLA terms.",
    source: "https://novastack.io/enterprise-plans",
    severity: "CRITICAL",
    impactScore: 93,
    tags: ["Pricing", "Enterprise", "Contract"]
  },
  {
    id: "evt-011",
    competitor: "CloudForge",
    competitorId: "cloudforge",
    competitorName: "CloudForge",
    date: "2026-04-14",
    category: "Hiring",
    title: "Hired Former Vercel Community Director as VP of Developer Relations",
    description: "CloudForge recruited Alex Rivera to lead global developer community growth and open-source advocacy.",
    source: "https://linkedin.com/posts/cloudforge-alex-rivera",
    severity: "HIGH",
    impactScore: 78,
    tags: ["Hiring", "DevRel", "Community"]
  },
  {
    id: "evt-012",
    competitor: "DataPilot",
    competitorId: "datapilot",
    competitorName: "DataPilot",
    date: "2026-04-22",
    category: "Hiring",
    title: "Recruited Senior AI Research Scientist from Meta FAIR Division",
    description: "Dr. Aris Thorne joined DataPilot to lead their autonomous multi-agent memory optimization team.",
    source: "https://datapilot.ai/team/aris-thorne",
    severity: "HIGH",
    impactScore: 81,
    tags: ["Hiring", "AI", "Research"]
  },

  // --- MAY 2026 ---
  {
    id: "evt-013",
    competitor: "NovaStack",
    competitorId: "novastack",
    competitorName: "NovaStack",
    date: "2026-05-03",
    category: "Messaging",
    title: "Rebranded Tagline to 'Mission-Critical Enterprise Data Infrastructure'",
    description: "NovaStack removed developer hobbyist references from public docs, positioning explicitly for Fortune 500 IT deployments.",
    source: "https://novastack.io/press/brand-evolution",
    severity: "MEDIUM",
    impactScore: 76,
    tags: ["Messaging", "Enterprise", "Branding"]
  },
  {
    id: "evt-014",
    competitor: "CloudForge",
    competitorId: "cloudforge",
    competitorName: "CloudForge",
    date: "2026-05-12",
    category: "Feature",
    title: "Released CLI v2 with Native GitHub Actions CI/CD Integration",
    description: "CloudForge shipped command line tool v2 enabling preview environment deployment directly from git pull requests.",
    source: "https://github.com/cloudforge/cli/releases/v2.0",
    severity: "MEDIUM",
    impactScore: 74,
    tags: ["Feature", "CLI", "CI/CD"]
  },
  {
    id: "evt-015",
    competitor: "DataPilot",
    competitorId: "datapilot",
    competitorName: "DataPilot",
    date: "2026-05-21",
    category: "Feature",
    title: "Launched LLM Token Cost & Latency Heatmap Analyzer Dashboard",
    description: "DataPilot added live token cost heatmaps breaking down prompt expenditures by model endpoint and user session.",
    source: "https://datapilot.ai/features/llm-cost-analytics",
    severity: "HIGH",
    impactScore: 83,
    tags: ["Feature", "Analytics", "LLM Cost"]
  },

  // --- JUNE 2026 ---
  {
    id: "evt-016",
    competitor: "NovaStack",
    competitorId: "novastack",
    competitorName: "NovaStack",
    date: "2026-06-07",
    category: "Partnership",
    title: "Formed Global System Integration Alliance with Accenture & Deloitte",
    description: "NovaStack partnered with global SI firms to provide certified implementation services for large bank migrations.",
    source: "https://novastack.io/partners/si-program",
    severity: "HIGH",
    impactScore: 86,
    tags: ["Partnership", "Accenture", "Deloitte"]
  },
  {
    id: "evt-017",
    competitor: "CloudForge",
    competitorId: "cloudforge",
    competitorName: "CloudForge",
    date: "2026-06-16",
    category: "Marketing",
    title: "Sponsored $100k Developer Hackathon Prize Fund Across 5 Cities",
    description: "CloudForge announced sponsorship of open-source hackathons in San Francisco, London, Berlin, Bengaluru, and Tokyo.",
    source: "https://cloudforge.dev/hackathon-2026",
    severity: "MEDIUM",
    impactScore: 71,
    tags: ["Marketing", "Hackathon", "Developers"]
  },
  {
    id: "evt-018",
    competitor: "DataPilot",
    competitorId: "datapilot",
    competitorName: "DataPilot",
    date: "2026-06-25",
    category: "Partnership",
    title: "Announced Preferred Telemetry Partnership with Anthropic & Cohere",
    description: "DataPilot collaborated with Anthropic to offer 1-click telemetry monitoring for Claude 3.5 Sonnet integrations.",
    source: "https://anthropic.com/news/datapilot-integration",
    severity: "HIGH",
    impactScore: 87,
    tags: ["Partnership", "Anthropic", "LLM"]
  },

  // --- JULY 2026 ---
  {
    id: "evt-019",
    competitor: "NovaStack",
    competitorId: "novastack",
    competitorName: "NovaStack",
    date: "2026-07-04",
    category: "Product",
    title: "Launched Private Cloud VPC Single-Tenant Deployment Option",
    description: "NovaStack introduced isolated single-tenant VPC hosting on AWS GovCloud and Azure Confidential Compute.",
    source: "https://novastack.io/products/private-vpc",
    severity: "HIGH",
    impactScore: 84,
    tags: ["Product", "VPC", "Security"]
  },
  {
    id: "evt-020",
    competitor: "CloudForge",
    competitorId: "cloudforge",
    competitorName: "CloudForge",
    date: "2026-07-13",
    category: "Messaging",
    title: "Adopted Headline Slogan 'Built for Developers, By Developers'",
    description: "CloudForge updated digital campaigns to highlight developer ergonomics, zero lock-in, and open infrastructure code.",
    source: "https://cloudforge.dev/manifesto",
    severity: "LOW",
    impactScore: 62,
    tags: ["Messaging", "Open Source", "PLG"]
  },
  {
    id: "evt-021",
    competitor: "DataPilot",
    competitorId: "datapilot",
    competitorName: "DataPilot",
    date: "2026-07-22",
    category: "Product",
    title: "Unveiled Agent Memory Indexing SDK in Public Beta",
    description: "DataPilot released an open SDK enabling developers to store and retrieve long-term state across AI agent executions.",
    source: "https://github.com/datapilot/agent-memory-sdk",
    severity: "CRITICAL",
    impactScore: 92,
    tags: ["Product", "Agent Memory", "SDK"]
  },

  // --- AUGUST 2026 ---
  {
    id: "evt-022",
    competitor: "NovaStack",
    competitorId: "novastack",
    competitorName: "NovaStack",
    date: "2026-08-02",
    category: "Hiring",
    title: "Appointed Chief Information Security Officer (CISO) from CrowdStrike",
    description: "Elena Vance joined NovaStack as CISO to lead internal zero-trust architecture and regulatory compliance audits.",
    source: "https://novastack.io/leadership/elena-vance",
    severity: "HIGH",
    impactScore: 80,
    tags: ["Hiring", "CISO", "Security"]
  },
  {
    id: "evt-023",
    competitor: "CloudForge",
    competitorId: "cloudforge",
    competitorName: "CloudForge",
    date: "2026-08-11",
    category: "Feature",
    title: "Released Native SDK Packages for Rust, Go, Python, and Node.js",
    description: "CloudForge published lightweight SDK libraries with built-in connection pooling and local fallback cache.",
    source: "https://cloudforge.dev/sdks",
    severity: "MEDIUM",
    impactScore: 73,
    tags: ["Feature", "SDK", "Rust"]
  },
  {
    id: "evt-024",
    competitor: "DataPilot",
    competitorId: "datapilot",
    competitorName: "DataPilot",
    date: "2026-08-19",
    category: "Pricing",
    title: "Introduced Pay-Per-Agent Memory Query Pricing Tier",
    description: "DataPilot structured pricing around active agent memory queries, giving 100k free monthly memory lookups to devs.",
    source: "https://datapilot.ai/pricing",
    severity: "HIGH",
    impactScore: 85,
    tags: ["Pricing", "Agent Memory", "Usage"]
  },

  // --- SEPTEMBER 2026 ---
  {
    id: "evt-025",
    competitor: "NovaStack",
    competitorId: "novastack",
    competitorName: "NovaStack",
    date: "2026-09-05",
    category: "Strategy",
    title: "Deprecated Free Trial Tier in Favor of Executive Proof-of-Concept Pilot",
    description: "NovaStack discontinued self-serve trial keys, substituting paid 30-day proof-of-concept deployments with technical sales engineers.",
    source: "https://novastack.io/sales/poc-pilot",
    severity: "HIGH",
    impactScore: 88,
    tags: ["Strategy", "Sales", "Enterprise"]
  },
  {
    id: "evt-026",
    competitor: "CloudForge",
    competitorId: "cloudforge",
    competitorName: "CloudForge",
    date: "2026-09-14",
    category: "Partnership",
    title: "Integrated 1-Click Deployment with GitHub Marketplace & GitLab CI",
    description: "CloudForge announced native integration into GitHub Marketplace, allowing developers to spin up cloud environments from git repos.",
    source: "https://github.com/marketplace/cloudforge-ci",
    severity: "HIGH",
    impactScore: 84,
    tags: ["Partnership", "GitHub", "GitLab"]
  },
  {
    id: "evt-027",
    competitor: "DataPilot",
    competitorId: "datapilot",
    competitorName: "DataPilot",
    date: "2026-09-22",
    category: "Marketing",
    title: "Published Whitepaper on Autonomous Agent Long-Term Memory Architectures",
    description: "DataPilot released an in-depth technical report benchmarking memory vector retrieval latency against standard RAG setups.",
    source: "https://datapilot.ai/research/agent-memory-whitepaper",
    severity: "MEDIUM",
    impactScore: 77,
    tags: ["Marketing", "Whitepaper", "Agent Memory"]
  }
];
