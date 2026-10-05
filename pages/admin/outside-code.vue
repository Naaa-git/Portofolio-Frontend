<script setup lang="ts">
import { Plus, Pencil, Trash2 } from 'lucide-vue-next'
import { toast } from 'vue-sonner'
import type { AwayFromKeyboardItem, MovieTake, MusicArtist, PodcastChannel, OutsideCodeBook, LifeInspiration } from '~/types'

definePageMeta({ layout: 'admin', middleware: 'admin-auth' })

useHead({ title: 'Outside Code — Admin' })

const store = useOutsideCodeStore()
await callOnce('outside-code-data', () => store.loadAll())

const inputClass = 'w-full px-4 py-2.5 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm focus:outline-none focus:border-accent-500'
const labelClass = 'block text-sm font-medium mb-1.5'

// --- Intro ---
const introForm = reactive({ ...store.intro })
const isSavingIntro = ref(false)
async function saveIntro() {
  isSavingIntro.value = true
  try {
    await store.updateIntro({ ...introForm })
    toast.success('Intro berhasil disimpan.')
  } catch {
    toast.error('Gagal menyimpan intro.')
  } finally {
    isSavingIntro.value = false
  }
}

// --- Away From the Keyboard ---
const awayModal = ref(false)
const awayEditingId = ref<number | null>(null)
const awayForm = reactive<Omit<AwayFromKeyboardItem, 'id'>>({ title: '', note: '', imageUrl: '', sortOrder: 0 })
const awayDeleteTarget = ref<AwayFromKeyboardItem | null>(null)

function openAwayCreate() {
  awayEditingId.value = null
  Object.assign(awayForm, { title: '', note: '', imageUrl: '', sortOrder: store.awayFromKeyboard.length + 1 })
  awayModal.value = true
}
function openAwayEdit(row: AwayFromKeyboardItem) {
  awayEditingId.value = row.id
  Object.assign(awayForm, { title: row.title, note: row.note, imageUrl: row.imageUrl ?? '', sortOrder: row.sortOrder })
  awayModal.value = true
}
async function submitAway() {
  try {
    if (awayEditingId.value !== null) {
      await store.updateAwayFromKeyboard(awayEditingId.value, { ...awayForm })
      toast.success('Item berhasil diperbarui.')
    } else {
      await store.addAwayFromKeyboard({ ...awayForm })
      toast.success('Item berhasil ditambahkan.')
    }
    awayModal.value = false
  } catch {
    toast.error('Gagal menyimpan.')
  }
}
async function confirmAwayDelete() {
  if (awayDeleteTarget.value) {
    try {
      await store.deleteAwayFromKeyboard(awayDeleteTarget.value.id)
      toast.success('Item berhasil dihapus.')
    } catch {
      toast.error('Gagal menghapus.')
    }
  }
  awayDeleteTarget.value = null
}

// --- Movies & Shows ---
const movieModal = ref(false)
const movieEditingId = ref<number | null>(null)
const movieForm = reactive<Omit<MovieTake, 'id'>>({ title: '', take: '', imageUrl: '', sortOrder: 0 })
const movieDeleteTarget = ref<MovieTake | null>(null)

function openMovieCreate() {
  movieEditingId.value = null
  Object.assign(movieForm, { title: '', take: '', imageUrl: '', sortOrder: store.movies.length + 1 })
  movieModal.value = true
}
function openMovieEdit(row: MovieTake) {
  movieEditingId.value = row.id
  Object.assign(movieForm, { title: row.title, take: row.take, imageUrl: row.imageUrl ?? '', sortOrder: row.sortOrder })
  movieModal.value = true
}
async function submitMovie() {
  try {
    if (movieEditingId.value !== null) {
      await store.updateMovie(movieEditingId.value, { ...movieForm })
      toast.success('Movie berhasil diperbarui.')
    } else {
      await store.addMovie({ ...movieForm })
      toast.success('Movie berhasil ditambahkan.')
    }
    movieModal.value = false
  } catch {
    toast.error('Gagal menyimpan.')
  }
}
async function confirmMovieDelete() {
  if (movieDeleteTarget.value) {
    try {
      await store.deleteMovie(movieDeleteTarget.value.id)
      toast.success('Movie berhasil dihapus.')
    } catch {
      toast.error('Gagal menghapus.')
    }
  }
  movieDeleteTarget.value = null
}

// --- Music Artists ---
const artistModal = ref(false)
const artistEditingId = ref<number | null>(null)
const artistForm = reactive<Omit<MusicArtist, 'id'>>({ name: '', url: '', imageUrl: '', sortOrder: 0 })
const artistDeleteTarget = ref<MusicArtist | null>(null)

function openArtistCreate() {
  artistEditingId.value = null
  Object.assign(artistForm, { name: '', url: '', imageUrl: '', sortOrder: store.musicArtists.length + 1 })
  artistModal.value = true
}
function openArtistEdit(row: MusicArtist) {
  artistEditingId.value = row.id
  Object.assign(artistForm, { name: row.name, url: row.url, imageUrl: row.imageUrl ?? '', sortOrder: row.sortOrder })
  artistModal.value = true
}
async function submitArtist() {
  try {
    if (artistEditingId.value !== null) {
      await store.updateMusicArtist(artistEditingId.value, { ...artistForm })
      toast.success('Artist berhasil diperbarui.')
    } else {
      await store.addMusicArtist({ ...artistForm })
      toast.success('Artist berhasil ditambahkan.')
    }
    artistModal.value = false
  } catch {
    toast.error('Gagal menyimpan.')
  }
}
async function confirmArtistDelete() {
  if (artistDeleteTarget.value) {
    try {
      await store.deleteMusicArtist(artistDeleteTarget.value.id)
      toast.success('Artist berhasil dihapus.')
    } catch {
      toast.error('Gagal menghapus.')
    }
  }
  artistDeleteTarget.value = null
}

// --- Podcasts ---
const podcastModal = ref(false)
const podcastEditingId = ref<number | null>(null)
const podcastForm = reactive<Omit<PodcastChannel, 'id'>>({ name: '', url: '', imageUrl: '', sortOrder: 0 })
const podcastDeleteTarget = ref<PodcastChannel | null>(null)

function openPodcastCreate() {
  podcastEditingId.value = null
  Object.assign(podcastForm, { name: '', url: '', imageUrl: '', sortOrder: store.podcasts.length + 1 })
  podcastModal.value = true
}
function openPodcastEdit(row: PodcastChannel) {
  podcastEditingId.value = row.id
  Object.assign(podcastForm, { name: row.name, url: row.url, imageUrl: row.imageUrl ?? '', sortOrder: row.sortOrder })
  podcastModal.value = true
}
async function submitPodcast() {
  try {
    if (podcastEditingId.value !== null) {
      await store.updatePodcast(podcastEditingId.value, { ...podcastForm })
      toast.success('Podcast berhasil diperbarui.')
    } else {
      await store.addPodcast({ ...podcastForm })
      toast.success('Podcast berhasil ditambahkan.')
    }
    podcastModal.value = false
  } catch {
    toast.error('Gagal menyimpan.')
  }
}
async function confirmPodcastDelete() {
  if (podcastDeleteTarget.value) {
    try {
      await store.deletePodcast(podcastDeleteTarget.value.id)
      toast.success('Podcast berhasil dihapus.')
    } catch {
      toast.error('Gagal menghapus.')
    }
  }
  podcastDeleteTarget.value = null
}

// --- Books ---
const bookModal = ref(false)
const bookEditingId = ref<number | null>(null)
const bookForm = reactive<Omit<OutsideCodeBook, 'id'>>({
  title: '', author: '', note: '', imageUrl: '', isCurrentlyReading: false, sortOrder: 0,
})
const bookDeleteTarget = ref<OutsideCodeBook | null>(null)

function openBookCreate() {
  bookEditingId.value = null
  Object.assign(bookForm, { title: '', author: '', note: '', imageUrl: '', isCurrentlyReading: false, sortOrder: store.books.length + 1 })
  bookModal.value = true
}
function openBookEdit(row: OutsideCodeBook) {
  bookEditingId.value = row.id
  Object.assign(bookForm, {
    title: row.title, author: row.author, note: row.note ?? '', imageUrl: row.imageUrl ?? '',
    isCurrentlyReading: row.isCurrentlyReading, sortOrder: row.sortOrder,
  })
  bookModal.value = true
}
async function submitBook() {
  try {
    if (bookEditingId.value !== null) {
      await store.updateBook(bookEditingId.value, { ...bookForm })
      toast.success('Buku berhasil diperbarui.')
    } else {
      await store.addBook({ ...bookForm })
      toast.success('Buku berhasil ditambahkan.')
    }
    bookModal.value = false
  } catch {
    toast.error('Gagal menyimpan.')
  }
}
async function confirmBookDelete() {
  if (bookDeleteTarget.value) {
    try {
      await store.deleteBook(bookDeleteTarget.value.id)
      toast.success('Buku berhasil dihapus.')
    } catch {
      toast.error('Gagal menghapus.')
    }
  }
  bookDeleteTarget.value = null
}

// --- Life Inspirations ---
const lifeModal = ref(false)
const lifeEditingId = ref<number | null>(null)
const lifeForm = reactive<Omit<LifeInspiration, 'id'>>({ name: '', aspect: '', note: '', imageUrl: '', sortOrder: 0 })
const lifeDeleteTarget = ref<LifeInspiration | null>(null)

function openLifeCreate() {
  lifeEditingId.value = null
  Object.assign(lifeForm, { name: '', aspect: '', note: '', imageUrl: '', sortOrder: store.lifeInspirations.length + 1 })
  lifeModal.value = true
}
function openLifeEdit(row: LifeInspiration) {
  lifeEditingId.value = row.id
  Object.assign(lifeForm, { name: row.name, aspect: row.aspect, note: row.note, imageUrl: row.imageUrl ?? '', sortOrder: row.sortOrder })
  lifeModal.value = true
}
async function submitLife() {
  try {
    if (lifeEditingId.value !== null) {
      await store.updateLifeInspiration(lifeEditingId.value, { ...lifeForm })
      toast.success('Berhasil diperbarui.')
    } else {
      await store.addLifeInspiration({ ...lifeForm })
      toast.success('Berhasil ditambahkan.')
    }
    lifeModal.value = false
  } catch {
    toast.error('Gagal menyimpan.')
  }
}
async function confirmLifeDelete() {
  if (lifeDeleteTarget.value) {
    try {
      await store.deleteLifeInspiration(lifeDeleteTarget.value.id)
      toast.success('Berhasil dihapus.')
    } catch {
      toast.error('Gagal menghapus.')
    }
  }
  lifeDeleteTarget.value = null
}
</script>

<template>
  <div>
    <h1 class="text-2xl font-bold mb-1">Outside Code</h1>
    <p class="text-sm text-slate-500 dark:text-slate-400 mb-8">Atur isi halaman personal "Outside Code".</p>

    <!-- Intro -->
    <section class="mb-10">
      <h2 class="text-lg font-semibold mb-4">Intro</h2>
      <form class="space-y-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5" @submit.prevent="saveIntro">
        <div>
          <label :class="labelClass">Paragraf 1</label>
          <textarea v-model="introForm.paragraph1" rows="2" required :class="inputClass" />
        </div>
        <div>
          <label :class="labelClass">Paragraf 2</label>
          <textarea v-model="introForm.paragraph2" rows="3" required :class="inputClass" />
        </div>
        <AppButton type="submit" size="sm" :disabled="isSavingIntro">{{ isSavingIntro ? 'Menyimpan...' : 'Simpan' }}</AppButton>
      </form>
    </section>

    <!-- Away From the Keyboard -->
    <section class="mb-10">
      <div class="flex items-center justify-between mb-4">
        <h2 class="text-lg font-semibold">Away From the Keyboard</h2>
        <AppButton size="sm" @click="openAwayCreate"><Plus :size="16" /> Tambah</AppButton>
      </div>
      <AdminTable :headers="['Title', 'Note', '']" :is-empty="store.awayFromKeyboard.length === 0">
        <tr v-for="row in store.awayFromKeyboard" :key="row.id">
          <td class="px-4 py-3 font-medium">{{ row.title }}</td>
          <td class="px-4 py-3 text-slate-500 truncate max-w-sm">{{ row.note }}</td>
          <td class="px-4 py-3">
            <div class="flex justify-end gap-1">
              <button class="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500" @click="openAwayEdit(row)"><Pencil :size="15" /></button>
              <button class="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-500/10 text-red-500" @click="awayDeleteTarget = row"><Trash2 :size="15" /></button>
            </div>
          </td>
        </tr>
      </AdminTable>

      <AdminModal :show="awayModal" :title="awayEditingId !== null ? 'Edit Item' : 'Tambah Item'" @close="awayModal = false">
        <form class="space-y-4" @submit.prevent="submitAway">
          <div><label :class="labelClass">Title</label><input v-model="awayForm.title" type="text" required :class="inputClass" /></div>
          <div><label :class="labelClass">Note</label><textarea v-model="awayForm.note" rows="3" required :class="inputClass" /></div>
          <div><label :class="labelClass">Image URL</label><input v-model="awayForm.imageUrl" type="text" :class="inputClass" /></div>
          <div><label :class="labelClass">Sort Order</label><input v-model.number="awayForm.sortOrder" type="number" :class="inputClass" /></div>
          <div class="flex justify-end gap-2 pt-2">
            <AppButton type="button" variant="ghost" size="sm" @click="awayModal = false">Batal</AppButton>
            <AppButton type="submit" size="sm">Simpan</AppButton>
          </div>
        </form>
      </AdminModal>
      <AdminConfirmDialog :show="!!awayDeleteTarget" :message="`Hapus '${awayDeleteTarget?.title}'?`" @confirm="confirmAwayDelete" @cancel="awayDeleteTarget = null" />
    </section>

    <!-- Movies & Shows -->
    <section class="mb-10">
      <div class="flex items-center justify-between mb-4">
        <h2 class="text-lg font-semibold">Movies & Shows</h2>
        <AppButton size="sm" @click="openMovieCreate"><Plus :size="16" /> Tambah</AppButton>
      </div>
      <AdminTable :headers="['Title', 'Take', '']" :is-empty="store.movies.length === 0">
        <tr v-for="row in store.movies" :key="row.id">
          <td class="px-4 py-3 font-medium">{{ row.title }}</td>
          <td class="px-4 py-3 text-slate-500 truncate max-w-sm">{{ row.take }}</td>
          <td class="px-4 py-3">
            <div class="flex justify-end gap-1">
              <button class="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500" @click="openMovieEdit(row)"><Pencil :size="15" /></button>
              <button class="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-500/10 text-red-500" @click="movieDeleteTarget = row"><Trash2 :size="15" /></button>
            </div>
          </td>
        </tr>
      </AdminTable>

      <AdminModal :show="movieModal" :title="movieEditingId !== null ? 'Edit Movie' : 'Tambah Movie'" @close="movieModal = false">
        <form class="space-y-4" @submit.prevent="submitMovie">
          <div><label :class="labelClass">Title</label><input v-model="movieForm.title" type="text" required :class="inputClass" /></div>
          <div><label :class="labelClass">Take / Opini</label><textarea v-model="movieForm.take" rows="3" required :class="inputClass" /></div>
          <div><label :class="labelClass">Image URL</label><input v-model="movieForm.imageUrl" type="text" :class="inputClass" /></div>
          <div><label :class="labelClass">Sort Order</label><input v-model.number="movieForm.sortOrder" type="number" :class="inputClass" /></div>
          <div class="flex justify-end gap-2 pt-2">
            <AppButton type="button" variant="ghost" size="sm" @click="movieModal = false">Batal</AppButton>
            <AppButton type="submit" size="sm">Simpan</AppButton>
          </div>
        </form>
      </AdminModal>
      <AdminConfirmDialog :show="!!movieDeleteTarget" :message="`Hapus '${movieDeleteTarget?.title}'?`" @confirm="confirmMovieDelete" @cancel="movieDeleteTarget = null" />
    </section>

    <!-- Music Artists -->
    <section class="mb-10">
      <div class="flex items-center justify-between mb-4">
        <h2 class="text-lg font-semibold">Music Artists</h2>
        <AppButton size="sm" @click="openArtistCreate"><Plus :size="16" /> Tambah</AppButton>
      </div>
      <AdminTable :headers="['Name', 'URL', '']" :is-empty="store.musicArtists.length === 0">
        <tr v-for="row in store.musicArtists" :key="row.id">
          <td class="px-4 py-3 font-medium">{{ row.name }}</td>
          <td class="px-4 py-3 text-slate-500 truncate max-w-sm">{{ row.url }}</td>
          <td class="px-4 py-3">
            <div class="flex justify-end gap-1">
              <button class="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500" @click="openArtistEdit(row)"><Pencil :size="15" /></button>
              <button class="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-500/10 text-red-500" @click="artistDeleteTarget = row"><Trash2 :size="15" /></button>
            </div>
          </td>
        </tr>
      </AdminTable>

      <AdminModal :show="artistModal" :title="artistEditingId !== null ? 'Edit Artist' : 'Tambah Artist'" @close="artistModal = false">
        <form class="space-y-4" @submit.prevent="submitArtist">
          <div><label :class="labelClass">Name</label><input v-model="artistForm.name" type="text" required :class="inputClass" /></div>
          <div><label :class="labelClass">Spotify URL</label><input v-model="artistForm.url" type="text" required :class="inputClass" /></div>
          <div><label :class="labelClass">Image URL</label><input v-model="artistForm.imageUrl" type="text" :class="inputClass" /></div>
          <div><label :class="labelClass">Sort Order</label><input v-model.number="artistForm.sortOrder" type="number" :class="inputClass" /></div>
          <div class="flex justify-end gap-2 pt-2">
            <AppButton type="button" variant="ghost" size="sm" @click="artistModal = false">Batal</AppButton>
            <AppButton type="submit" size="sm">Simpan</AppButton>
          </div>
        </form>
      </AdminModal>
      <AdminConfirmDialog :show="!!artistDeleteTarget" :message="`Hapus '${artistDeleteTarget?.name}'?`" @confirm="confirmArtistDelete" @cancel="artistDeleteTarget = null" />
    </section>

    <!-- Podcasts -->
    <section class="mb-10">
      <div class="flex items-center justify-between mb-4">
        <h2 class="text-lg font-semibold">Podcasts / Channels</h2>
        <AppButton size="sm" @click="openPodcastCreate"><Plus :size="16" /> Tambah</AppButton>
      </div>
      <AdminTable :headers="['Name', 'URL', '']" :is-empty="store.podcasts.length === 0">
        <tr v-for="row in store.podcasts" :key="row.id">
          <td class="px-4 py-3 font-medium">{{ row.name }}</td>
          <td class="px-4 py-3 text-slate-500 truncate max-w-sm">{{ row.url }}</td>
          <td class="px-4 py-3">
            <div class="flex justify-end gap-1">
              <button class="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500" @click="openPodcastEdit(row)"><Pencil :size="15" /></button>
              <button class="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-500/10 text-red-500" @click="podcastDeleteTarget = row"><Trash2 :size="15" /></button>
            </div>
          </td>
        </tr>
      </AdminTable>

      <AdminModal :show="podcastModal" :title="podcastEditingId !== null ? 'Edit Podcast' : 'Tambah Podcast'" @close="podcastModal = false">
        <form class="space-y-4" @submit.prevent="submitPodcast">
          <div><label :class="labelClass">Name</label><input v-model="podcastForm.name" type="text" required :class="inputClass" /></div>
          <div><label :class="labelClass">URL</label><input v-model="podcastForm.url" type="text" required :class="inputClass" /></div>
          <div><label :class="labelClass">Image URL</label><input v-model="podcastForm.imageUrl" type="text" :class="inputClass" /></div>
          <div><label :class="labelClass">Sort Order</label><input v-model.number="podcastForm.sortOrder" type="number" :class="inputClass" /></div>
          <div class="flex justify-end gap-2 pt-2">
            <AppButton type="button" variant="ghost" size="sm" @click="podcastModal = false">Batal</AppButton>
            <AppButton type="submit" size="sm">Simpan</AppButton>
          </div>
        </form>
      </AdminModal>
      <AdminConfirmDialog :show="!!podcastDeleteTarget" :message="`Hapus '${podcastDeleteTarget?.name}'?`" @confirm="confirmPodcastDelete" @cancel="podcastDeleteTarget = null" />
    </section>

    <!-- Books -->
    <section class="mb-10">
      <div class="flex items-center justify-between mb-4">
        <h2 class="text-lg font-semibold">Books</h2>
        <AppButton size="sm" @click="openBookCreate"><Plus :size="16" /> Tambah</AppButton>
      </div>
      <AdminTable :headers="['Title', 'Author', 'Reading', '']" :is-empty="store.books.length === 0">
        <tr v-for="row in store.books" :key="row.id">
          <td class="px-4 py-3 font-medium">{{ row.title }}</td>
          <td class="px-4 py-3 text-slate-500">{{ row.author }}</td>
          <td class="px-4 py-3"><AppBadge v-if="row.isCurrentlyReading" variant="success">Currently Reading</AppBadge></td>
          <td class="px-4 py-3">
            <div class="flex justify-end gap-1">
              <button class="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500" @click="openBookEdit(row)"><Pencil :size="15" /></button>
              <button class="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-500/10 text-red-500" @click="bookDeleteTarget = row"><Trash2 :size="15" /></button>
            </div>
          </td>
        </tr>
      </AdminTable>

      <AdminModal :show="bookModal" :title="bookEditingId !== null ? 'Edit Buku' : 'Tambah Buku'" @close="bookModal = false">
        <form class="space-y-4" @submit.prevent="submitBook">
          <div><label :class="labelClass">Title</label><input v-model="bookForm.title" type="text" required :class="inputClass" /></div>
          <div><label :class="labelClass">Author</label><input v-model="bookForm.author" type="text" required :class="inputClass" /></div>
          <div><label :class="labelClass">Note (opsional)</label><textarea v-model="bookForm.note" rows="2" :class="inputClass" /></div>
          <div><label :class="labelClass">Image URL</label><input v-model="bookForm.imageUrl" type="text" :class="inputClass" /></div>
          <AdminToggleSwitch v-model="bookForm.isCurrentlyReading" label="Currently reading" />
          <div><label :class="labelClass">Sort Order</label><input v-model.number="bookForm.sortOrder" type="number" :class="inputClass" /></div>
          <div class="flex justify-end gap-2 pt-2">
            <AppButton type="button" variant="ghost" size="sm" @click="bookModal = false">Batal</AppButton>
            <AppButton type="submit" size="sm">Simpan</AppButton>
          </div>
        </form>
      </AdminModal>
      <AdminConfirmDialog :show="!!bookDeleteTarget" :message="`Hapus '${bookDeleteTarget?.title}'?`" @confirm="confirmBookDelete" @cancel="bookDeleteTarget = null" />
    </section>

    <!-- Life Inspired By -->
    <section>
      <div class="flex items-center justify-between mb-4">
        <h2 class="text-lg font-semibold">Life Inspired By</h2>
        <AppButton size="sm" @click="openLifeCreate"><Plus :size="16" /> Tambah</AppButton>
      </div>
      <AdminTable :headers="['Name', 'Aspect', 'Note', '']" :is-empty="store.lifeInspirations.length === 0">
        <tr v-for="row in store.lifeInspirations" :key="row.id">
          <td class="px-4 py-3 font-medium">{{ row.name }}</td>
          <td class="px-4 py-3 text-slate-500">{{ row.aspect }}</td>
          <td class="px-4 py-3 text-slate-500 truncate max-w-sm">{{ row.note }}</td>
          <td class="px-4 py-3">
            <div class="flex justify-end gap-1">
              <button class="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500" @click="openLifeEdit(row)"><Pencil :size="15" /></button>
              <button class="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-500/10 text-red-500" @click="lifeDeleteTarget = row"><Trash2 :size="15" /></button>
            </div>
          </td>
        </tr>
      </AdminTable>

      <AdminModal :show="lifeModal" :title="lifeEditingId !== null ? 'Edit' : 'Tambah'" @close="lifeModal = false">
        <form class="space-y-4" @submit.prevent="submitLife">
          <div><label :class="labelClass">Name</label><input v-model="lifeForm.name" type="text" required :class="inputClass" /></div>
          <div><label :class="labelClass">Aspect</label><input v-model="lifeForm.aspect" type="text" required :class="inputClass" placeholder="e.g. Ambisi & Tekad" /></div>
          <div><label :class="labelClass">Note</label><textarea v-model="lifeForm.note" rows="3" required :class="inputClass" /></div>
          <div><label :class="labelClass">Image URL</label><input v-model="lifeForm.imageUrl" type="text" :class="inputClass" /></div>
          <div><label :class="labelClass">Sort Order</label><input v-model.number="lifeForm.sortOrder" type="number" :class="inputClass" /></div>
          <div class="flex justify-end gap-2 pt-2">
            <AppButton type="button" variant="ghost" size="sm" @click="lifeModal = false">Batal</AppButton>
            <AppButton type="submit" size="sm">Simpan</AppButton>
          </div>
        </form>
      </AdminModal>
      <AdminConfirmDialog :show="!!lifeDeleteTarget" :message="`Hapus '${lifeDeleteTarget?.name}'?`" @confirm="confirmLifeDelete" @cancel="lifeDeleteTarget = null" />
    </section>
  </div>
</template>
