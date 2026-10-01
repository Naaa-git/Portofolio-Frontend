import { defineStore } from 'pinia'
import { profileService } from '~/services/profileService'

export const useProfileStore = defineStore('profile', () => {
  const profile = ref(profileService.getProfile())
  const skills = ref(profileService.getSkills())
  const socialLinks = ref(profileService.getSocialLinks())
  const experiences = ref(profileService.getExperiences())

  return { profile, skills, socialLinks, experiences }
})
