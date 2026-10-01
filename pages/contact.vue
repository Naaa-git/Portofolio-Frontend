<script setup lang="ts">
import { Mail, MapPin, Github, Linkedin, Copy, Check } from 'lucide-vue-next'

const profileStore = useProfileStore()
const iconMap = { github: Github, linkedin: Linkedin, mail: Mail }

useHead({
  title: `Contact — ${profileStore.profile.name}`,
  meta: [{ name: 'description', content: `Get in touch with ${profileStore.profile.name}.` }],
})
const copied = ref(false)

const form = reactive({
  name: '',
  email: '',
  message: '',
})

const isSubmitting = ref(false)
const isSubmitted = ref(false)

async function copyEmail() {
  await navigator.clipboard.writeText(profileStore.profile.email)
  copied.value = true
  setTimeout(() => { copied.value = false }, 2000)
}

async function handleSubmit() {
  isSubmitting.value = true
  await new Promise(resolve => setTimeout(resolve, 1000))
  isSubmitting.value = false
  isSubmitted.value = true
}
</script>

<template>
  <div class="section-padding">
    <div class="container-max max-w-4xl">
      <!-- Header -->
      <div class="text-center mb-16">
        <h1 class="text-4xl md:text-5xl font-bold mb-4">Get in Touch</h1>
        <p class="text-slate-600 dark:text-slate-400 text-lg max-w-lg mx-auto">
          Have a project in mind or just want to say hello? My inbox is always open.
        </p>
      </div>

      <div class="grid md:grid-cols-5 gap-8">
        <!-- Contact info -->
        <div class="md:col-span-2 space-y-4">
          <div class="glass rounded-2xl p-6">
            <h2 class="font-semibold mb-4">Contact Info</h2>

            <div class="space-y-4">
              <div class="flex items-center gap-3">
                <div class="w-9 h-9 rounded-xl bg-accent-500/10 flex items-center justify-center text-accent-500 shrink-0">
                  <MapPin :size="16" />
                </div>
                <div>
                  <p class="text-xs text-slate-500 dark:text-slate-500">Location</p>
                  <p class="text-sm font-medium">{{ profileStore.profile.location }}</p>
                </div>
              </div>

              <div class="flex items-center gap-3">
                <div class="w-9 h-9 rounded-xl bg-accent-500/10 flex items-center justify-center text-accent-500 shrink-0">
                  <Mail :size="16" />
                </div>
                <div class="flex-1 min-w-0">
                  <p class="text-xs text-slate-500 dark:text-slate-500">Email</p>
                  <div class="flex items-center gap-2">
                    <p class="text-sm font-medium truncate">{{ profileStore.profile.email }}</p>
                    <button
                      class="text-slate-400 hover:text-accent-500 transition-colors shrink-0"
                      @click="copyEmail"
                    >
                      <Check v-if="copied" :size="14" class="text-emerald-500" />
                      <Copy v-else :size="14" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="glass rounded-2xl p-6">
            <h2 class="font-semibold mb-4">Social</h2>
            <div class="space-y-2">
              <a
                v-for="link in profileStore.socialLinks.filter(l => l.icon !== 'mail')"
                :key="link.id"
                :href="link.url"
                target="_blank"
                rel="noopener noreferrer"
                class="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-400 hover:text-accent-500 transition-colors"
              >
                <component :is="iconMap[link.icon as keyof typeof iconMap]" :size="16" /> {{ link.name }}
              </a>
            </div>
          </div>
        </div>

        <!-- Form -->
        <div class="md:col-span-3">
          <div class="glass rounded-2xl p-8">
            <div v-if="isSubmitted" class="text-center py-10">
              <div class="w-16 h-16 rounded-full bg-emerald-500/10 flex items-center justify-center mx-auto mb-4">
                <Check :size="28" class="text-emerald-500" />
              </div>
              <h3 class="text-xl font-semibold mb-2">Message sent!</h3>
              <p class="text-slate-500 dark:text-slate-400">Thank you for reaching out. I'll get back to you soon.</p>
            </div>

            <form v-else class="space-y-5" @submit.prevent="handleSubmit">
              <div>
                <label class="block text-sm font-medium mb-1.5">Name</label>
                <input
                  v-model="form.name"
                  type="text"
                  required
                  placeholder="Your name"
                  class="w-full px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-sm focus:outline-none focus:border-accent-500 focus:ring-1 focus:ring-accent-500 transition-all"
                />
              </div>

              <div>
                <label class="block text-sm font-medium mb-1.5">Email</label>
                <input
                  v-model="form.email"
                  type="email"
                  required
                  placeholder="your@email.com"
                  class="w-full px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-sm focus:outline-none focus:border-accent-500 focus:ring-1 focus:ring-accent-500 transition-all"
                />
              </div>

              <div>
                <label class="block text-sm font-medium mb-1.5">Message</label>
                <textarea
                  v-model="form.message"
                  required
                  rows="5"
                  placeholder="Tell me about your project..."
                  class="w-full px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-sm focus:outline-none focus:border-accent-500 focus:ring-1 focus:ring-accent-500 transition-all resize-none"
                />
              </div>

              <AppButton type="submit" size="lg" class="w-full" :disabled="isSubmitting">
                {{ isSubmitting ? 'Sending...' : 'Send Message' }}
              </AppButton>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
