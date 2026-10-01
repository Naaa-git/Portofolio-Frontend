export interface Project {
  id: number
  title: string
  slug: string
  shortDescription: string
  longDescription: string
  techStack: string[]
  imageUrl: string
  githubUrl: string
  demoUrl: string
  featured: boolean
  category: string
}

export interface Experience {
  id: number
  company: string
  role: string
  type: string
  period: string
  location: string
  current: boolean
  description: string[]
  skills: string[]
}

export interface Skill {
  id: number
  category: string
  items: string[]
  sortOrder: number
}

export interface SocialLink {
  id: number
  name: string
  url: string
  icon: string
}

export interface Profile {
  name: string
  shortName: string
  role: string
  roleAlternatives: string[]
  tagline: string
  bio: string
  bioExtended: string
  availableForWork: boolean
  email: string
  location: string
  avatarUrl: string
  cvUrl: string
}
