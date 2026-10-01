import { apiFetch } from './apiClient'
import type { Profile, Skill, SocialLink, Experience } from '~/types'

export const profileService = {
  getProfile: () => apiFetch<Profile>('/profile'),
  updateProfile: (dto: Profile) => apiFetch<Profile>('/profile', { method: 'PUT', body: dto }),

  getSkills: () => apiFetch<Skill[]>('/skills'),
  createSkill: (dto: Omit<Skill, 'id'>) => apiFetch<Skill>('/skills', { method: 'POST', body: dto }),
  updateSkill: (id: number, dto: Omit<Skill, 'id'>) => apiFetch<void>(`/skills/${id}`, { method: 'PUT', body: dto }),
  deleteSkill: (id: number) => apiFetch<void>(`/skills/${id}`, { method: 'DELETE' }),

  getSocialLinks: () => apiFetch<SocialLink[]>('/social-links'),
  createSocialLink: (dto: Omit<SocialLink, 'id'>) => apiFetch<SocialLink>('/social-links', { method: 'POST', body: dto }),
  updateSocialLink: (id: number, dto: Omit<SocialLink, 'id'>) => apiFetch<void>(`/social-links/${id}`, { method: 'PUT', body: dto }),
  deleteSocialLink: (id: number) => apiFetch<void>(`/social-links/${id}`, { method: 'DELETE' }),

  getExperiences: () => apiFetch<Experience[]>('/experiences'),
  createExperience: (dto: Omit<Experience, 'id'>) => apiFetch<Experience>('/experiences', { method: 'POST', body: dto }),
  updateExperience: (id: number, dto: Omit<Experience, 'id'>) => apiFetch<void>(`/experiences/${id}`, { method: 'PUT', body: dto }),
  deleteExperience: (id: number) => apiFetch<void>(`/experiences/${id}`, { method: 'DELETE' }),
}
