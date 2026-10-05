import { defineStore } from 'pinia'
import { outsideCodeService } from '~/services/outsideCodeService'
import type {
  OutsideCodeIntro,
  AwayFromKeyboardItem,
  MovieTake,
  MusicArtist,
  PodcastChannel,
  OutsideCodeBook,
  LifeInspiration,
} from '~/types'

const emptyIntro: OutsideCodeIntro = { paragraph1: '', paragraph2: '' }

export const useOutsideCodeStore = defineStore('outsideCode', () => {
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

  async function updateIntro(dto: OutsideCodeIntro) {
    intro.value = await outsideCodeService.updateIntro(dto)
  }

  async function addAwayFromKeyboard(dto: Omit<AwayFromKeyboardItem, 'id'>) {
    awayFromKeyboard.value.push(await outsideCodeService.createAwayFromKeyboard(dto))
  }
  async function updateAwayFromKeyboard(id: number, dto: Omit<AwayFromKeyboardItem, 'id'>) {
    await outsideCodeService.updateAwayFromKeyboard(id, dto)
    const i = awayFromKeyboard.value.findIndex(x => x.id === id)
    if (i !== -1) awayFromKeyboard.value[i] = { id, ...dto }
  }
  async function deleteAwayFromKeyboard(id: number) {
    await outsideCodeService.deleteAwayFromKeyboard(id)
    awayFromKeyboard.value = awayFromKeyboard.value.filter(x => x.id !== id)
  }

  async function addMovie(dto: Omit<MovieTake, 'id'>) {
    movies.value.push(await outsideCodeService.createMovie(dto))
  }
  async function updateMovie(id: number, dto: Omit<MovieTake, 'id'>) {
    await outsideCodeService.updateMovie(id, dto)
    const i = movies.value.findIndex(x => x.id === id)
    if (i !== -1) movies.value[i] = { id, ...dto }
  }
  async function deleteMovie(id: number) {
    await outsideCodeService.deleteMovie(id)
    movies.value = movies.value.filter(x => x.id !== id)
  }

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

  async function addBook(dto: Omit<OutsideCodeBook, 'id'>) {
    books.value.push(await outsideCodeService.createBook(dto))
  }
  async function updateBook(id: number, dto: Omit<OutsideCodeBook, 'id'>) {
    await outsideCodeService.updateBook(id, dto)
    const i = books.value.findIndex(x => x.id === id)
    if (i !== -1) books.value[i] = { id, ...dto }
  }
  async function deleteBook(id: number) {
    await outsideCodeService.deleteBook(id)
    books.value = books.value.filter(x => x.id !== id)
  }

  async function addLifeInspiration(dto: Omit<LifeInspiration, 'id'>) {
    lifeInspirations.value.push(await outsideCodeService.createLifeInspiration(dto))
  }
  async function updateLifeInspiration(id: number, dto: Omit<LifeInspiration, 'id'>) {
    await outsideCodeService.updateLifeInspiration(id, dto)
    const i = lifeInspirations.value.findIndex(x => x.id === id)
    if (i !== -1) lifeInspirations.value[i] = { id, ...dto }
  }
  async function deleteLifeInspiration(id: number) {
    await outsideCodeService.deleteLifeInspiration(id)
    lifeInspirations.value = lifeInspirations.value.filter(x => x.id !== id)
  }

  return {
    intro, awayFromKeyboard, movies, musicArtists, podcasts, books, lifeInspirations,
    loadAll, updateIntro,
    addAwayFromKeyboard, updateAwayFromKeyboard, deleteAwayFromKeyboard,
    addMovie, updateMovie, deleteMovie,
    addMusicArtist, updateMusicArtist, deleteMusicArtist,
    addPodcast, updatePodcast, deletePodcast,
    addBook, updateBook, deleteBook,
    addLifeInspiration, updateLifeInspiration, deleteLifeInspiration,
  }
})
