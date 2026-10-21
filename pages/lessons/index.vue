<script setup lang="ts">
const lessonStore = useLessonStore()
const localePath = useLocalePath()
const { t } = useI18n()

await callOnce('lessons-public-data', () => lessonStore.loadAll())

useHead({ title: `${t('lessons.heading')}` })

function lessonsFor(categoryId: number) {
  return lessonStore.lessons.filter(l => l.categoryId === categoryId)
}
</script>

<template>
  <div class="section-padding">
    <div class="container-max max-w-4xl">
      <h1 class="text-4xl font-bold mb-3">{{ $t('lessons.heading') }}</h1>
      <p class="text-slate-600 dark:text-slate-400 mb-16">{{ $t('lessons.subheading') }}</p>

      <div v-for="category in lessonStore.categories" :key="category.id" class="mb-16">
        <h2 class="text-2xl font-bold mb-6">{{ category.name }}</h2>
        <div class="space-y-4">
          <div
            v-for="lesson in lessonsFor(category.id)"
            :key="lesson.id"
            class="glass rounded-xl p-5"
            v-motion
            :initial="{ opacity: 0, y: 20 }"
            :visibleOnce="{ opacity: 1, y: 0 }"
          >
            <h3 class="font-semibold mb-2">{{ lesson.title }}</h3>
            <p class="text-sm text-slate-600 dark:text-slate-400 leading-relaxed mb-3">{{ lesson.description }}</p>
            <div v-if="lesson.projectSlug || lesson.experienceCompany" class="flex flex-wrap gap-2">
              <NuxtLink v-if="lesson.projectSlug" :to="localePath(`/projects/${lesson.projectSlug}`)">
                <AppBadge variant="accent">{{ $t('lessons.relatedToProject', { title: lesson.projectTitle }) }}</AppBadge>
              </NuxtLink>
              <AppBadge v-if="lesson.experienceCompany" variant="default">
                {{ $t('lessons.fromExperience', { company: lesson.experienceCompany }) }}
              </AppBadge>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
