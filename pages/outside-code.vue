<script setup lang="ts">
useSeoMeta({
  title: 'Outside Code — Pradana Aldi Musthofa',
  description: 'A personal space — who I am outside of being a developer.',
  ogTitle: 'Outside Code — Pradana Aldi Musthofa',
  ogDescription: 'A personal space — who I am outside of being a developer.',
  twitterCard: 'summary',
})

const outsideCodeStore = useOutsideCodeStore()
await callOnce('outside-code-data', () => outsideCodeStore.loadAll())

const currentlyReading = computed(() => outsideCodeStore.books.find(b => b.isCurrentlyReading))
const memorableBooks = computed(() => outsideCodeStore.books.filter(b => !b.isCurrentlyReading))
</script>

<template>
  <div class="section-padding">
    <div class="container-max max-w-3xl">
      <!-- Intro -->
      <div class="mb-16">
        <div class="text-accent-500 text-sm font-medium mb-2">Outside Code</div>
        <h1 class="text-3xl md:text-4xl font-bold mb-4">{{ $t('outsideCode.heading') }}</h1>
        <p class="text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
          {{ outsideCodeStore.intro.paragraph1 }}
        </p>
        <p class="text-slate-600 dark:text-slate-400 leading-relaxed">
          {{ outsideCodeStore.intro.paragraph2 }}
        </p>
      </div>

      <!-- Away From the Keyboard -->
      <div v-if="outsideCodeStore.awayFromKeyboard.length" class="mb-16">
        <h2 class="text-2xl font-bold mb-6">{{ $t('outsideCode.awayFromKeyboard') }}</h2>
        <div class="divide-y divide-slate-200 dark:divide-slate-800">
          <div v-for="(item, i) in outsideCodeStore.awayFromKeyboard" :key="item.id" class="flex items-start gap-4 py-5 first:pt-0">
            <span class="text-2xl font-bold text-slate-200 dark:text-slate-700 tabular-nums w-10 shrink-0">{{ String(i + 1).padStart(2, '0') }}</span>
            <img v-if="item.imageUrl" :src="item.imageUrl" :alt="item.title" class="w-14 h-14 rounded-full object-cover shrink-0" />
            <div>
              <h3 class="text-sm font-semibold text-accent-500 mb-1">{{ item.title }}</h3>
              <p class="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">{{ item.note }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Movies & Shows -->
      <div v-if="outsideCodeStore.movies.length" class="mb-16">
        <h2 class="text-2xl font-bold mb-6">{{ $t('outsideCode.moviesAndShows') }}</h2>
        <div class="grid sm:grid-cols-2 gap-4">
          <div v-for="take in outsideCodeStore.movies" :key="take.id" class="glass rounded-xl overflow-hidden">
            <img v-if="take.imageUrl" :src="take.imageUrl" :alt="take.title" class="w-full h-40 object-cover" />
            <div class="p-5">
              <h3 class="text-sm font-semibold text-slate-800 dark:text-slate-100 mb-1.5">{{ take.title }}</h3>
              <p class="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">{{ take.take }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Music & Podcasts -->
      <div v-if="outsideCodeStore.musicArtists.length || outsideCodeStore.podcasts.length" class="mb-16">
        <h2 class="text-2xl font-bold mb-4">{{ $t('outsideCode.musicAndPodcasts') }}</h2>
        <div v-if="outsideCodeStore.musicArtists.length" class="mb-6">
          <p class="text-sm text-slate-500 dark:text-slate-500 mb-3">{{ $t('outsideCode.artistsSubheading') }}</p>
          <div class="flex flex-wrap gap-4">
            <a
              v-for="artist in outsideCodeStore.musicArtists"
              :key="artist.id"
              :href="artist.url"
              target="_blank"
              rel="noopener noreferrer"
              class="group text-center w-16"
            >
              <div class="w-16 h-16 rounded-full overflow-hidden bg-slate-100 dark:bg-white/5 mb-2">
                <img v-if="artist.imageUrl" :src="artist.imageUrl" :alt="artist.name" class="w-full h-full object-cover" />
              </div>
              <p class="text-xs font-medium text-slate-600 dark:text-slate-400 group-hover:text-accent-500 transition-colors">{{ artist.name }}</p>
            </a>
          </div>
        </div>
        <div v-if="outsideCodeStore.podcasts.length">
          <p class="text-sm text-slate-500 dark:text-slate-500 mb-3">{{ $t('outsideCode.podcastsSubheading') }}</p>
          <div class="flex flex-wrap gap-4">
            <a
              v-for="podcast in outsideCodeStore.podcasts"
              :key="podcast.id"
              :href="podcast.url"
              target="_blank"
              rel="noopener noreferrer"
              class="group text-center w-16"
            >
              <div class="w-16 h-16 rounded-full overflow-hidden bg-slate-100 dark:bg-white/5 mb-2 flex items-center justify-center">
                <img v-if="podcast.imageUrl" :src="podcast.imageUrl" :alt="podcast.name" class="w-full h-full object-cover" />
                <span v-else class="text-xs text-slate-400">?</span>
              </div>
              <p class="text-xs font-medium text-slate-600 dark:text-slate-400 group-hover:text-accent-500 transition-colors">{{ podcast.name }}</p>
            </a>
          </div>
        </div>
      </div>

      <!-- Bookshelf -->
      <div v-if="outsideCodeStore.books.length" class="mb-16">
        <h2 class="text-2xl font-bold mb-2">{{ $t('outsideCode.booksHeading') }}</h2>
        <p class="text-sm text-slate-500 dark:text-slate-500 mb-6">{{ $t('outsideCode.booksSubheading') }}</p>

        <div v-if="currentlyReading" class="flex items-center gap-3 mb-6 p-3 rounded-xl glass-subtle">
          <img v-if="currentlyReading.imageUrl" :src="currentlyReading.imageUrl" :alt="currentlyReading.title" class="w-10 h-14 object-cover rounded shrink-0" />
          <p class="text-sm text-slate-700 dark:text-slate-300">
            <span class="font-medium">{{ $t('outsideCode.currentlyReading') }}:</span> {{ currentlyReading.title }} — {{ currentlyReading.author }}
          </p>
        </div>

        <div class="flex gap-6 overflow-x-auto pb-2 -mx-1 px-1">
          <div v-for="book in memorableBooks" :key="book.id" class="shrink-0 w-32">
            <img
              v-if="book.imageUrl"
              :src="book.imageUrl"
              :alt="book.title"
              class="w-32 h-44 object-cover rounded-md shadow-lg shadow-slate-900/10 dark:shadow-black/40 mb-3"
            />
            <p class="text-xs font-semibold text-slate-800 dark:text-slate-100 leading-snug">{{ book.title }}</p>
            <p class="text-xs text-slate-500 mb-1.5">{{ book.author }}</p>
            <p v-if="book.note" class="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">{{ book.note }}</p>
          </div>
        </div>
      </div>

      <!-- Life Inspired By -->
      <div v-if="outsideCodeStore.lifeInspirations.length">
        <h2 class="text-2xl font-bold mb-2">{{ $t('outsideCode.lifeInspiredBy') }}</h2>
        <p class="text-sm text-slate-500 dark:text-slate-500 mb-6">{{ $t('outsideCode.lifeInspiredBySubheading') }}</p>

        <div class="space-y-6">
          <div
            v-for="person in outsideCodeStore.lifeInspirations"
            :key="person.id"
            class="flex items-start gap-4 pl-4 border-l-2 border-accent-500/30"
          >
            <img v-if="person.imageUrl" :src="person.imageUrl" :alt="person.name" class="w-16 h-16 rounded-full object-cover shrink-0" />
            <div>
              <div class="flex items-center gap-2 mb-1 flex-wrap">
                <h3 class="text-sm font-semibold text-slate-800 dark:text-slate-100">{{ person.name }}</h3>
                <span class="text-[11px] font-medium uppercase tracking-wide text-accent-500">{{ person.aspect }}</span>
              </div>
              <p class="text-sm text-slate-600 dark:text-slate-400 leading-relaxed italic">"{{ person.note }}"</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
