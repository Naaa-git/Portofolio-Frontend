import { apiFetch } from './apiClient'
import type { Profile, ProfileAdmin, Skill, SkillAdmin, SocialLink, Experience, ExperienceAdmin } from '~/types'

export const profileService = {
  getProfile: () => apiFetch<Profile>('/profile'),
  getProfileAdmin: () => apiFetch<ProfileAdmin>('/profile/admin'),
  updateProfile: (dto: ProfileAdmin) => apiFetch<ProfileAdmin>('/profile', { method: 'PUT', body: dto }),

  getSkills: () => apiFetch<Skill[]>('/skills'),
  getSkillsAdmin: () => apiFetch<SkillAdmin[]>('/skills/admin'),
  createSkill: (dto: Omit<SkillAdmin, 'id'>) => apiFetch<SkillAdmin>('/skills', { method: 'POST', body: dto }),
  updateSkill: (id: number, dto: Omit<SkillAdmin, 'id'>) => apiFetch<void>(`/skills/${id}`, { method: 'PUT', body: dto }),
  deleteSkill: (id: number) => apiFetch<void>(`/skills/${id}`, { method: 'DELETE' }),

  getSocialLinks: () => apiFetch<SocialLink[]>('/social-links'),
  createSocialLink: (dto: Omit<SocialLink, 'id'>) => apiFetch<SocialLink>('/social-links', { method: 'POST', body: dto }),
  updateSocialLink: (id: number, dto: Omit<SocialLink, 'id'>) => apiFetch<void>(`/social-links/${id}`, { method: 'PUT', body: dto }),
  deleteSocialLink: (id: number) => apiFetch<void>(`/social-links/${id}`, { method: 'DELETE' }),

  getExperiences: () => apiFetch<Experience[]>('/experiences'),
  getExperiencesAdmin: () => apiFetch<ExperienceAdmin[]>('/experiences/admin'),
  createExperience: (dto: Omit<ExperienceAdmin, 'id'>) => apiFetch<ExperienceAdmin>('/experiences', { method: 'POST', body: dto }),
  updateExperience: (id: number, dto: Omit<ExperienceAdmin, 'id'>) => apiFetch<void>(`/experiences/${id}`, { method: 'PUT', body: dto }),
  deleteExperience: (id: number) => apiFetch<void>(`/experiences/${id}`, { method: 'DELETE' }),
}
