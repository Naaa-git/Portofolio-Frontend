import { defineStore } from 'pinia'
import { profileService } from '~/services/profileService'
import type { Skill, SocialLink, Experience } from '~/types'

function nextId(items: { id: number }[]) {
  return items.length ? Math.max(...items.map(i => i.id)) + 1 : 1
}

export const useProfileStore = defineStore('profile', () => {
  const profile = ref(profileService.getProfile())

  // NOTE: Skill/SocialLink in types/index.ts have no `id` (they come from the
  // original hardcoded arrays). The admin UI needs stable ids to edit/delete
  // rows, so we attach one locally until this is backed by the real API
  // (which does have an Id column).
  const skills = ref(profileService.getSkills().map((s, i) => ({ id: i + 1, ...s })))
  const socialLinks = ref(profileService.getSocialLinks().map((s, i) => ({ id: i + 1, ...s })))
  const experiences = ref(profileService.getExperiences())

  // --- Profile (singleton) ---
  function updateProfile(dto: typeof profile.value) {
    profile.value = { ...dto }
  }

  // --- Skills ---
  function addSkill(skill: Skill) {
    skills.value.push({ id: nextId(skills.value), ...skill })
  }

  function updateSkill(id: number, skill: Skill) {
    const index = skills.value.findIndex(s => s.id === id)
    if (index !== -1) skills.value[index] = { id, ...skill }
  }

  function deleteSkill(id: number) {
    skills.value = skills.value.filter(s => s.id !== id)
  }

  // --- Social Links ---
  function addSocialLink(link: SocialLink) {
    socialLinks.value.push({ id: nextId(socialLinks.value), ...link })
  }

  function updateSocialLink(id: number, link: SocialLink) {
    const index = socialLinks.value.findIndex(s => s.id === id)
    if (index !== -1) socialLinks.value[index] = { id, ...link }
  }

  function deleteSocialLink(id: number) {
    socialLinks.value = socialLinks.value.filter(s => s.id !== id)
  }

  // --- Experiences ---
  function addExperience(experience: Omit<Experience, 'id'>) {
    experiences.value.push({ id: nextId(experiences.value), ...experience })
  }

  function updateExperience(id: number, experience: Omit<Experience, 'id'>) {
    const index = experiences.value.findIndex(e => e.id === id)
    if (index !== -1) experiences.value[index] = { id, ...experience }
  }

  function deleteExperience(id: number) {
    experiences.value = experiences.value.filter(e => e.id !== id)
  }

  return {
    profile,
    skills,
    socialLinks,
    experiences,
    updateProfile,
    addSkill,
    updateSkill,
    deleteSkill,
    addSocialLink,
    updateSocialLink,
    deleteSocialLink,
    addExperience,
    updateExperience,
    deleteExperience,
  }
})
