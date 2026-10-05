import { defineStore } from 'pinia'
import { profileService } from '~/services/profileService'
import type { Profile, ProfileAdmin, Skill, SkillAdmin, SocialLink, Experience, ExperienceAdmin } from '~/types'

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

const emptyAdminProfile: ProfileAdmin = {
  name: '',
  shortName: '',
  role: { id: '', en: '' },
  roleAlternatives: [],
  tagline: { id: '', en: '' },
  bio: { id: '', en: '' },
  bioExtended: { id: '', en: '' },
  availableForWork: false,
  email: '',
  location: '',
  avatarUrl: '',
  cvUrl: '',
}

export const useProfileStore = defineStore('profile', () => {
  // --- Public (resolved for the current locale) ---
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

  // --- Admin (raw bilingual dictionaries, for editing) ---
  const adminProfile = ref<ProfileAdmin>({ ...emptyAdminProfile })
  const adminSkills = ref<SkillAdmin[]>([])
  const adminExperiences = ref<ExperienceAdmin[]>([])
  const isAdminLoaded = ref(false)

  async function loadAdmin() {
    if (isAdminLoaded.value) return
    const [profileData, skillsData, experiencesData] = await Promise.all([
      profileService.getProfileAdmin(),
      profileService.getSkillsAdmin(),
      profileService.getExperiencesAdmin(),
    ])
    adminProfile.value = profileData
    adminSkills.value = skillsData
    adminExperiences.value = experiencesData
    isAdminLoaded.value = true
  }

  async function updateProfile(dto: ProfileAdmin) {
    adminProfile.value = await profileService.updateProfile(dto)
  }

  async function addSkill(dto: Omit<SkillAdmin, 'id'>) {
    adminSkills.value.push(await profileService.createSkill(dto))
  }

  async function updateSkill(id: number, dto: Omit<SkillAdmin, 'id'>) {
    await profileService.updateSkill(id, dto)
    const index = adminSkills.value.findIndex(s => s.id === id)
    if (index !== -1) adminSkills.value[index] = { id, ...dto }
  }

  async function deleteSkill(id: number) {
    await profileService.deleteSkill(id)
    adminSkills.value = adminSkills.value.filter(s => s.id !== id)
  }

  // --- Social Links (not translatable) ---
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
  async function addExperience(dto: Omit<ExperienceAdmin, 'id'>) {
    adminExperiences.value.push(await profileService.createExperience(dto))
  }

  async function updateExperience(id: number, dto: Omit<ExperienceAdmin, 'id'>) {
    await profileService.updateExperience(id, dto)
    const index = adminExperiences.value.findIndex(e => e.id === id)
    if (index !== -1) adminExperiences.value[index] = { id, ...dto }
  }

  async function deleteExperience(id: number) {
    await profileService.deleteExperience(id)
    adminExperiences.value = adminExperiences.value.filter(e => e.id !== id)
  }

  return {
    profile,
    skills,
    socialLinks,
    experiences,
    loadAll,
    adminProfile,
    adminSkills,
    adminExperiences,
    loadAdmin,
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
