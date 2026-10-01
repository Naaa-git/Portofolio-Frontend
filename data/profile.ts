import type { Skill, SocialLink } from '~/types'

export const profile = {
  name: 'Pradana Aldi Musthofa',
  shortName: 'Pradana',
  role: 'Fullstack Developer',
  roleAlternatives: ['.NET Specialist', 'Vue.js Developer', 'React Developer'],
  tagline: 'Building clean, scalable web applications from backend to browser.',
  bio: `Fullstack Developer with 2+ years of experience specializing in .NET and Vue.js.
Proficient in C#, TypeScript, JavaScript, React, and other modern frameworks, with hands-on
experience in backend development, API integration, and full lifecycle application development.`,
  bioExtended: `I'm passionate about writing clean, maintainable, and scalable code. I enjoy
understanding software architecture deeply to provide informed technical suggestions and contribute
effectively in team environments. Currently open to new opportunities where I can continue growing
and building impactful products.`,
  availableForWork: true,
  email: 'pradana@example.com',
  location: 'Jakarta, Indonesia',
  avatarUrl: 'https://picsum.photos/seed/pradana/400/400',
  cvUrl: '#',
}

export const skills: Skill[] = [
  {
    category: 'Languages',
    items: ['C#', 'TypeScript', 'JavaScript', 'SQL'],
  },
  {
    category: 'Frontend',
    items: ['Vue.js', 'React', 'Nuxt 3', 'Next.js', 'HTML5', 'CSS3', 'Tailwind CSS'],
  },
  {
    category: 'Backend',
    items: ['.NET', 'ASP.NET Core', 'RESTful API', 'JWT', 'Background Jobs'],
  },
  {
    category: 'Database & Cache',
    items: ['PostgreSQL', 'SQL Server', 'Redis', 'OpenSearch'],
  },
  {
    category: 'Tools & DevOps',
    items: ['Git', 'GitLab', 'Postman', 'Docker', 'Linux'],
  },
]

export const socialLinks: SocialLink[] = [
  {
    name: 'GitHub',
    url: 'https://github.com/danana',
    icon: 'github',
  },
  {
    name: 'LinkedIn',
    url: 'https://linkedin.com/in/pradana-aldi',
    icon: 'linkedin',
  },
  {
    name: 'Email',
    url: 'mailto:pradana@example.com',
    icon: 'mail',
  },
]
