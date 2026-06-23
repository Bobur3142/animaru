import { ref, computed } from 'vue';

export interface Anime {
  id: string;
  title: string;
  cover: string;     // poster (portrait)
  banner: string;    // banner (landscape)
  year: number;
  episodes: number;
  duration: number;  // minutes per ep
  rating: number;    // 0..10
  status: 'ongoing' | 'completed';
  type: 'TV' | 'Movie' | 'OVA';
  studio: string;
  genres: string[];
  synopsis: string;
}

const img = (seed: string, w = 600, h = 900) =>
  `https://picsum.photos/seed/${encodeURIComponent(seed)}/${w}/${h}`;

export const GENRES = [
  'Action', 'Adventure', 'Comedy', 'Drama', 'Fantasy',
  'Romance', 'Sci-Fi', 'Slice of Life', 'Mystery', 'Supernatural',
  'Thriller', 'Sports', 'Mecha', 'Music',
];

export const animeList: Anime[] = [
  {
    id: 'a01',
    title: 'Solo leveling',
    cover: img('anime-eclipse', 600, 900),
    banner: img('anime-eclipse-bg', 1600, 720),
    year: 2024, episodes: 24, duration: 24, rating: 9.1,
    status: 'ongoing', type: 'TV', studio: 'MAPPA',
    genres: ['Action', 'Fantasy', 'Drama'],
    synopsis: 'In a world where ancient gods have returned, a lone swordsman must reignite the fallen sun before the Kingdom of Ash consumes everything. Every step forward is paid in memory; every memory burns brighter than the last.',
  },
  {
    id: 'a02',
    title: 'Crimson Notebook',
    cover: img('anime-crimson', 600, 900),
    banner: img('anime-crimson-bg', 1600, 720),
    year: 2023, episodes: 12, duration: 23, rating: 8.7,
    status: 'completed', type: 'TV', studio: 'Wit Studio',
    genres: ['Mystery', 'Thriller', 'Supernatural'],
    synopsis: 'A high school detective finds a notebook that records crimes before they happen. The closer he reads, the more his own name appears.',
  },
  {
    id: 'a03',
    title: 'Spring of the Quiet Sea',
    cover: img('anime-spring', 600, 900),
    banner: img('anime-spring-bg', 1600, 720),
    year: 2024, episodes: 13, duration: 24, rating: 8.4,
    status: 'ongoing', type: 'TV', studio: 'Kyoto Animation',
    genres: ['Slice of Life', 'Romance', 'Drama'],
    synopsis: 'Two strangers meet at a quiet seaside station and slowly rebuild their lives across one long, golden spring.',
  },
  {
    id: 'a04',
    title: 'Iron Tempest',
    cover: img('anime-iron', 600, 900),
    banner: img('anime-iron-bg', 1600, 720),
    year: 2022, episodes: 26, duration: 24, rating: 8.9,
    status: 'completed', type: 'TV', studio: 'Sunrise',
    genres: ['Mecha', 'Action', 'Sci-Fi'],
    synopsis: 'When the orbital ring falls, a teenage pilot inherits the last working frame and the burden of an entire colony.',
  },
  {
    id: 'a05',
    title: 'Lantern Hearts',
    cover: img('anime-lantern', 600, 900),
    banner: img('anime-lantern-bg', 1600, 720),
    year: 2024, episodes: 12, duration: 24, rating: 8.2,
    status: 'ongoing', type: 'TV', studio: 'CloverWorks',
    genres: ['Romance', 'Comedy', 'Slice of Life'],
    synopsis: 'A festival lantern maker and an exchange student promise to meet again next summer — and spend a year trying not to forget how.',
  },
  {
    id: 'a06',
    title: 'Nightfall Detective Agency',
    cover: img('anime-nightfall', 600, 900),
    banner: img('anime-nightfall-bg', 1600, 720),
    year: 2023, episodes: 24, duration: 24, rating: 8.8,
    status: 'completed', type: 'TV', studio: 'Bones',
    genres: ['Mystery', 'Supernatural', 'Action'],
    synopsis: 'In a city where shadows hire detectives, three misfits take on cases nobody else will touch.',
  },
  {
    id: 'a07',
    title: 'Skybound Symphony',
    cover: img('anime-sky', 600, 900),
    banner: img('anime-sky-bg', 1600, 720),
    year: 2024, episodes: 11, duration: 24, rating: 8.5,
    status: 'ongoing', type: 'TV', studio: 'P.A. Works',
    genres: ['Music', 'Drama', 'Slice of Life'],
    synopsis: 'A grounded pilot rediscovers her love for flying through an unlikely chamber orchestra of strangers.',
  },
  {
    id: 'a08',
    title: 'Wolves of the Empty Sky',
    cover: img('anime-wolves', 600, 900),
    banner: img('anime-wolves-bg', 1600, 720),
    year: 2021, episodes: 1, duration: 118, rating: 9.2,
    status: 'completed', type: 'Movie', studio: 'Studio Ghibli',
    genres: ['Fantasy', 'Adventure', 'Drama'],
    synopsis: 'A young shepherd follows a pack of impossible wolves across a sky that no longer holds stars.',
  },
  {
    id: 'a09',
    title: 'Hex of the Hollow Court',
    cover: img('anime-hex', 600, 900),
    banner: img('anime-hex-bg', 1600, 720),
    year: 2024, episodes: 12, duration: 24, rating: 8.0,
    status: 'ongoing', type: 'TV', studio: 'Trigger',
    genres: ['Fantasy', 'Action', 'Supernatural'],
    synopsis: 'Bound to a cursed crown, a runaway princess assembles a court of outcasts to break the line of dead kings.',
  },
  {
    id: 'a10',
    title: 'Last Train at Akiba',
    cover: img('anime-train', 600, 900),
    banner: img('anime-train-bg', 1600, 720),
    year: 2023, episodes: 12, duration: 23, rating: 8.3,
    status: 'completed', type: 'TV', studio: 'A-1 Pictures',
    genres: ['Comedy', 'Slice of Life', 'Romance'],
    synopsis: 'Every Friday at 11:58, the same five strangers catch the same midnight train. None of them have ever spoken — until tonight.',
  },
  {
    id: 'a11',
    title: 'Echoes Beneath the Ice',
    cover: img('anime-echoes', 600, 900),
    banner: img('anime-echoes-bg', 1600, 720),
    year: 2024, episodes: 10, duration: 24, rating: 8.6,
    status: 'ongoing', type: 'TV', studio: 'Madhouse',
    genres: ['Sci-Fi', 'Mystery', 'Thriller'],
    synopsis: 'A research crew thaws a 12,000-year-old signal — and the signal starts answering them in their own voices.',
  },
  {
    id: 'a12',
    title: 'Sunset Court',
    cover: img('anime-sunset', 600, 900),
    banner: img('anime-sunset-bg', 1600, 720),
    year: 2023, episodes: 25, duration: 24, rating: 8.5,
    status: 'completed', type: 'TV', studio: 'Production I.G',
    genres: ['Sports', 'Drama', 'Slice of Life'],
    synopsis: 'A retired tennis prodigy returns to coach the worst team in the prefecture — and rediscover why she loved the game.',
  },
];

export function getAnimeById(id: string): Anime | undefined {
  return animeList.find((a) => a.id === id);
}

/* ─── Favorites (localStorage) ─── */
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

/* ─── "Continue watching" ─── */
export const continueWatching = [
  { animeId: 'a01', ep: 8, title: 'The First Light', progress: 0.42, duration: '24:11' },
  { animeId: 'a06', ep: 14, title: 'The Crow That Wouldn\'t Speak', progress: 0.78, duration: '23:48' },
  { animeId: 'a04', ep: 2, title: 'The Falling Ring', progress: 0.15, duration: '24:30' },
  { animeId: 'a11', ep: 5, title: 'Voices in the Permafrost', progress: 0.55, duration: '24:02' },
];
