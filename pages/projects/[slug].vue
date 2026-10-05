<script setup lang="ts">
import { ArrowLeft, Github, ExternalLink } from 'lucide-vue-next'

const route = useRoute()
const profileStore = useProfileStore()
const projectStore = useProjectStore()
const localePath = useLocalePath()
const slug = route.params.slug as string

const { data: project } = await useAsyncData(`project-${slug}`, () => projectStore.getBySlug(slug))

if (!project.value) {
  throw createError({ statusCode: 404, statusMessage: 'Project not found' })
}

useHead({
  title: `${project.value.title} — ${profileStore.profile.name}`,
  meta: [{ name: 'description', content: project.value.shortDescription }],
})
</script>

<template>
  <div class="section-padding">
    <div class="container-max max-w-4xl">
      <!-- Back button -->
      <div class="mb-8">
        <AppButton :href="localePath('/projects')" variant="ghost" size="sm">
          <ArrowLeft :size="16" /> {{ $t('projects.backToProjects') }}
        </AppButton>
      </div>

      <!-- Header -->
      <div class="mb-8">
        <AppBadge variant="accent" class="mb-4">{{ project.category }}</AppBadge>
        <h1 class="text-3xl md:text-4xl font-bold mb-4">{{ project.title }}</h1>
        <p class="text-lg text-slate-600 dark:text-slate-400">{{ project.shortDescription }}</p>
      </div>

      <!-- Image -->
      <div class="rounded-2xl overflow-hidden mb-8 bg-slate-100 dark:bg-slate-800 aspect-video">
        <NuxtImg
          :src="project.imageUrl"
          :alt="project.title"
          class="w-full h-full object-cover"
        />
      </div>

      <!-- Links -->
      <div class="flex gap-3 mb-10">
        <AppButton :href="project.githubUrl" external variant="secondary">
          <Github :size="16" /> {{ $t('projects.github') }}
        </AppButton>
        <AppButton :href="project.demoUrl" external>
          <ExternalLink :size="16" /> {{ $t('projects.liveDemo') }}
        </AppButton>
      </div>

      <!-- Content grid -->
      <div class="grid md:grid-cols-3 gap-8">
        <div class="md:col-span-2">
          <h2 class="text-xl font-semibold mb-4">{{ $t('projects.aboutProject') }}</h2>
          <p class="text-slate-600 dark:text-slate-400 leading-relaxed whitespace-pre-line">
            {{ project.longDescription }}
          </p>
        </div>

        <div>
          <h2 class="text-xl font-semibold mb-4">{{ $t('projects.techStack') }}</h2>
          <div class="flex flex-wrap gap-2">
            <AppBadge
              v-for="tech in project.techStack"
              :key="tech"
              variant="default"
            >
              {{ tech }}
            </AppBadge>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
