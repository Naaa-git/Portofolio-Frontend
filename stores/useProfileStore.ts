import { defineStore } from 'pinia'
import { profileService } from '~/services/profileService'
import type { Profile, Skill, SocialLink, Experience } from '~/types'

const emptyProfile: Profile = {
  name: '',
  shortName: '',
  role: '',
  roleAlternatives: [],
  tagline: '',
  bio: '',
  bioExtended: '',
  availableForWork: false,
  email: '',
  location: '',
  avatarUrl: '',
  cvUrl: '',
}

export const useProfileStore = defineStore('profile', () => {
  const profile = ref<Profile>({ ...emptyProfile })
  const skills = ref<Skill[]>([])
  const socialLinks = ref<SocialLink[]>([])
  const experiences = ref<Experience[]>([])

  async function loadAll() {
    const [profileData, skillsData, socialLinksData, experiencesData] = await Promise.all([
      profileService.getProfile(),
      profileService.getSkills(),
      profileService.getSocialLinks(),
      profileService.getExperiences(),
    ])
    profile.value = profileData
    skills.value = skillsData
    socialLinks.value = socialLinksData
    experiences.value = experiencesData
  }

  // --- Profile (singleton) ---
  async function updateProfile(dto: Profile) {
    profile.value = await profileService.updateProfile(dto)
  }

  // --- Skills ---
  async function addSkill(dto: Omit<Skill, 'id'>) {
    skills.value.push(await profileService.createSkill(dto))
  }

  async function updateSkill(id: number, dto: Omit<Skill, 'id'>) {
    await profileService.updateSkill(id, dto)
    const index = skills.value.findIndex(s => s.id === id)
    if (index !== -1) skills.value[index] = { id, ...dto }
  }

  async function deleteSkill(id: number) {
    await profileService.deleteSkill(id)
    skills.value = skills.value.filter(s => s.id !== id)
  }

  // --- Social Links ---
  async function addSocialLink(dto: Omit<SocialLink, 'id'>) {
    socialLinks.value.push(await profileService.createSocialLink(dto))
  }

  async function updateSocialLink(id: number, dto: Omit<SocialLink, 'id'>) {
    await profileService.updateSocialLink(id, dto)
    const index = socialLinks.value.findIndex(s => s.id === id)
    if (index !== -1) socialLinks.value[index] = { id, ...dto }
  }

  async function deleteSocialLink(id: number) {
    await profileService.deleteSocialLink(id)
    socialLinks.value = socialLinks.value.filter(s => s.id !== id)
  }

  // --- Experiences ---
  async function addExperience(dto: Omit<Experience, 'id'>) {
    experiences.value.push(await profileService.createExperience(dto))
  }

  async function updateExperience(id: number, dto: Omit<Experience, 'id'>) {
    await profileService.updateExperience(id, dto)
    const index = experiences.value.findIndex(e => e.id === id)
    if (index !== -1) experiences.value[index] = { id, ...dto }
  }

  async function deleteExperience(id: number) {
    await profileService.deleteExperience(id)
    experiences.value = experiences.value.filter(e => e.id !== id)
  }

  return {
    profile,
    skills,
    socialLinks,
    experiences,
    loadAll,
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
