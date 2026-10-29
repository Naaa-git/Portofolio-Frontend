<script setup lang="ts">
import { Plus, Pencil, Trash2, GripVertical } from 'lucide-vue-next'
import { toast } from 'vue-sonner'
import type { AwayFromKeyboardItemAdmin, MovieTakeAdmin, MusicArtist, PodcastChannel, OutsideCodeBookAdmin, LifeInspirationAdmin } from '~/types'

definePageMeta({ layout: 'admin', middleware: 'admin-auth' })

useHead({ title: 'Outside Code — Admin' })

const store = useOutsideCodeStore()
await callOnce('outside-code-admin-data', () => store.loadAllAdmin())

const awayTable = useTemplateRef('awayTable')
useReorderPersist(awayTable, toRef(store, 'adminAwayFromKeyboard'), (item, sortOrder) =>
  store.updateAwayFromKeyboard(item.id, { title: item.title, note: item.note, imageUrl: item.imageUrl, sortOrder }),
)
const movieTable = useTemplateRef('movieTable')
useReorderPersist(movieTable, toRef(store, 'adminMovies'), (item, sortOrder) =>
  store.updateMovie(item.id, { title: item.title, take: item.take, imageUrl: item.imageUrl, sortOrder }),
)
const artistTable = useTemplateRef('artistTable')
useReorderPersist(artistTable, toRef(store, 'musicArtists'), (item, sortOrder) =>
  store.updateMusicArtist(item.id, { name: item.name, url: item.url, imageUrl: item.imageUrl, sortOrder }),
)
const podcastTable = useTemplateRef('podcastTable')
useReorderPersist(podcastTable, toRef(store, 'podcasts'), (item, sortOrder) =>
  store.updatePodcast(item.id, { name: item.name, url: item.url, imageUrl: item.imageUrl, sortOrder }),
)
const bookTable = useTemplateRef('bookTable')
useReorderPersist(bookTable, toRef(store, 'adminBooks'), (item, sortOrder) =>
  store.updateBook(item.id, {
    title: item.title, author: item.author, note: item.note, imageUrl: item.imageUrl,
    isCurrentlyReading: item.isCurrentlyReading, sortOrder,
  }),
)
const lifeTable = useTemplateRef('lifeTable')
useReorderPersist(lifeTable, toRef(store, 'adminLifeInspirations'), (item, sortOrder) =>
  store.updateLifeInspiration(item.id, { name: item.name, aspect: item.aspect, note: item.note, imageUrl: item.imageUrl, sortOrder }),
)

const inputClass = 'w-full px-4 py-2.5 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm focus:outline-none focus:border-accent-500'

// --- Intro ---
const introForm = reactive({ ...store.adminIntro })
const introErrors = reactive<Record<string, string | undefined>>({})
const isSavingIntro = ref(false)

function validateIntro(): boolean {
  introErrors.paragraph1Id = requiredError(introForm.paragraph1.id, 'Paragraf 1 (Indonesia)')
  introErrors.paragraph1En = requiredError(introForm.paragraph1.en, 'Paragraf 1 (English)')
  introErrors.paragraph2Id = requiredError(introForm.paragraph2.id, 'Paragraf 2 (Indonesia)')
  introErrors.paragraph2En = requiredError(introForm.paragraph2.en, 'Paragraf 2 (English)')
  return !Object.values(introErrors).some(Boolean)
}

watch(() => introForm.paragraph1.id, () => { introErrors.paragraph1Id = undefined })
watch(() => introForm.paragraph1.en, () => { introErrors.paragraph1En = undefined })
watch(() => introForm.paragraph2.id, () => { introErrors.paragraph2Id = undefined })
watch(() => introForm.paragraph2.en, () => { introErrors.paragraph2En = undefined })

async function saveIntro() {
  if (!validateIntro()) return
  isSavingIntro.value = true
  try {
    await store.updateIntro({ ...introForm })
    toast.success('Intro berhasil disimpan.')
  } catch (err) {
    toast.error(getApiErrorMessage(err, 'Gagal menyimpan intro.'))
  } finally {
    isSavingIntro.value = false
  }
}

// --- Away From the Keyboard ---
const awayModal = ref(false)
const awayEditingId = ref<number | null>(null)
const awayForm = reactive<Omit<AwayFromKeyboardItemAdmin, 'id'>>({ title: { id: '', en: '' }, note: { id: '', en: '' }, imageUrl: '', sortOrder: 0 })
const awayDeleteTarget = ref<AwayFromKeyboardItemAdmin | null>(null)
const awayErrors = reactive<Record<string, string | undefined>>({})

function validateAway(): boolean {
  awayErrors.titleId = requiredError(awayForm.title.id, 'Title (Indonesia)')
  awayErrors.titleEn = requiredError(awayForm.title.en, 'Title (English)')
  awayErrors.noteId = requiredError(awayForm.note.id, 'Note (Indonesia)')
  awayErrors.noteEn = requiredError(awayForm.note.en, 'Note (English)')
  awayErrors.imageUrl = urlError(awayForm.imageUrl ?? '', 'Image URL')
  return !Object.values(awayErrors).some(Boolean)
}

watch(() => awayForm.title.id, () => { awayErrors.titleId = undefined })
watch(() => awayForm.title.en, () => { awayErrors.titleEn = undefined })
watch(() => awayForm.note.id, () => { awayErrors.noteId = undefined })
watch(() => awayForm.note.en, () => { awayErrors.noteEn = undefined })
watch(() => awayForm.imageUrl, () => { awayErrors.imageUrl = undefined })

function openAwayCreate() {
  awayEditingId.value = null
  Object.assign(awayForm, { title: { id: '', en: '' }, note: { id: '', en: '' }, imageUrl: '', sortOrder: store.adminAwayFromKeyboard.length + 1 })
  Object.keys(awayErrors).forEach(k => { awayErrors[k] = undefined })
  awayModal.value = true
}
function openAwayEdit(row: AwayFromKeyboardItemAdmin) {
  awayEditingId.value = row.id
  Object.assign(awayForm, { title: { ...row.title }, note: { ...row.note }, imageUrl: row.imageUrl ?? '', sortOrder: row.sortOrder })
  Object.keys(awayErrors).forEach(k => { awayErrors[k] = undefined })
  awayModal.value = true
}
async function submitAway() {
  if (!validateAway()) return
  try {
    if (awayEditingId.value !== null) {
      await store.updateAwayFromKeyboard(awayEditingId.value, { ...awayForm })
      toast.success('Item berhasil diperbarui.')
    } else {
      await store.addAwayFromKeyboard({ ...awayForm })
      toast.success('Item berhasil ditambahkan.')
    }
    awayModal.value = false
  } catch (err) {
    toast.error(getApiErrorMessage(err, 'Gagal menyimpan.'))
  }
}
async function confirmAwayDelete() {
  if (awayDeleteTarget.value) {
    try {
      await store.deleteAwayFromKeyboard(awayDeleteTarget.value.id)
      toast.success('Item berhasil dihapus.')
    } catch (err) {
      toast.error(getApiErrorMessage(err, 'Gagal menghapus.'))
    }
  }
  awayDeleteTarget.value = null
}

// --- Movies & Shows ---
const movieModal = ref(false)
const movieEditingId = ref<number | null>(null)
const movieForm = reactive<Omit<MovieTakeAdmin, 'id'>>({ title: '', take: { id: '', en: '' }, imageUrl: '', sortOrder: 0 })
const movieDeleteTarget = ref<MovieTakeAdmin | null>(null)
const movieErrors = reactive<Record<string, string | undefined>>({})

function validateMovie(): boolean {
  movieErrors.title = requiredError(movieForm.title, 'Title')
  movieErrors.takeId = requiredError(movieForm.take.id, 'Take / Opini (Indonesia)')
  movieErrors.takeEn = requiredError(movieForm.take.en, 'Take / Opini (English)')
  movieErrors.imageUrl = urlError(movieForm.imageUrl ?? '', 'Image URL')
  return !Object.values(movieErrors).some(Boolean)
}

watch(() => movieForm.title, () => { movieErrors.title = undefined })
watch(() => movieForm.take.id, () => { movieErrors.takeId = undefined })
watch(() => movieForm.take.en, () => { movieErrors.takeEn = undefined })
watch(() => movieForm.imageUrl, () => { movieErrors.imageUrl = undefined })

function openMovieCreate() {
  movieEditingId.value = null
  Object.assign(movieForm, { title: '', take: { id: '', en: '' }, imageUrl: '', sortOrder: store.adminMovies.length + 1 })
  Object.keys(movieErrors).forEach(k => { movieErrors[k] = undefined })
  movieModal.value = true
}
function openMovieEdit(row: MovieTakeAdmin) {
  movieEditingId.value = row.id
  Object.assign(movieForm, { title: row.title, take: { ...row.take }, imageUrl: row.imageUrl ?? '', sortOrder: row.sortOrder })
  Object.keys(movieErrors).forEach(k => { movieErrors[k] = undefined })
  movieModal.value = true
}
async function submitMovie() {
  if (!validateMovie()) return
  try {
    if (movieEditingId.value !== null) {
      await store.updateMovie(movieEditingId.value, { ...movieForm })
      toast.success('Movie berhasil diperbarui.')
    } else {
      await store.addMovie({ ...movieForm })
      toast.success('Movie berhasil ditambahkan.')
    }
    movieModal.value = false
  } catch (err) {
    toast.error(getApiErrorMessage(err, 'Gagal menyimpan.'))
  }
}
async function confirmMovieDelete() {
  if (movieDeleteTarget.value) {
    try {
      await store.deleteMovie(movieDeleteTarget.value.id)
      toast.success('Movie berhasil dihapus.')
    } catch (err) {
      toast.error(getApiErrorMessage(err, 'Gagal menghapus.'))
    }
  }
  movieDeleteTarget.value = null
}

// --- Music Artists (not translatable) ---
const artistModal = ref(false)
const artistEditingId = ref<number | null>(null)
const artistForm = reactive<Omit<MusicArtist, 'id'>>({ name: '', url: '', imageUrl: '', sortOrder: 0 })
const artistDeleteTarget = ref<MusicArtist | null>(null)
const artistErrors = reactive<Record<string, string | undefined>>({})

function validateArtist(): boolean {
  artistErrors.name = requiredError(artistForm.name, 'Name')
  artistErrors.url = urlError(artistForm.url, 'Spotify URL', { required: true })
  artistErrors.imageUrl = urlError(artistForm.imageUrl ?? '', 'Image URL')
  return !Object.values(artistErrors).some(Boolean)
}

watch(() => artistForm.name, () => { artistErrors.name = undefined })
watch(() => artistForm.url, () => { artistErrors.url = undefined })
watch(() => artistForm.imageUrl, () => { artistErrors.imageUrl = undefined })

function openArtistCreate() {
  artistEditingId.value = null
  Object.assign(artistForm, { name: '', url: '', imageUrl: '', sortOrder: store.musicArtists.length + 1 })
  Object.keys(artistErrors).forEach(k => { artistErrors[k] = undefined })
  artistModal.value = true
}
function openArtistEdit(row: MusicArtist) {
  artistEditingId.value = row.id
  Object.assign(artistForm, { name: row.name, url: row.url, imageUrl: row.imageUrl ?? '', sortOrder: row.sortOrder })
  Object.keys(artistErrors).forEach(k => { artistErrors[k] = undefined })
  artistModal.value = true
}
async function submitArtist() {
  if (!validateArtist()) return
  try {
    if (artistEditingId.value !== null) {
      await store.updateMusicArtist(artistEditingId.value, { ...artistForm })
      toast.success('Artist berhasil diperbarui.')
    } else {
      await store.addMusicArtist({ ...artistForm })
      toast.success('Artist berhasil ditambahkan.')
    }
    artistModal.value = false
  } catch (err) {
    toast.error(getApiErrorMessage(err, 'Gagal menyimpan.'))
  }
}
async function confirmArtistDelete() {
  if (artistDeleteTarget.value) {
    try {
      await store.deleteMusicArtist(artistDeleteTarget.value.id)
      toast.success('Artist berhasil dihapus.')
    } catch (err) {
      toast.error(getApiErrorMessage(err, 'Gagal menghapus.'))
    }
  }
  artistDeleteTarget.value = null
}

// --- Podcasts (not translatable) ---
const podcastModal = ref(false)
const podcastEditingId = ref<number | null>(null)
const podcastForm = reactive<Omit<PodcastChannel, 'id'>>({ name: '', url: '', imageUrl: '', sortOrder: 0 })
const podcastDeleteTarget = ref<PodcastChannel | null>(null)
const podcastErrors = reactive<Record<string, string | undefined>>({})

function validatePodcast(): boolean {
  podcastErrors.name = requiredError(podcastForm.name, 'Name')
  podcastErrors.url = urlError(podcastForm.url, 'URL', { required: true })
  podcastErrors.imageUrl = urlError(podcastForm.imageUrl ?? '', 'Image URL')
  return !Object.values(podcastErrors).some(Boolean)
}

watch(() => podcastForm.name, () => { podcastErrors.name = undefined })
watch(() => podcastForm.url, () => { podcastErrors.url = undefined })
watch(() => podcastForm.imageUrl, () => { podcastErrors.imageUrl = undefined })

function openPodcastCreate() {
  podcastEditingId.value = null
  Object.assign(podcastForm, { name: '', url: '', imageUrl: '', sortOrder: store.podcasts.length + 1 })
  Object.keys(podcastErrors).forEach(k => { podcastErrors[k] = undefined })
  podcastModal.value = true
}
function openPodcastEdit(row: PodcastChannel) {
  podcastEditingId.value = row.id
  Object.assign(podcastForm, { name: row.name, url: row.url, imageUrl: row.imageUrl ?? '', sortOrder: row.sortOrder })
  Object.keys(podcastErrors).forEach(k => { podcastErrors[k] = undefined })
  podcastModal.value = true
}
async function submitPodcast() {
  if (!validatePodcast()) return
  try {
    if (podcastEditingId.value !== null) {
      await store.updatePodcast(podcastEditingId.value, { ...podcastForm })
      toast.success('Podcast berhasil diperbarui.')
    } else {
      await store.addPodcast({ ...podcastForm })
      toast.success('Podcast berhasil ditambahkan.')
    }
    podcastModal.value = false
  } catch (err) {
    toast.error(getApiErrorMessage(err, 'Gagal menyimpan.'))
  }
}
async function confirmPodcastDelete() {
  if (podcastDeleteTarget.value) {
    try {
      await store.deletePodcast(podcastDeleteTarget.value.id)
      toast.success('Podcast berhasil dihapus.')
    } catch (err) {
      toast.error(getApiErrorMessage(err, 'Gagal menghapus.'))
    }
  }
  podcastDeleteTarget.value = null
}

// --- Books ---
const bookModal = ref(false)
const bookEditingId = ref<number | null>(null)
const bookForm = reactive<Omit<OutsideCodeBookAdmin, 'id'>>({
  title: '', author: '', note: { id: '', en: '' }, imageUrl: '', isCurrentlyReading: false, sortOrder: 0,
})
const bookDeleteTarget = ref<OutsideCodeBookAdmin | null>(null)
const bookErrors = reactive<Record<string, string | undefined>>({})

function validateBook(): boolean {
  bookErrors.title = requiredError(bookForm.title, 'Title')
  bookErrors.author = requiredError(bookForm.author, 'Author')
  bookErrors.imageUrl = urlError(bookForm.imageUrl ?? '', 'Image URL')
  return !Object.values(bookErrors).some(Boolean)
}

watch(() => bookForm.title, () => { bookErrors.title = undefined })
watch(() => bookForm.author, () => { bookErrors.author = undefined })
watch(() => bookForm.imageUrl, () => { bookErrors.imageUrl = undefined })

function openBookCreate() {
  bookEditingId.value = null
  Object.assign(bookForm, { title: '', author: '', note: { id: '', en: '' }, imageUrl: '', isCurrentlyReading: false, sortOrder: store.adminBooks.length + 1 })
  Object.keys(bookErrors).forEach(k => { bookErrors[k] = undefined })
  bookModal.value = true
}
function openBookEdit(row: OutsideCodeBookAdmin) {
  bookEditingId.value = row.id
  Object.assign(bookForm, {
    title: row.title, author: row.author, note: { ...row.note }, imageUrl: row.imageUrl ?? '',
    isCurrentlyReading: row.isCurrentlyReading, sortOrder: row.sortOrder,
  })
  Object.keys(bookErrors).forEach(k => { bookErrors[k] = undefined })
  bookModal.value = true
}
async function submitBook() {
  if (!validateBook()) return
  try {
    if (bookEditingId.value !== null) {
      await store.updateBook(bookEditingId.value, { ...bookForm })
      toast.success('Buku berhasil diperbarui.')
    } else {
      await store.addBook({ ...bookForm })
      toast.success('Buku berhasil ditambahkan.')
    }
    bookModal.value = false
  } catch (err) {
    toast.error(getApiErrorMessage(err, 'Gagal menyimpan.'))
  }
}
async function confirmBookDelete() {
  if (bookDeleteTarget.value) {
    try {
      await store.deleteBook(bookDeleteTarget.value.id)
      toast.success('Buku berhasil dihapus.')
    } catch (err) {
      toast.error(getApiErrorMessage(err, 'Gagal menghapus.'))
    }
  }
  bookDeleteTarget.value = null
}

// --- Life Inspirations ---
const lifeModal = ref(false)
const lifeEditingId = ref<number | null>(null)
const lifeForm = reactive<Omit<LifeInspirationAdmin, 'id'>>({ name: '', aspect: { id: '', en: '' }, note: { id: '', en: '' }, imageUrl: '', sortOrder: 0 })
const lifeDeleteTarget = ref<LifeInspirationAdmin | null>(null)
const lifeErrors = reactive<Record<string, string | undefined>>({})

function validateLife(): boolean {
  lifeErrors.name = requiredError(lifeForm.name, 'Name')
  lifeErrors.aspectId = requiredError(lifeForm.aspect.id, 'Aspect (Indonesia)')
  lifeErrors.aspectEn = requiredError(lifeForm.aspect.en, 'Aspect (English)')
  lifeErrors.noteId = requiredError(lifeForm.note.id, 'Note (Indonesia)')
  lifeErrors.noteEn = requiredError(lifeForm.note.en, 'Note (English)')
  lifeErrors.imageUrl = urlError(lifeForm.imageUrl ?? '', 'Image URL')
  return !Object.values(lifeErrors).some(Boolean)
}

watch(() => lifeForm.name, () => { lifeErrors.name = undefined })
watch(() => lifeForm.aspect.id, () => { lifeErrors.aspectId = undefined })
watch(() => lifeForm.aspect.en, () => { lifeErrors.aspectEn = undefined })
watch(() => lifeForm.note.id, () => { lifeErrors.noteId = undefined })
watch(() => lifeForm.note.en, () => { lifeErrors.noteEn = undefined })
watch(() => lifeForm.imageUrl, () => { lifeErrors.imageUrl = undefined })

function openLifeCreate() {
  lifeEditingId.value = null
  Object.assign(lifeForm, { name: '', aspect: { id: '', en: '' }, note: { id: '', en: '' }, imageUrl: '', sortOrder: store.adminLifeInspirations.length + 1 })
  Object.keys(lifeErrors).forEach(k => { lifeErrors[k] = undefined })
  lifeModal.value = true
}
function openLifeEdit(row: LifeInspirationAdmin) {
  lifeEditingId.value = row.id
  Object.assign(lifeForm, { name: row.name, aspect: { ...row.aspect }, note: { ...row.note }, imageUrl: row.imageUrl ?? '', sortOrder: row.sortOrder })
  Object.keys(lifeErrors).forEach(k => { lifeErrors[k] = undefined })
  lifeModal.value = true
}
async function submitLife() {
  if (!validateLife()) return
  try {
    if (lifeEditingId.value !== null) {
      await store.updateLifeInspiration(lifeEditingId.value, { ...lifeForm })
      toast.success('Berhasil diperbarui.')
    } else {
      await store.addLifeInspiration({ ...lifeForm })
      toast.success('Berhasil ditambahkan.')
    }
    lifeModal.value = false
  } catch (err) {
    toast.error(getApiErrorMessage(err, 'Gagal menyimpan.'))
  }
}
async function confirmLifeDelete() {
  if (lifeDeleteTarget.value) {
    try {
      await store.deleteLifeInspiration(lifeDeleteTarget.value.id)
      toast.success('Berhasil dihapus.')
    } catch (err) {
      toast.error(getApiErrorMessage(err, 'Gagal menghapus.'))
    }
  }
  lifeDeleteTarget.value = null
}
</script>

<template>
  <div>
    <h1 class="text-2xl font-bold mb-1">Outside Code</h1>
    <p class="text-sm text-slate-500 dark:text-slate-400 mb-8">Atur isi halaman personal "Outside Code". Field dengan dua kolom bisa diisi dalam Bahasa Indonesia dan English.</p>

    <!-- Intro -->
    <section class="mb-10">
      <h2 class="text-lg font-semibold mb-4">Intro</h2>
      <form class="space-y-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5" novalidate @submit.prevent="saveIntro">
        <AdminTranslatableInput
          v-model="introForm.paragraph1" label="Paragraf 1" type="textarea" :rows="2" required :maxlength="1000"
          :error-id="introErrors.paragraph1Id" :error-en="introErrors.paragraph1En"
        />
        <AdminTranslatableInput
          v-model="introForm.paragraph2" label="Paragraf 2" type="textarea" :rows="3" required :maxlength="1000"
          :error-id="introErrors.paragraph2Id" :error-en="introErrors.paragraph2En"
        />
        <AppButton type="submit" size="sm" :disabled="isSavingIntro">{{ isSavingIntro ? 'Menyimpan...' : 'Simpan' }}</AppButton>
      </form>
    </section>

    <!-- Away From the Keyboard -->
    <section class="mb-10">
      <div class="flex items-center justify-between mb-4">
        <h2 class="text-lg font-semibold">Away From the Keyboard</h2>
        <AppButton size="sm" @click="openAwayCreate"><Plus :size="16" /> Tambah</AppButton>
      </div>
      <AdminTable ref="awayTable" :headers="['', 'Title', 'Note', '']" :is-empty="store.adminAwayFromKeyboard.length === 0">
        <tr v-for="row in store.adminAwayFromKeyboard" :key="row.id">
          <td class="px-4 py-3"><GripVertical :size="16" class="drag-handle cursor-grab text-slate-400" /></td>
          <td class="px-4 py-3 font-medium">{{ row.title.id }} <span class="text-slate-400">/ {{ row.title.en }}</span></td>
          <td class="px-4 py-3 text-slate-500 truncate max-w-sm">{{ row.note.id }}</td>
          <td class="px-4 py-3">
            <div class="flex justify-end gap-1">
              <button class="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500" @click="openAwayEdit(row)"><Pencil :size="15" /></button>
              <button class="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-500/10 text-red-500" @click="awayDeleteTarget = row"><Trash2 :size="15" /></button>
            </div>
          </td>
        </tr>
      </AdminTable>

      <AdminModal :show="awayModal" :title="awayEditingId !== null ? 'Edit Item' : 'Tambah Item'" @close="awayModal = false">
        <form class="space-y-4" novalidate @submit.prevent="submitAway">
          <AdminTranslatableInput v-model="awayForm.title" label="Title" required :maxlength="100" :error-id="awayErrors.titleId" :error-en="awayErrors.titleEn" />
          <AdminTranslatableInput v-model="awayForm.note" label="Note" type="textarea" required :maxlength="500" :error-id="awayErrors.noteId" :error-en="awayErrors.noteEn" />
          <div>
            <AdminLabel text="Image URL" />
            <input v-model="awayForm.imageUrl" type="url" maxlength="500" :class="errorInputClass(inputClass, awayErrors.imageUrl)" />
            <AdminFieldError :message="awayErrors.imageUrl" />
          </div>
          <div class="flex justify-end gap-2 pt-2">
            <AppButton type="button" variant="ghost" size="sm" @click="awayModal = false">Batal</AppButton>
            <AppButton type="submit" size="sm">Simpan</AppButton>
          </div>
        </form>
      </AdminModal>
      <AdminConfirmDialog :show="!!awayDeleteTarget" :message="`Hapus '${awayDeleteTarget?.title.id}'?`" @confirm="confirmAwayDelete" @cancel="awayDeleteTarget = null" />
    </section>

    <!-- Movies & Shows -->
    <section class="mb-10">
      <div class="flex items-center justify-between mb-4">
        <h2 class="text-lg font-semibold">Movies & Shows</h2>
        <AppButton size="sm" @click="openMovieCreate"><Plus :size="16" /> Tambah</AppButton>
      </div>
      <AdminTable ref="movieTable" :headers="['', 'Title', 'Take', '']" :is-empty="store.adminMovies.length === 0">
        <tr v-for="row in store.adminMovies" :key="row.id">
          <td class="px-4 py-3"><GripVertical :size="16" class="drag-handle cursor-grab text-slate-400" /></td>
          <td class="px-4 py-3 font-medium">{{ row.title }}</td>
          <td class="px-4 py-3 text-slate-500 truncate max-w-sm">{{ row.take.id }}</td>
          <td class="px-4 py-3">
            <div class="flex justify-end gap-1">
              <button class="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500" @click="openMovieEdit(row)"><Pencil :size="15" /></button>
              <button class="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-500/10 text-red-500" @click="movieDeleteTarget = row"><Trash2 :size="15" /></button>
            </div>
          </td>
        </tr>
      </AdminTable>

      <AdminModal :show="movieModal" :title="movieEditingId !== null ? 'Edit Movie' : 'Tambah Movie'" @close="movieModal = false">
        <form class="space-y-4" novalidate @submit.prevent="submitMovie">
          <div>
            <AdminLabel text="Title" required />
            <input v-model="movieForm.title" type="text" maxlength="150" :class="errorInputClass(inputClass, movieErrors.title)" />
            <AdminFieldError :message="movieErrors.title" />
          </div>
          <AdminTranslatableInput v-model="movieForm.take" label="Take / Opini" type="textarea" required :maxlength="1000" :error-id="movieErrors.takeId" :error-en="movieErrors.takeEn" />
          <div>
            <AdminLabel text="Image URL" />
            <input v-model="movieForm.imageUrl" type="url" maxlength="500" :class="errorInputClass(inputClass, movieErrors.imageUrl)" />
            <AdminFieldError :message="movieErrors.imageUrl" />
          </div>
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
      <AdminTable ref="artistTable" :headers="['', 'Name', 'URL', '']" :is-empty="store.musicArtists.length === 0">
        <tr v-for="row in store.musicArtists" :key="row.id">
          <td class="px-4 py-3"><GripVertical :size="16" class="drag-handle cursor-grab text-slate-400" /></td>
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
        <form class="space-y-4" novalidate @submit.prevent="submitArtist">
          <div>
            <AdminLabel text="Name" required />
            <input v-model="artistForm.name" type="text" maxlength="100" :class="errorInputClass(inputClass, artistErrors.name)" />
            <AdminFieldError :message="artistErrors.name" />
          </div>
          <div>
            <AdminLabel text="Spotify URL" required />
            <input v-model="artistForm.url" type="url" maxlength="500" :class="errorInputClass(inputClass, artistErrors.url)" />
            <AdminFieldError :message="artistErrors.url" />
          </div>
          <div>
            <AdminLabel text="Image URL" />
            <input v-model="artistForm.imageUrl" type="url" maxlength="500" :class="errorInputClass(inputClass, artistErrors.imageUrl)" />
            <AdminFieldError :message="artistErrors.imageUrl" />
          </div>
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
      <AdminTable ref="podcastTable" :headers="['', 'Name', 'URL', '']" :is-empty="store.podcasts.length === 0">
        <tr v-for="row in store.podcasts" :key="row.id">
          <td class="px-4 py-3"><GripVertical :size="16" class="drag-handle cursor-grab text-slate-400" /></td>
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
        <form class="space-y-4" novalidate @submit.prevent="submitPodcast">
          <div>
            <AdminLabel text="Name" required />
            <input v-model="podcastForm.name" type="text" maxlength="100" :class="errorInputClass(inputClass, podcastErrors.name)" />
            <AdminFieldError :message="podcastErrors.name" />
          </div>
          <div>
            <AdminLabel text="URL" required />
            <input v-model="podcastForm.url" type="url" maxlength="500" :class="errorInputClass(inputClass, podcastErrors.url)" />
            <AdminFieldError :message="podcastErrors.url" />
          </div>
          <div>
            <AdminLabel text="Image URL" />
            <input v-model="podcastForm.imageUrl" type="url" maxlength="500" :class="errorInputClass(inputClass, podcastErrors.imageUrl)" />
            <AdminFieldError :message="podcastErrors.imageUrl" />
          </div>
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
      <AdminTable ref="bookTable" :headers="['', 'Title', 'Author', 'Reading', '']" :is-empty="store.adminBooks.length === 0">
        <tr v-for="row in store.adminBooks" :key="row.id">
          <td class="px-4 py-3"><GripVertical :size="16" class="drag-handle cursor-grab text-slate-400" /></td>
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
        <form class="space-y-4" novalidate @submit.prevent="submitBook">
          <div>
            <AdminLabel text="Title" required />
            <input v-model="bookForm.title" type="text" maxlength="150" :class="errorInputClass(inputClass, bookErrors.title)" />
            <AdminFieldError :message="bookErrors.title" />
          </div>
          <div>
            <AdminLabel text="Author" required />
            <input v-model="bookForm.author" type="text" maxlength="100" :class="errorInputClass(inputClass, bookErrors.author)" />
            <AdminFieldError :message="bookErrors.author" />
          </div>
          <AdminTranslatableInput v-model="bookForm.note" label="Note (opsional)" type="textarea" :rows="2" :maxlength="500" />
          <div>
            <AdminLabel text="Image URL" />
            <input v-model="bookForm.imageUrl" type="url" maxlength="500" :class="errorInputClass(inputClass, bookErrors.imageUrl)" />
            <AdminFieldError :message="bookErrors.imageUrl" />
          </div>
          <AdminToggleSwitch v-model="bookForm.isCurrentlyReading" label="Currently reading" />
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
      <AdminTable ref="lifeTable" :headers="['', 'Name', 'Aspect', 'Note', '']" :is-empty="store.adminLifeInspirations.length === 0">
        <tr v-for="row in store.adminLifeInspirations" :key="row.id">
          <td class="px-4 py-3"><GripVertical :size="16" class="drag-handle cursor-grab text-slate-400" /></td>
          <td class="px-4 py-3 font-medium">{{ row.name }}</td>
          <td class="px-4 py-3 text-slate-500">{{ row.aspect.id }} <span class="text-slate-400">/ {{ row.aspect.en }}</span></td>
          <td class="px-4 py-3 text-slate-500 truncate max-w-sm">{{ row.note.id }}</td>
          <td class="px-4 py-3">
            <div class="flex justify-end gap-1">
              <button class="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500" @click="openLifeEdit(row)"><Pencil :size="15" /></button>
              <button class="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-500/10 text-red-500" @click="lifeDeleteTarget = row"><Trash2 :size="15" /></button>
            </div>
          </td>
        </tr>
      </AdminTable>

      <AdminModal :show="lifeModal" :title="lifeEditingId !== null ? 'Edit' : 'Tambah'" @close="lifeModal = false">
        <form class="space-y-4" novalidate @submit.prevent="submitLife">
          <div>
            <AdminLabel text="Name" required />
            <input v-model="lifeForm.name" type="text" maxlength="100" :class="errorInputClass(inputClass, lifeErrors.name)" />
            <AdminFieldError :message="lifeErrors.name" />
          </div>
          <AdminTranslatableInput v-model="lifeForm.aspect" label="Aspect" required :maxlength="150" :error-id="lifeErrors.aspectId" :error-en="lifeErrors.aspectEn" />
          <AdminTranslatableInput v-model="lifeForm.note" label="Note" type="textarea" required :maxlength="1000" :error-id="lifeErrors.noteId" :error-en="lifeErrors.noteEn" />
          <div>
            <AdminLabel text="Image URL" />
            <input v-model="lifeForm.imageUrl" type="url" maxlength="500" :class="errorInputClass(inputClass, lifeErrors.imageUrl)" />
            <AdminFieldError :message="lifeErrors.imageUrl" />
          </div>
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
