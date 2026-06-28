import { ref, computed } from 'vue';
import { url_http } from 'boot/constants';
import {$axios} from "boot/axios";

// ─── Типы ────────────────────────────────────────────────────────────────────

export interface Anime {
  id: string;
  title: string;
  cover: string;      // poster (portrait)
  banner: string;     // banner (landscape) — используем poster если нет отдельного
  year: number;
  episodes: number;
  duration: number;
  rating: number;
  status: 'ongoing' | 'completed';
  type: 'TV' | 'Movie' | 'OVA';
  studio: string;
  genres: string[];
  synopsis: string;
  folderId: string;   // ID папки в Google Drive
  driveType: 'movie' | 'anime';
}

export interface DriveEpisode {
  id: string;
  title: string;
  episode: number;
  streamUrl: string;
}

export interface DriveSeason {
  season: string;
  episodes: DriveEpisode[];
}

export interface DriveMedia {
  type: 'movie' | 'anime';
  seasons: DriveSeason[];
}

// ─── Каталог из Google Drive ──────────────────────────────────────────────────

export const animeList = ref<Anime[]>([]);
export const isLoading = ref(false);
export const catalogError = ref('');

export async function fetchCatalog() {
  if (animeList.value.length > 0) return; // уже загружено
  isLoading.value = true;
  catalogError.value = '';
  try {
    const res = await $axios.get(`${url_http.DRIVE_API}/api/catalog`);
    const items = res.data.data as Array<{
      id: string;
      title: string;
      description: string;
      genre: string;
      year: string;
      rating: string;
      type: 'movie' | 'anime';
      poster: string | null;
      folderId: string;
    }>;

    animeList.value = items.map((item) => ({
      id: item.folderId,
      title: item.title,
      cover: item.poster || `https://picsum.photos/seed/${encodeURIComponent(item.title)}/600/900`,
      banner: item.poster || `https://picsum.photos/seed/${encodeURIComponent(item.title + '-bg')}/1600/720`,
      year: parseInt(item.year) || new Date().getFullYear(),
      episodes: 0,     // подгрузим при открытии
      duration: 24,
      rating: parseFloat(item.rating) || 8.0,
      status: 'ongoing',
      type: item.type === 'movie' ? 'Movie' : 'TV',
      studio: '',
      genres: item.genre ? item.genre.split('/').map((g) => g.trim()) : [],
      synopsis: item.description || '',
      folderId: item.folderId,
      driveType: item.type,
    }));
  } catch (e) {
    console.error('Ошибка загрузки каталога:', e);
    catalogError.value = 'Не удалось загрузить каталог';
  } finally {
    isLoading.value = false;
  }
}

// ─── Медиа для конкретного тайтла ────────────────────────────────────────────

export async function fetchMedia(folderId: string): Promise<DriveMedia> {
  const res = await $axios.get(`${url_http.DRIVE_API}/api/media/${folderId}`);
  return res.data;
}

export function getStreamUrl(streamPath: string): string {
  return `${url_http.DRIVE_API}${streamPath}`;
}

// ─── Поиск по ID ─────────────────────────────────────────────────────────────

export function getAnimeById(id: string): Anime | undefined {
  return animeList.value.find((a) => a.id === id);
}

// ─── Жанры ───────────────────────────────────────────────────────────────────

export const GENRES = [
  'Action', 'Adventure', 'Comedy', 'Drama', 'Fantasy',
  'Romance', 'Sci-Fi', 'Slice of Life', 'Mystery', 'Supernatural',
  'Thriller', 'Sports', 'Mecha', 'Music',
];

// ─── Избранное ────────────────────────────────────────────────────────────────

const FAV_KEY = 'app-favorites';
const favIds = ref<string[]>(
  (() => {
    try { return JSON.parse(localStorage.getItem(FAV_KEY) || '[]'); }
    catch { return []; }
  })()
);

function persist() {
  localStorage.setItem(FAV_KEY, JSON.stringify(favIds.value));
}

export function useFavorites() {
  const favorites = computed(() =>
    favIds.value.map((id) => getAnimeById(id)).filter(Boolean) as Anime[]
  );
  function isFav(id: string) { return favIds.value.includes(id); }
  function toggle(id: string) {
    favIds.value = isFav(id)
      ? favIds.value.filter((x) => x !== id)
      : [...favIds.value, id];
    persist();
  }
  return { favorites, isFav, toggle };
}

// ─── "Продолжить просмотр" ────────────────────────────────────────────────────

export const continueWatching = ref<Array<{
  animeId: string;
  ep: number;
  title: string;
  progress: number;
  duration: string;
}>>([]);
