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

export interface AwayFromKeyboardItem {
  id: number
  title: string
  note: string
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

export interface LifeInspiration {
  id: number
  name: string
  aspect: string
  note: string
  imageUrl: string | null
  sortOrder: number
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
