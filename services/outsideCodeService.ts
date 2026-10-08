import { apiFetch } from './apiClient'
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

export const outsideCodeService = {
  getIntro: () => apiFetch<OutsideCodeIntro>('/outside-code/intro'),
  getIntroAdmin: () => apiFetch<OutsideCodeIntroAdmin>('/outside-code/intro/admin'),
  updateIntro: (dto: OutsideCodeIntroAdmin) => apiFetch<OutsideCodeIntroAdmin>('/outside-code/intro', { method: 'PUT', body: dto }),

  getAwayFromKeyboard: () => apiFetch<AwayFromKeyboardItem[]>('/outside-code/away-from-keyboard'),
  getAwayFromKeyboardAdmin: () => apiFetch<AwayFromKeyboardItemAdmin[]>('/outside-code/away-from-keyboard/admin'),
  createAwayFromKeyboard: (dto: Omit<AwayFromKeyboardItemAdmin, 'id'>) =>
    apiFetch<AwayFromKeyboardItemAdmin>('/outside-code/away-from-keyboard', { method: 'POST', body: dto }),
  updateAwayFromKeyboard: (id: number, dto: Omit<AwayFromKeyboardItemAdmin, 'id'>) =>
    apiFetch<void>(`/outside-code/away-from-keyboard/${id}`, { method: 'PUT', body: dto }),
  deleteAwayFromKeyboard: (id: number) => apiFetch<void>(`/outside-code/away-from-keyboard/${id}`, { method: 'DELETE' }),

  getMovies: () => apiFetch<MovieTake[]>('/outside-code/movies'),
  getMoviesAdmin: () => apiFetch<MovieTakeAdmin[]>('/outside-code/movies/admin'),
  createMovie: (dto: Omit<MovieTakeAdmin, 'id'>) => apiFetch<MovieTakeAdmin>('/outside-code/movies', { method: 'POST', body: dto }),
  updateMovie: (id: number, dto: Omit<MovieTakeAdmin, 'id'>) =>
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
  getBooksAdmin: () => apiFetch<OutsideCodeBookAdmin[]>('/outside-code/books/admin'),
  createBook: (dto: Omit<OutsideCodeBookAdmin, 'id'>) => apiFetch<OutsideCodeBookAdmin>('/outside-code/books', { method: 'POST', body: dto }),
  updateBook: (id: number, dto: Omit<OutsideCodeBookAdmin, 'id'>) =>
    apiFetch<void>(`/outside-code/books/${id}`, { method: 'PUT', body: dto }),
  deleteBook: (id: number) => apiFetch<void>(`/outside-code/books/${id}`, { method: 'DELETE' }),

  getLifeInspirations: () => apiFetch<LifeInspiration[]>('/outside-code/life-inspirations'),
  getLifeInspirationsAdmin: () => apiFetch<LifeInspirationAdmin[]>('/outside-code/life-inspirations/admin'),
  createLifeInspiration: (dto: Omit<LifeInspirationAdmin, 'id'>) =>
    apiFetch<LifeInspirationAdmin>('/outside-code/life-inspirations', { method: 'POST', body: dto }),
  updateLifeInspiration: (id: number, dto: Omit<LifeInspirationAdmin, 'id'>) =>
    apiFetch<void>(`/outside-code/life-inspirations/${id}`, { method: 'PUT', body: dto }),
  deleteLifeInspiration: (id: number) => apiFetch<void>(`/outside-code/life-inspirations/${id}`, { method: 'DELETE' }),
}
