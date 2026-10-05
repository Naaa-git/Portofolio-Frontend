import { apiFetch } from './apiClient'
import type {
  OutsideCodeIntro,
  AwayFromKeyboardItem,
  MovieTake,
  MusicArtist,
  PodcastChannel,
  OutsideCodeBook,
  LifeInspiration,
} from '~/types'

export const outsideCodeService = {
  getIntro: () => apiFetch<OutsideCodeIntro>('/outside-code/intro'),
  updateIntro: (dto: OutsideCodeIntro) => apiFetch<OutsideCodeIntro>('/outside-code/intro', { method: 'PUT', body: dto }),

  getAwayFromKeyboard: () => apiFetch<AwayFromKeyboardItem[]>('/outside-code/away-from-keyboard'),
  createAwayFromKeyboard: (dto: Omit<AwayFromKeyboardItem, 'id'>) =>
    apiFetch<AwayFromKeyboardItem>('/outside-code/away-from-keyboard', { method: 'POST', body: dto }),
  updateAwayFromKeyboard: (id: number, dto: Omit<AwayFromKeyboardItem, 'id'>) =>
    apiFetch<void>(`/outside-code/away-from-keyboard/${id}`, { method: 'PUT', body: dto }),
  deleteAwayFromKeyboard: (id: number) => apiFetch<void>(`/outside-code/away-from-keyboard/${id}`, { method: 'DELETE' }),

  getMovies: () => apiFetch<MovieTake[]>('/outside-code/movies'),
  createMovie: (dto: Omit<MovieTake, 'id'>) => apiFetch<MovieTake>('/outside-code/movies', { method: 'POST', body: dto }),
  updateMovie: (id: number, dto: Omit<MovieTake, 'id'>) =>
    apiFetch<void>(`/outside-code/movies/${id}`, { method: 'PUT', body: dto }),
  deleteMovie: (id: number) => apiFetch<void>(`/outside-code/movies/${id}`, { method: 'DELETE' }),

  getMusicArtists: () => apiFetch<MusicArtist[]>('/outside-code/music'),
  createMusicArtist: (dto: Omit<MusicArtist, 'id'>) => apiFetch<MusicArtist>('/outside-code/music', { method: 'POST', body: dto }),
  updateMusicArtist: (id: number, dto: Omit<MusicArtist, 'id'>) =>
    apiFetch<void>(`/outside-code/music/${id}`, { method: 'PUT', body: dto }),
  deleteMusicArtist: (id: number) => apiFetch<void>(`/outside-code/music/${id}`, { method: 'DELETE' }),

  getPodcasts: () => apiFetch<PodcastChannel[]>('/outside-code/podcasts'),
  createPodcast: (dto: Omit<PodcastChannel, 'id'>) => apiFetch<PodcastChannel>('/outside-code/podcasts', { method: 'POST', body: dto }),
  updatePodcast: (id: number, dto: Omit<PodcastChannel, 'id'>) =>
    apiFetch<void>(`/outside-code/podcasts/${id}`, { method: 'PUT', body: dto }),
  deletePodcast: (id: number) => apiFetch<void>(`/outside-code/podcasts/${id}`, { method: 'DELETE' }),

  getBooks: () => apiFetch<OutsideCodeBook[]>('/outside-code/books'),
  createBook: (dto: Omit<OutsideCodeBook, 'id'>) => apiFetch<OutsideCodeBook>('/outside-code/books', { method: 'POST', body: dto }),
  updateBook: (id: number, dto: Omit<OutsideCodeBook, 'id'>) =>
    apiFetch<void>(`/outside-code/books/${id}`, { method: 'PUT', body: dto }),
  deleteBook: (id: number) => apiFetch<void>(`/outside-code/books/${id}`, { method: 'DELETE' }),

  getLifeInspirations: () => apiFetch<LifeInspiration[]>('/outside-code/life-inspirations'),
  createLifeInspiration: (dto: Omit<LifeInspiration, 'id'>) =>
    apiFetch<LifeInspiration>('/outside-code/life-inspirations', { method: 'POST', body: dto }),
  updateLifeInspiration: (id: number, dto: Omit<LifeInspiration, 'id'>) =>
    apiFetch<void>(`/outside-code/life-inspirations/${id}`, { method: 'PUT', body: dto }),
  deleteLifeInspiration: (id: number) => apiFetch<void>(`/outside-code/life-inspirations/${id}`, { method: 'DELETE' }),
}
