import type { Experience } from '~/types'

export const experiences: Experience[] = [
  {
    id: 1,
    company: 'Kodehive (PT Kode Gama Teknologi)',
    role: 'Full Stack Developer',
    type: 'Full-time',
    period: 'Jul 2024 – Present',
    location: 'Jakarta Selatan, Indonesia · On-site',
    current: true,
    description: [
      'Improved application performance, reducing response times from minutes to seconds through query optimization, indexing, resolving N+1 queries, and implementing CTEs.',
      'Migrated and adapted data from legacy systems to new applications, ensuring data consistency, integrity, and smooth transition for end-users.',
      'Transformed UI designs into interactive web interfaces using Vue.js, HTML5, and TypeScript, enhancing user experience and interface consistency.',
      'Collaborated with users and stakeholders to clarify requirements and align implementation with business logic.',
      'Implemented authentication and authorization using JWT and role-based access control, securing sensitive application data.',
      'Integrated caching and search solutions with Redis and OpenSearch, significantly improving data retrieval speed.',
      'Developed and consumed RESTful APIs for frontend-backend communication.',
      'Created background jobs and scheduled tasks for batch processing and data synchronization.',
    ],
    skills: ['.NET', 'Vue.js', 'TypeScript', 'Redis', 'OpenSearch', 'PostgreSQL', 'JWT'],
  },
  {
    id: 2,
    company: 'PT Javan Cipta Solusi',
    role: 'Fullstack Web Developer',
    type: 'Part-time',
    period: 'Oct 2023 – Apr 2024',
    location: 'Yogyakarta, Indonesia · On-site',
    current: false,
    description: [
      'Executed slicing tasks to transform mockup designs into functional code with pixel-perfect accuracy using React and TypeScript.',
      'Modified backend infrastructure to prepare data for frontend utilization and tested integrations with Postman.',
      'Integrated digital document management using OnlyOffice to enhance efficiency and accessibility within the system.',
      'Interacted with backend APIs for retrieving and storing data using RESTful APIs.',
      'Utilized GitLab for version control, collaboration, and change tracking.',
    ],
    skills: ['React', 'TypeScript', 'OnlyOffice', 'RESTful API', 'GitLab'],
  },
]
