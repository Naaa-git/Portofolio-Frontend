// A field editable in both languages — matches the backend's jsonb {"id": "...", "en": "..."} shape.
export type Translatable = { id: string; en: string }

export interface AuditLog {
  id: number
  timestampUtc: string
  adminUsername: string | null
  action: 'Create' | 'Update' | 'Delete'
  entityName: string
  entityId: string
  changes: string | null
}

export type ProjectCategory = 'Personal' | 'Freelance' | 'Work'

export interface Project {
  id: number
  title: string
  slug: string
  shortDescription: string
  contribution: string[]
  techStack: string[]
  imageUrl: string
  githubUrl: string | null
  demoUrl: string | null
  featured: boolean
  category: string
  experienceCompany: string | null
}

export interface ProjectLink {
  slug: string
  title: string
}

export interface ProjectAdmin {
  id: number
  title: string
  slug: string
  shortDescription: Translatable
  contribution: Translatable[]
  techStack: string[]
  imageUrl: string
  githubUrl: string | null
  demoUrl: string | null
  featured: boolean
  category: ProjectCategory
}

export interface Experience {
  id: number
  company: string
  role: string
  type: string
  startDate: string
  endDate: string | null
  location: string
  current: boolean
  description: string
  skills: string[]
  projects: ProjectLink[]
}

export interface ExperienceAdmin {
  id: number
  company: string
  role: Translatable
  type: string
  startDate: string
  endDate: string | null
  location: string
  current: boolean
  description: Translatable
  skills: string[]
  projectIds: number[]
}

export interface Skill {
  id: number
  category: string
  items: string[]
  sortOrder: number
}

export interface SkillAdmin {
  id: number
  category: Translatable
  items: string[]
  sortOrder: number
}

export interface SocialLink {
  id: number
  name: string
  url: string
  icon: string
}

export type LoginChallenge = 'None' | 'Totp' | 'EmailOtp'

export interface LoginResponseDto {
  challenge: LoginChallenge
  accessToken: string | null
  expiresAtUtc: string | null
  pendingToken: string | null
}

export interface OutsideCodeIntro {
  paragraph1: string
  paragraph2: string
}

export interface OutsideCodeIntroAdmin {
  paragraph1: Translatable
  paragraph2: Translatable
}

export interface AwayFromKeyboardItem {
  id: number
  title: string
  note: string
  imageUrl: string | null
  sortOrder: number
}

export interface AwayFromKeyboardItemAdmin {
  id: number
  title: Translatable
  note: Translatable
  imageUrl: string | null
  sortOrder: number
}

export interface MovieTake {
  id: number
  title: string
  take: string
  imageUrl: string | null
  sortOrder: number
}

export interface MovieTakeAdmin {
  id: number
  title: string
  take: Translatable
  imageUrl: string | null
  sortOrder: number
}

export interface MusicArtist {
  id: number
  name: string
  url: string
  imageUrl: string | null
  sortOrder: number
}

export interface PodcastChannel {
  id: number
  name: string
  url: string
  imageUrl: string | null
  sortOrder: number
}

export interface OutsideCodeBook {
  id: number
  title: string
  author: string
  note: string | null
  imageUrl: string | null
  isCurrentlyReading: boolean
  sortOrder: number
}

export interface OutsideCodeBookAdmin {
  id: number
  title: string
  author: string
  note: Translatable
  imageUrl: string | null
  isCurrentlyReading: boolean
  sortOrder: number
}

export interface LifeInspiration {
  id: number
  name: string
  aspect: string
  note: string
  imageUrl: string | null
  sortOrder: number
}

export interface LifeInspirationAdmin {
  id: number
  name: string
  aspect: Translatable
  note: Translatable
  imageUrl: string | null
  sortOrder: number
}

export interface LessonCategory {
  id: number
  name: string
}

export interface LessonCategoryAdmin {
  id: number
  name: Translatable
  sortOrder: number
}

export interface Lesson {
  id: number
  categoryId: number
  categoryName: string
  title: string
  description: string
  projectSlug: string | null
  projectTitle: string | null
  experienceCompany: string | null
}

export interface LessonAdmin {
  id: number
  categoryId: number
  title: Translatable
  description: Translatable
  projectId: number | null
  experienceId: number | null
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

export interface ProfileAdmin {
  name: string
  shortName: string
  role: Translatable
  roleAlternatives: Translatable[]
  tagline: Translatable
  bio: Translatable
  bioExtended: Translatable
  availableForWork: boolean
  email: string
  location: string
  avatarUrl: string
  cvUrl: string
}
