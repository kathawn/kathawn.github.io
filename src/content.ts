// Mọi nội dung lấy từ CV — không thêm số liệu/thành tích ngoài CV.

export const person = {
  name: "Nguyen Minh Quan",
  first: "Nguyen Minh",
  last: "Quan",
  role: "Aspiring Business Analyst",
  location: "Hanoi",
  email: "quannm146@gmail.com",
  phone: "0362 247 619",
  phoneHref: "+84362247619",
  linkedin: "linkedin.com/in/minhquan146nguyen",
  linkedinHref: "https://www.linkedin.com/in/minhquan146nguyen",
};

export const objective =
  "Aspiring Business Analyst with a solid foundation in requirement analysis and specification, business process modeling and relational database design — bridging business stakeholders and technical teams.";

export const highlights = [
  {
    id: "gpa",
    label: "Current GPA",
    value: 3.6,
    decimals: 1,
    suffix: "/4.0",
    caption: "Bachelor of Management Information Systems, Thuongmai University",
  },
  {
    id: "lr",
    label: "TOEIC Listening & Reading",
    value: 850,
    decimals: 0,
    suffix: "",
    caption: "English certificate, 2026",
  },
  {
    id: "sw",
    label: "TOEIC Speaking & Writing",
    value: 320,
    decimals: 0,
    suffix: "",
    caption: "English certificate, 2026",
  },
];

export const scholarship = {
  title: "Academic Encouragement Scholarship",
  when: "Semester 1, Year 2",
};

export const education = {
  school: "Thuongmai University (TMU)",
  city: "Hanoi",
  degree: "Bachelor of Management Information Systems",
  grad: "Expected graduation: June 2027",
};

export const boardverse = {
  code: "PRJ-01",
  name: "BoardVerse",
  tagline: "Board game commercial & rental platform",
  period: "Oct 2026 – Present",
  role: "Product Owner & Business Analyst",
  kind: "Personal project",
  repo: "kathawn/Board-Game-Project",
  repoHref: "https://github.com/kathawn/Board-Game-Project",
  stack: ["Draw.io", "Next.js", "Microsoft SQL Server", "AI in the workflow"],
  stats: [
    { value: 3, label: "User roles" },
    { value: 3, label: "External integrations" },
    { value: 20, label: "Use cases" },
    { value: 13, label: "Database entities" },
  ],
  steps: [
    {
      title: "Discovery",
      text: "Conceptualized an end-to-end commercial and rental platform for the board game community, ran market research and defined the core business requirements.",
    },
    {
      title: "Specification",
      text: "Authored the BRD, SRS and SDD: 3 user roles, 3 external integrations and 20 use cases, each with structured user stories and acceptance criteria.",
    },
    {
      title: "Design",
      text: "Designed mockups and user flows for the Customer and Admin portals using AI, and modeled a 13-entity relational schema on Microsoft SQL Server.",
    },
    {
      title: "Business logic",
      text: "Analyzed the core rental workflow and formulated the rules for date-range inventory conflict checks, tiered daily pricing and deposit refund management.",
    },
    {
      title: "Validated MVP",
      text: "Applied AI to the workflow to build a functional, interactive MVP, validating business rules against technical constraints before handoff to the development team.",
    },
  ],
};

export const cinema = {
  code: "PRJ-02",
  name: "Cinema E‑Ticketing",
  tagline: "Booking management system — post-purchase operations",
  period: "May 2026",
  role: "Business Analyst",
  kind: "Individual academic project",
  deliverable: "System Analysis Report",
  stack: ["Draw.io", "Microsoft SQL Server"],
  stats: [
    { value: 7, label: "Functional requirements" },
    { value: 4, label: "Non-functional requirements" },
    { value: 10, label: "UML diagrams" },
    { value: 11, label: "Normalized tables" },
  ],
  points: [
    {
      title: "Requirements",
      text: "Analyzed ticket verification after purchase and wrote 7 functional and 4 non-functional requirements, each clear, testable and traceable.",
    },
    {
      title: "Process models",
      text: "Built 10 UML diagrams in Draw.io: BPMN-style swimlane activity diagrams for cross-role flows, sequence diagrams covering alternate and retry flows, and state machines for the ticket lifecycle.",
    },
    {
      title: "Business rules",
      text: "Set the rules for role-based access control and for high-contrast dynamic QR codes used at ticket redemption.",
    },
    {
      title: "Data design",
      text: "Designed a normalized 11-table schema on Microsoft SQL Server, with complex SQL queries and relational constraints.",
    },
  ],
};

export const skills = [
  {
    lane: "Business Analysis & Methodology",
    items: [
      "Requirement Elicitation",
      "BRD, SRS, SDD Documentation",
      "User Stories & Acceptance Criteria",
      "Agile & Scrum",
      "UML & BPMN-style Process Modeling",
      "ERD Modeling",
      "Applying AI to Work",
    ],
  },
  {
    lane: "Technical & BA Tools",
    items: ["Draw.io", "Microsoft SQL Server", "SQL"],
  },
  {
    lane: "Data Analysis & Office",
    items: ["Tableau", "Microsoft Excel", "Microsoft Word", "Canva"],
  },
];

// Chú thích cho hình 3D theo từng section
export const figures = [
  "fig. 1 — unstructured needs",
  "fig. 2 — the record, stacked",
  "fig. 3 — BoardVerse data model · 13 entities",
  "fig. 4 — the ticket and its 10 diagrams",
  "fig. 5 — toolkit in three swimlanes",
  "fig. 6 — one clear system",
];
