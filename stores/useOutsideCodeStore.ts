import { defineStore } from 'pinia'
import { outsideCodeService } from '~/services/outsideCodeService'
import type {
  OutsideCodeIntro,
  OutsideCodeIntroAdmin,
  AwayFromKeyboardItem,
  AwayFromKeyboardItemAdmin,
  MovieTake,
  MovieTakeAdmin,
  MusicArtist,
  PodcastChannel,
  OutsideCodeBook,
  OutsideCodeBookAdmin,
  LifeInspiration,
  LifeInspirationAdmin,
} from '~/types'

const emptyIntro: OutsideCodeIntro = { paragraph1: '', paragraph2: '' }
const emptyAdminIntro: OutsideCodeIntroAdmin = { paragraph1: { id: '', en: '' }, paragraph2: { id: '', en: '' } }

export const useOutsideCodeStore = defineStore('outsideCode', () => {
  // --- Public (resolved for the current locale) ---
  const intro = ref<OutsideCodeIntro>({ ...emptyIntro })
  const awayFromKeyboard = ref<AwayFromKeyboardItem[]>([])
  const movies = ref<MovieTake[]>([])
  const musicArtists = ref<MusicArtist[]>([])
  const podcasts = ref<PodcastChannel[]>([])
  const books = ref<OutsideCodeBook[]>([])
  const lifeInspirations = ref<LifeInspiration[]>([])
  const isLoaded = ref(false)

  async function loadAll() {
    if (isLoaded.value) return
    const [introData, awayData, moviesData, musicData, podcastsData, booksData, lifeInspirationsData] = await Promise.all([
      outsideCodeService.getIntro(),
      outsideCodeService.getAwayFromKeyboard(),
      outsideCodeService.getMovies(),
      outsideCodeService.getMusicArtists(),
      outsideCodeService.getPodcasts(),
      outsideCodeService.getBooks(),
      outsideCodeService.getLifeInspirations(),
    ])
    intro.value = introData
    awayFromKeyboard.value = awayData
    movies.value = moviesData
    musicArtists.value = musicData
    podcasts.value = podcastsData
    books.value = booksData
    lifeInspirations.value = lifeInspirationsData
    isLoaded.value = true
  }

  // --- Admin (raw bilingual dictionaries) ---
  const adminIntro = ref<OutsideCodeIntroAdmin>({ ...emptyAdminIntro })
  const adminAwayFromKeyboard = ref<AwayFromKeyboardItemAdmin[]>([])
  const adminMovies = ref<MovieTakeAdmin[]>([])
  const adminBooks = ref<OutsideCodeBookAdmin[]>([])
  const adminLifeInspirations = ref<LifeInspirationAdmin[]>([])
  const isAdminLoaded = ref(false)

  async function loadAllAdmin() {
    if (isAdminLoaded.value) return
    const [introData, awayData, moviesData, booksData, lifeInspirationsData] = await Promise.all([
      outsideCodeService.getIntroAdmin(),
      outsideCodeService.getAwayFromKeyboardAdmin(),
      outsideCodeService.getMoviesAdmin(),
      outsideCodeService.getBooksAdmin(),
      outsideCodeService.getLifeInspirationsAdmin(),
    ])
    adminIntro.value = introData
    adminAwayFromKeyboard.value = awayData
    adminMovies.value = moviesData
    adminBooks.value = booksData
    adminLifeInspirations.value = lifeInspirationsData
    isAdminLoaded.value = true
  }

  async function updateIntro(dto: OutsideCodeIntroAdmin) {
    adminIntro.value = await outsideCodeService.updateIntro(dto)
  }

  async function addAwayFromKeyboard(dto: Omit<AwayFromKeyboardItemAdmin, 'id'>) {
    adminAwayFromKeyboard.value.push(await outsideCodeService.createAwayFromKeyboard(dto))
  }
  async function updateAwayFromKeyboard(id: number, dto: Omit<AwayFromKeyboardItemAdmin, 'id'>) {
    await outsideCodeService.updateAwayFromKeyboard(id, dto)
    const i = adminAwayFromKeyboard.value.findIndex(x => x.id === id)
    if (i !== -1) adminAwayFromKeyboard.value[i] = { id, ...dto }
  }
  async function deleteAwayFromKeyboard(id: number) {
    await outsideCodeService.deleteAwayFromKeyboard(id)
    adminAwayFromKeyboard.value = adminAwayFromKeyboard.value.filter(x => x.id !== id)
  }

  async function addMovie(dto: Omit<MovieTakeAdmin, 'id'>) {
    adminMovies.value.push(await outsideCodeService.createMovie(dto))
  }
  async function updateMovie(id: number, dto: Omit<MovieTakeAdmin, 'id'>) {
    await outsideCodeService.updateMovie(id, dto)
    const i = adminMovies.value.findIndex(x => x.id === id)
    if (i !== -1) adminMovies.value[i] = { id, ...dto }
  }
  async function deleteMovie(id: number) {
    await outsideCodeService.deleteMovie(id)
    adminMovies.value = adminMovies.value.filter(x => x.id !== id)
  }

  // --- Music / Podcasts (not translatable) ---
  async function addMusicArtist(dto: Omit<MusicArtist, 'id'>) {
    musicArtists.value.push(await outsideCodeService.createMusicArtist(dto))
  }
  async function updateMusicArtist(id: number, dto: Omit<MusicArtist, 'id'>) {
    await outsideCodeService.updateMusicArtist(id, dto)
    const i = musicArtists.value.findIndex(x => x.id === id)
    if (i !== -1) musicArtists.value[i] = { id, ...dto }
  }
  async function deleteMusicArtist(id: number) {
    await outsideCodeService.deleteMusicArtist(id)
    musicArtists.value = musicArtists.value.filter(x => x.id !== id)
  }

  async function addPodcast(dto: Omit<PodcastChannel, 'id'>) {
    podcasts.value.push(await outsideCodeService.createPodcast(dto))
  }
  async function updatePodcast(id: number, dto: Omit<PodcastChannel, 'id'>) {
    await outsideCodeService.updatePodcast(id, dto)
    const i = podcasts.value.findIndex(x => x.id === id)
    if (i !== -1) podcasts.value[i] = { id, ...dto }
  }
  async function deletePodcast(id: number) {
    await outsideCodeService.deletePodcast(id)
    podcasts.value = podcasts.value.filter(x => x.id !== id)
  }

  async function addBook(dto: Omit<OutsideCodeBookAdmin, 'id'>) {
    adminBooks.value.push(await outsideCodeService.createBook(dto))
  }
  async function updateBook(id: number, dto: Omit<OutsideCodeBookAdmin, 'id'>) {
    await outsideCodeService.updateBook(id, dto)
    const i = adminBooks.value.findIndex(x => x.id === id)
    if (i !== -1) adminBooks.value[i] = { id, ...dto }
  }
  async function deleteBook(id: number) {
    await outsideCodeService.deleteBook(id)
    adminBooks.value = adminBooks.value.filter(x => x.id !== id)
  }

  async function addLifeInspiration(dto: Omit<LifeInspirationAdmin, 'id'>) {
    adminLifeInspirations.value.push(await outsideCodeService.createLifeInspiration(dto))
  }
  async function updateLifeInspiration(id: number, dto: Omit<LifeInspirationAdmin, 'id'>) {
    await outsideCodeService.updateLifeInspiration(id, dto)
    const i = adminLifeInspirations.value.findIndex(x => x.id === id)
    if (i !== -1) adminLifeInspirations.value[i] = { id, ...dto }
  }
  async function deleteLifeInspiration(id: number) {
    await outsideCodeService.deleteLifeInspiration(id)
    adminLifeInspirations.value = adminLifeInspirations.value.filter(x => x.id !== id)
  }

  return {
    intro, awayFromKeyboard, movies, musicArtists, podcasts, books, lifeInspirations,
    loadAll,
    adminIntro, adminAwayFromKeyboard, adminMovies, adminBooks, adminLifeInspirations,
    loadAllAdmin, updateIntro,
    addAwayFromKeyboard, updateAwayFromKeyboard, deleteAwayFromKeyboard,
    addMovie, updateMovie, deleteMovie,
    addMusicArtist, updateMusicArtist, deleteMusicArtist,
    addPodcast, updatePodcast, deletePodcast,
    addBook, updateBook, deleteBook,
    addLifeInspiration, updateLifeInspiration, deleteLifeInspiration,
  }
})
