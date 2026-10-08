<script setup lang="ts">
import { Download, Briefcase, MapPin } from 'lucide-vue-next'

const profileStore = useProfileStore()
const localePath = useLocalePath()

useSeoMeta({
  title: `About — ${profileStore.profile.name}`,
  description: profileStore.profile.bio,
  ogTitle: `About — ${profileStore.profile.name}`,
  ogDescription: profileStore.profile.bio,
  ogImage: profileStore.profile.avatarUrl,
  twitterCard: 'summary_large_image',
})
</script>

<template>
  <div class="section-padding">
    <div class="container-max">
      <!-- Profile Section -->
      <div class="grid md:grid-cols-3 gap-10 mb-20 items-start">
        <div class="md:col-span-1">
          <div class="glass rounded-2xl p-6 text-center sticky top-24">
            <div class="w-28 h-28 rounded-2xl overflow-hidden mx-auto mb-4 bg-slate-200 dark:bg-slate-700">
              <NuxtImg
                :src="profileStore.profile.avatarUrl"
                :alt="profileStore.profile.name"
                class="w-full h-full object-cover"
              />
            </div>
            <h2 class="font-bold text-lg">{{ profileStore.profile.name }}</h2>
            <p class="text-sm text-slate-500 dark:text-slate-400 mb-1">{{ profileStore.profile.role }}</p>
            <div class="flex items-center justify-center gap-1 text-xs text-slate-500 dark:text-slate-500 mb-4">
              <MapPin :size="12" />
              {{ profileStore.profile.location }}
            </div>
            <AppBadge variant="success" class="mb-4">{{ $t('about.availableForWork') }}</AppBadge>
            <AppButton :href="profileStore.profile.cvUrl" variant="outline" class="w-full" external>
              <Download :size="14" /> {{ $t('about.downloadCv') }}
            </AppButton>
          </div>
        </div>

        <div class="md:col-span-2">
          <h1 class="text-4xl font-bold mb-6">{{ $t('about.heading') }}</h1>
          <p class="text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
            {{ profileStore.profile.bio }}
          </p>
          <p class="text-slate-600 dark:text-slate-400 leading-relaxed">
            {{ profileStore.profile.bioExtended }}
          </p>
        </div>
      </div>

      <!-- Skills -->
      <div class="mb-20">
        <h2 class="text-2xl font-bold mb-8">{{ $t('about.skillsHeading') }}</h2>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div
            v-for="skillGroup in profileStore.skills"
            :key="skillGroup.category"
            class="glass rounded-xl p-5"
            v-motion
            :initial="{ opacity: 0, y: 20 }"
            :visibleOnce="{ opacity: 1, y: 0 }"
          >
            <h3 class="text-sm font-semibold text-accent-500 mb-3">{{ skillGroup.category }}</h3>
            <div class="flex flex-wrap gap-2">
              <AppBadge v-for="item in skillGroup.items" :key="item" variant="default">
                {{ item }}
              </AppBadge>
            </div>
          </div>
        </div>
      </div>

      <!-- Experience -->
      <div>
        <h2 class="text-2xl font-bold mb-8">{{ $t('about.experienceHeading') }}</h2>
        <div class="space-y-6">
          <div
            v-for="exp in profileStore.experiences"
            :key="exp.id"
            class="glass rounded-2xl p-6"
            v-motion
            :initial="{ opacity: 0, x: -20 }"
            :visibleOnce="{ opacity: 1, x: 0 }"
          >
            <div class="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-4">
              <div>
                <div class="flex items-center gap-2 mb-1">
                  <Briefcase :size="14" class="text-accent-500" />
                  <span class="font-semibold">{{ exp.role }}</span>
                  <AppBadge v-if="exp.current" variant="success">{{ $t('about.current') }}</AppBadge>
                </div>
                <p class="text-sm text-accent-500 font-medium">{{ exp.company }}</p>
                <p class="text-xs text-slate-500 dark:text-slate-500 mt-0.5">{{ exp.location }}</p>
              </div>
              <div class="text-sm text-slate-500 shrink-0">{{ exp.period }}</div>
            </div>

            <ul class="space-y-2 mb-4">
              <li
                v-for="(item, i) in exp.description"
                :key="i"
                class="text-sm text-slate-600 dark:text-slate-400 flex gap-2"
              >
                <span class="text-accent-500 mt-0.5 shrink-0">•</span>
                {{ item }}
              </li>
            </ul>

            <div class="flex flex-wrap gap-1.5">
              <AppBadge v-for="skill in exp.skills" :key="skill" variant="accent">
                {{ skill }}
              </AppBadge>
            </div>
          </div>
        </div>
      </div>

      <!-- Quiet pointer to the non-professional side -->
      <div class="text-center mt-16">
        <NuxtLink :to="localePath('/outside-code')" class="text-sm text-slate-400 hover:text-accent-500 transition-colors">
          {{ $t('about.outsideCodeHint') }}
        </NuxtLink>
      </div>
    </div>
  </div>
</template>
