<script setup lang="ts">
import { ArrowRight, MapPin, Sparkles } from 'lucide-vue-next'

const projectStore = useProjectStore()
const profileStore = useProfileStore()

await callOnce('projects-data', () => projectStore.loadProjects())

useHead({
  title: `${profileStore.profile.name} — ${profileStore.profile.role}`,
  meta: [
    { name: 'description', content: profileStore.profile.tagline },
  ],
})

const nameWords = computed(() => profileStore.profile.name.split(' '))
const firstNames = computed(() => nameWords.value.slice(0, -1).join(' '))
const lastName = computed(() => nameWords.value.at(-1))

const roleIndex = ref(0)
const displayRole = ref('')
const isTyping = ref(true)

const roles = ['Fullstack Developer', '.NET Specialist', 'Vue.js Developer', 'React Developer']

// Typing animation
let timeout: ReturnType<typeof setTimeout>

function typeRole() {
  const current = roles[roleIndex.value]
  if (isTyping.value) {
    if (displayRole.value.length < current.length) {
      displayRole.value = current.slice(0, displayRole.value.length + 1)
      timeout = setTimeout(typeRole, 80)
    } else {
      timeout = setTimeout(() => {
        isTyping.value = false
        typeRole()
      }, 2000)
    }
  } else {
    if (displayRole.value.length > 0) {
      displayRole.value = displayRole.value.slice(0, -1)
      timeout = setTimeout(typeRole, 40)
    } else {
      isTyping.value = true
      roleIndex.value = (roleIndex.value + 1) % roles.length
      typeRole()
    }
  }
}

onMounted(() => {
  typeRole()
})

onUnmounted(() => {
  clearTimeout(timeout)
})
</script>

<template>
  <div>
    <!-- Hero Section -->
    <section class="relative min-h-screen flex items-center section-padding overflow-hidden">
      <!-- Background gradient blobs -->
      <div class="absolute inset-0 overflow-hidden pointer-events-none">
        <div class="absolute top-1/4 -left-20 w-96 h-96 bg-accent-500/10 rounded-full blur-3xl" />
        <div class="absolute bottom-1/4 -right-20 w-96 h-96 bg-violet-500/10 rounded-full blur-3xl" />
      </div>

      <div class="container-max relative z-10">
        <div class="max-w-3xl">
          <!-- Available badge -->
          <div
            v-if="profileStore.profile.availableForWork"
            v-motion
            :initial="{ opacity: 0, y: 20 }"
            :enter="{ opacity: 1, y: 0, transition: { delay: 100 } }"
            class="inline-flex items-center gap-2 glass px-4 py-2 rounded-full text-sm mb-8"
          >
            <span class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span class="text-slate-600 dark:text-slate-400">Available for new opportunities</span>
          </div>

          <!-- Name -->
          <h1
            v-motion
            :initial="{ opacity: 0, y: 30 }"
            :enter="{ opacity: 1, y: 0, transition: { delay: 200 } }"
            class="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-4"
          >
            {{ firstNames }}
            <span class="text-accent-500">{{ lastName }}</span>
          </h1>

          <!-- Typing role -->
          <div
            v-motion
            :initial="{ opacity: 0, y: 30 }"
            :enter="{ opacity: 1, y: 0, transition: { delay: 300 } }"
            class="text-2xl md:text-3xl font-light text-slate-500 dark:text-slate-400 mb-6 h-10"
          >
            {{ displayRole }}<span class="animate-pulse text-accent-500">|</span>
          </div>

          <!-- Tagline -->
          <p
            v-motion
            :initial="{ opacity: 0, y: 30 }"
            :enter="{ opacity: 1, y: 0, transition: { delay: 400 } }"
            class="text-lg text-slate-600 dark:text-slate-400 mb-4 max-w-xl leading-relaxed"
          >
            {{ profileStore.profile.tagline }}
          </p>

          <!-- Location -->
          <div
            v-motion
            :initial="{ opacity: 0, y: 30 }"
            :enter="{ opacity: 1, y: 0, transition: { delay: 450 } }"
            class="flex items-center gap-1.5 text-sm text-slate-500 dark:text-slate-500 mb-10"
          >
            <MapPin :size="14" />
            {{ profileStore.profile.location }}
          </div>

          <!-- CTAs -->
          <div
            v-motion
            :initial="{ opacity: 0, y: 30 }"
            :enter="{ opacity: 1, y: 0, transition: { delay: 500 } }"
            class="flex flex-wrap gap-3"
          >
            <AppButton href="/projects" size="lg">
              View Projects
              <ArrowRight :size="18" />
            </AppButton>
            <AppButton href="/contact" variant="secondary" size="lg">
              Get in Touch
            </AppButton>
          </div>
        </div>
      </div>
    </section>

    <!-- Featured Projects -->
    <SectionWrapper id="projects">
      <div class="flex items-end justify-between mb-10">
        <div>
          <div class="flex items-center gap-2 text-accent-500 text-sm font-medium mb-2">
            <Sparkles :size="14" />
            Featured Work
          </div>
          <h2 class="text-3xl md:text-4xl font-bold">Selected Projects</h2>
        </div>
        <AppButton href="/projects" variant="ghost">
          View all <ArrowRight :size="16" />
        </AppButton>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <ProjectCard
          v-for="(project, i) in projectStore.featuredProjects"
          :key="project.id"
          :project="project"
          v-motion
          :initial="{ opacity: 0, y: 40 }"
          :visibleOnce="{ opacity: 1, y: 0, transition: { delay: i * 100 } }"
        />
      </div>
    </SectionWrapper>

    <!-- Short About -->
    <SectionWrapper>
      <div class="glass rounded-3xl p-8 md:p-12 grid md:grid-cols-2 gap-10 items-center">
        <div>
          <div class="text-accent-500 text-sm font-medium mb-2">About Me</div>
          <h2 class="text-3xl font-bold mb-4">Turning ideas into<br />production-ready code</h2>
          <p class="text-slate-600 dark:text-slate-400 leading-relaxed mb-6">
            {{ profileStore.profile.bio }}
          </p>
          <AppButton href="/about" variant="outline">
            Learn More <ArrowRight :size="16" />
          </AppButton>
        </div>
        <div class="grid grid-cols-2 gap-4">
          <div
            v-for="skill in profileStore.skills.slice(0, 4)"
            :key="skill.category"
            class="glass-subtle rounded-xl p-4"
          >
            <div class="text-xs font-medium text-accent-500 mb-2">{{ skill.category }}</div>
            <div class="flex flex-wrap gap-1">
              <span
                v-for="item in skill.items.slice(0, 3)"
                :key="item"
                class="text-xs text-slate-600 dark:text-slate-400"
              >{{ item }}</span>
            </div>
          </div>
        </div>
      </div>
    </SectionWrapper>

    <!-- CTA Contact -->
    <SectionWrapper>
      <div class="text-center max-w-2xl mx-auto">
        <h2 class="text-3xl md:text-4xl font-bold mb-4">Let's work together</h2>
        <p class="text-slate-600 dark:text-slate-400 mb-8">
          Have a project in mind or looking for a developer to join your team? I'd love to hear from you.
        </p>
        <AppButton href="/contact" size="lg">
          Get in Touch <ArrowRight :size="18" />
        </AppButton>
      </div>
    </SectionWrapper>
  </div>
</template>
