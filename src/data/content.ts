export const profile = {
  name: 'Nguyen Minh Quan',
  initials: 'NQ',
  title: 'Aspiring Business Analyst',
  location: 'Hanoi, Vietnam',
  email: 'quannm146@gmail.com',
  phone: '0362 247 619',
  linkedin: 'linkedin.com/in/minhquan146nguyen',
  linkedinUrl: 'https://linkedin.com/in/minhquan146nguyen',
  github: 'kathawn',
  githubUrl: 'https://github.com/kathawn',
  objective:
    'Aspiring Business Analyst with a solid foundation in requirement analysis and specification, business process modeling, and relational database design. Strong logical thinking and ability to bridge business stakeholders and technical teams, seeking to apply this experience in a real-world working environment.',
  resumeUrl: '/Nguyen-Minh-Quan-CV.pdf',
}

export const education = {
  school: 'Thuongmai University (TMU)',
  location: 'Hanoi',
  degree: 'Bachelor of Management Information Systems',
  graduation: 'Expected Graduation: June 2027',
  details: [
    { label: 'Current GPA', value: '3.6 / 4.0' },
    { label: 'Honors', value: 'Academic Encouragement Scholarship, Semester 1, Year 2' },
    { label: 'English Certificate', value: 'TOEIC L&R 850, S&W 320 (2026)' },
  ],
}

export type Project = {
  id: string
  name: string
  tagline: string
  period: string
  role: string
  context: string
  link?: { label: string; url: string }
  stack: string[]
  highlights: string[]
  flow: string[]
}

export const projects: Project[] = [
  {
    id: 'boardverse',
    name: 'BoardVerse',
    tagline: 'Board Game Commercial & Rental Platform',
    period: 'Oct 2026 – Present',
    role: 'Product Owner and Business Analyst — Personal Project',
    context: 'End-to-end commercial and rental platform for the board game community.',
    link: { label: 'GitHub: kathawn/Board-Game-Project', url: 'https://github.com/kathawn/Board-Game-Project' },
    stack: ['Draw.io', 'Next.js', 'Microsoft SQL Server', 'AI-assisted workflow'],
    highlights: [
      'Applied AI to the workflow to quickly design mockups and build a functional, interactive MVP, validating business rules against technical constraints before handoff to the development team.',
      'Conceptualized an end-to-end commercial and rental platform for the board game community, conducting market research and defining core business requirements.',
      'Authored comprehensive BA documentation including BRD, SRS, and SDD, detailing 3 user roles, 3 external integrations, and 20 Use Cases with structured User Stories and Acceptance Criteria.',
      'Designed mockups and user flows for Customer and Admin portals using AI, and modeled a relational database schema of 13 entities on Microsoft SQL Server.',
      'Analyzed core rental workflows, formulating business logic for date-range inventory conflict checks, tiered daily pricing, and deposit refund management.',
    ],
    flow: ['Market Research', 'BRD / SRS / SDD', 'Mockups & User Flows', 'ERD (13 entities)', 'MVP Handoff'],
  },
  {
    id: 'cinema',
    name: 'Cinema E-Ticketing',
    tagline: 'Booking Management System',
    period: 'May 2026',
    role: 'Business Analyst — Individual Academic Project',
    context: 'System analysis for post-purchase operations and ticket verification.',
    link: { label: 'Deliverable: System Analysis Report', url: '' },
    stack: ['Draw.io', 'Microsoft SQL Server'],
    highlights: [
      'Conducted system analysis for post-purchase operations, detailing 7 functional requirements and 4 non-functional requirements for ticket verification, each written clearly, testable, and traceable.',
      'Constructed 10 UML diagrams in Draw.io, including BPMN-style Swimlane Activity Diagrams for cross-role business process flows, Sequence Diagrams handling alternate and retry flows, and State Machine Diagrams for the ticket lifecycle.',
      'Established core business rules for role-based access control and high-contrast dynamic QR code generation for ticket redemption.',
      'Designed a normalized relational database schema of 11 tables on Microsoft SQL Server, constructing complex SQL queries and relational constraints.',
    ],
    flow: ['Requirements (7 FR / 4 NFR)', 'UML & BPMN Diagrams', 'Business Rules', 'ERD (11 tables)', 'SQL Queries'],
  },
]

export const skills = {
  'Business Analysis & Methodology': [
    'Requirement Elicitation',
    'BRD / SRS / SDD Documentation',
    'User Stories & Acceptance Criteria',
    'Agile & Scrum',
    'UML & BPMN-style Process Modeling',
    'ERD Modeling',
    'Applying AI to Work',
  ],
  'Technical & BA Tools': ['Draw.io', 'Microsoft SQL Server', 'SQL'],
  'Data Analysis & Office': ['Tableau', 'Microsoft Excel', 'Microsoft Word', 'Canva'],
}

export const dataFlowStages = [
  { key: 'elicit', label: 'Elicit' },
  { key: 'analyze', label: 'Analyze' },
  { key: 'model', label: 'Model' },
  { key: 'design', label: 'Design' },
  { key: 'deliver', label: 'Deliver' },
] as const
