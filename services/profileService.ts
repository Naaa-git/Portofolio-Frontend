import { profile, skills, socialLinks } from '~/data/profile'
import { experiences } from '~/data/experience'

export const profileService = {
  getProfile() {
    return profile
  },

  getSkills() {
    return skills
  },

  getSocialLinks() {
    return socialLinks
  },

  getExperiences() {
    return experiences
  },
}
