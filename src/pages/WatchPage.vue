<template>
  <div v-if="anime" class="fade-in">
    <div class="mb-4 flex items-center gap-2">
      <q-btn class="app-icon-btn" icon="arrow_back" flat unelevated @click="$router.back()" />
      <div>
        <div class="text-xs font-semibold uppercase tracking-wider" style="color: var(--brand)">
          {{ t('watch.now_playing') }} · {{ t('watch.episode') }} {{ currentEp }}
        </div>
        <h1 class="text-2xl font-bold font-display" style="margin: 2px 0 0">{{ anime.title }}</h1>
      </div>
    </div>

    <div class="watch-grid">
      <div
        ref="shellRef"
        class="player-shell"
        :class="{ 'is-fullscreen': isFullscreen }"
        @dblclick="toggleFullscreen"
        @mousemove="showControls"
        @mouseleave="onShellLeave"
      >
        <video
          ref="videoRef"
          class="player-shell__video"
          :poster="solo_leveling_picture"
          :src="episodes.find(item => item.id === currentEp)?.video"
          @click="togglePlay"
          @timeupdate="onTimeUpdate"
          @loadedmetadata="onLoadedMeta"
          @play="isPlaying = true"
          @pause="isPlaying = false"
          @ended="onEnded"
        />

        <div
          v-if="!isPlaying"
          class="player-shell__play"
          @click="togglePlay"
        >
          <q-icon name="play_arrow" />
        </div>

        <div class="player-shell__bar" v-show="controlsVisible">
          <div class="ico" @click="togglePlay">
            <q-icon :name="isPlaying ? 'pause' : 'play_arrow'" size="20px" />
          </div>
          <span class="time">{{ formatTime(currentTime) }}</span>

          <div
            class="progress"
            ref="progressRef"
            @mousedown="startSeek"
            @touchstart="startSeek"
          >
            <div class="progress__track">
              <span class="progress__fill" :style="{ width: progressPct + '%' }" />
              <span
                class="progress__thumb"
                :class="{ 'is-dragging': isDragging }"
                :style="{ left: progressPct + '%' }"
              />
            </div>
          </div>

          <span class="time">{{ formatTime(duration) }}</span>
          <div class="ico" @click="toggleMute">
            <q-icon :name="isMuted ? 'volume_off' : 'volume_up'" size="20px" />
          </div>
          <div class="ico" @click="toggleFullscreen">
            <q-icon :name="isFullscreen ? 'fullscreen_exit' : 'fullscreen'" size="20px" />
          </div>
        </div>
      </div>

      <aside class="episodes-panel">
        <h3 class="font-display">{{ t('watch.episodes_list') }}</h3>
        <div class="ep-list hide-scroll">
          <div
            v-for="ep in episodes"
            :key="ep.id"
            class="episode-card"
            :class="{ 'is-current': ep.id === currentEp }"
            @click="currentEp = ep.id"
          >
            <div class="episode-card__thumb">
              <img :src="ep.poster" alt="alt" />
              <div v-if="getEpisodeProgressPct(ep.id)" class="episode-card__progress">
                <span :style="{ width: getEpisodeProgressPct(ep.id) + '%' }" />
              </div>
            </div>
            <div class="episode-card__info">
              <div class="ep">{{ t('watch.episode') }} {{ ep.id }}</div>
              <p>{{ anime.duration }}:00</p>
            </div>
          </div>
        </div>
      </aside>
    </div>

    <div class="mt-6">
      <div class="flex items-center gap-3 mb-3">
        <h2 class="text-xl font-bold font-display" style="margin: 0">{{ anime.title }}</h2>
        <q-chip class="app-chip" dense :label="anime.type" />
        <q-chip class="app-chip" dense :label="String(anime.year)" />
        <span class="flex items-center gap-1 text-sm font-semibold" style="color: var(--rating)">
              <q-icon name="star" size="16px" /> {{ anime.rating.toFixed(1) }}
            </span>
      </div>
      <div class="detail-tags mb-4">
        <span v-for="g in anime.genres" :key="g">{{ g }}</span>
      </div>
      <p style="color: var(--text-2); line-height: 1.7;">{{ anime.synopsis }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import {computed, ref, reactive, onBeforeUnmount, onMounted, watch} from 'vue';
import { useRoute } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { getAnimeById } from 'src/composables/useAnime';
import solo_2_1 from 'src/statics/solo_2_1.mp4'
import solo_2_2 from 'src/statics/solo_2_2.mp4'
import solo_2_3 from 'src/statics/solo_2_3.mp4'
import solo_2_4 from 'src/statics/solo_2_4.mp4'
import solo_2_5 from 'src/statics/solo_2_5.mp4'
import solo_2_6 from 'src/statics/solo_2_6.mp4'
import solo_2_7 from 'src/statics/solo_2_7.mp4'
import solo_leveling_picture from 'src/statics/solo-leveling-picture.png'

const route = useRoute();
const { t } = useI18n();
const currentEp = ref(1);

const anime = computed(() => getAnimeById(route.params.id as string));

const STORAGE_PREFIX = 'watch-progress';

// ключ для конкретного эпизода конкретного аниме
function progressKey(epId: number) {
  return `${STORAGE_PREFIX}:${route.params.id}:${epId}`;
}

// { [epId]: { time: number, duration: number } } — кэш в памяти для реактивного % в списке эпизодов
const progressMap = reactive<Record<number, { time: number; duration: number }>>({});

function loadProgressFor(epId: number) {
  try {
    const raw = localStorage.getItem(progressKey(epId));
    if (!raw) return null;
    const parsed = JSON.parse(raw) as { time: number; duration: number };
    progressMap[epId] = parsed;
    return parsed;
  } catch {
    return null;
  }
}

function saveProgressFor(epId: number, time: number, dur: number) {
  if (!dur || isNaN(dur)) return;
  const payload = { time, duration: dur };
  progressMap[epId] = payload;
  try {
    localStorage.setItem(progressKey(epId), JSON.stringify(payload));
  } catch {
    /* localStorage может быть недоступен (приватный режим и т.п.) — просто игнорируем */
  }
}

function clearProgressFor(epId: number) {
  delete progressMap[epId];
  try {
    localStorage.removeItem(progressKey(epId));
  } catch { /* ignore */ }
}

function getEpisodeProgressPct(epId: number) {
  const p = progressMap[epId];
  if (!p || !p.duration) return 0;
  return Math.min(100, (p.time / p.duration) * 100);
}

onMounted(() => {
  episodes.value.forEach(ep => loadProgressFor(ep.id));

  const saved = loadProgressFor(currentEp.value);
  if (saved) {
    pendingResumeTime.value = saved.time;
  }

  window.addEventListener('beforeunload', persistCurrent);
  document.addEventListener('visibilitychange', onVisibilityChange);
});

function onVisibilityChange() {
  if (document.hidden) persistCurrent();
}

function persistCurrent() {
  if (videoRef.value && duration.value) {
    saveProgressFor(currentEp.value, videoRef.value.currentTime, duration.value);
  }
}

const pendingResumeTime = ref<number | null>(null);

watch(currentEp, (newEp, oldEp) => {
  const el = videoRef.value;

  if (el && oldEp !== undefined) {
    saveProgressFor(oldEp, el.currentTime, duration.value);
  }

  if (!el) return;

  el.pause();
  currentTime.value = 0;
  isPlaying.value = false;

  const saved = loadProgressFor(newEp);
  pendingResumeTime.value = saved ? saved.time : null;

  el.load();
});

const episodes = ref([
  {
    id: 1,
    video: solo_2_1,
    poster: solo_leveling_picture,
  },
  {
    id: 2,
    video: solo_2_2,
    poster: solo_leveling_picture,
  },
  {
    id: 3,
    video: solo_2_3,
    poster: solo_leveling_picture,
  },
  {
    id: 4,
    video: solo_2_4,
    poster: solo_leveling_picture,
  },
  {
    id: 5,
    video: solo_2_5,
    poster: solo_leveling_picture,
  },
  {
    id: 6,
    video: solo_2_6,
    poster: solo_leveling_picture,
  },
  {
    id: 7,
    video: solo_2_7,
    poster: solo_leveling_picture,
  },
])

const videoRef = ref<HTMLVideoElement | null>(null);
const shellRef = ref<HTMLDivElement | null>(null);
const progressRef = ref<HTMLDivElement | null>(null);

const isPlaying = ref(false);
const isMuted = ref(false);
const isFullscreen = ref(false);
const isDragging = ref(false);
const currentTime = ref(0);
const duration = ref(0);
const controlsVisible = ref(true);
let hideTimeout: ReturnType<typeof setTimeout> | null = null;
let saveTimer: ReturnType<typeof setInterval> | null = null;

const progressPct = computed(() => {
  if (!duration.value) return 0;
  return (currentTime.value / duration.value) * 100;
});

function togglePlay() {
  const el = videoRef.value;
  if (!el) return;
  if (el.paused) {
    el.play();
  } else {
    el.pause();
  }
}

function onTimeUpdate() {
  if (videoRef.value && !isDragging.value) currentTime.value = videoRef.value.currentTime;
}

function onLoadedMeta() {
  const el = videoRef.value;
  if (!el) return;
  duration.value = el.duration;

  // восстанавливаем позицию: при первой загрузке страницы или при переключении на эпизод,
  // который уже смотрели
  if (pendingResumeTime.value && pendingResumeTime.value > 0 && pendingResumeTime.value < el.duration - 1) {
    el.currentTime = pendingResumeTime.value;
    currentTime.value = pendingResumeTime.value;
  }
  pendingResumeTime.value = null;
}

function onEnded() {
  isPlaying.value = false;
  // эпизод досмотрен — убираем сохранённый прогресс, чтобы полоска не "застывала" на 100%
  clearProgressFor(currentEp.value);
}

/* --- Перетаскивание полосы прогресса (drag-to-seek) --- */
function pctFromEvent(e: MouseEvent | TouchEvent) {
  const bar = progressRef.value;
  if (!bar) return 0;
  const rect = bar.getBoundingClientRect();
  const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
  const pct = (clientX - rect.left) / rect.width;
  return Math.min(1, Math.max(0, pct));
}

function applySeek(e: MouseEvent | TouchEvent) {
  if (!duration.value) return;
  const pct = pctFromEvent(e);
  currentTime.value = pct * duration.value;
  if (videoRef.value) videoRef.value.currentTime = currentTime.value;
}

function startSeek(e: MouseEvent | TouchEvent) {
  isDragging.value = true;
  applySeek(e);
  window.addEventListener('mousemove', onDragMove);
  window.addEventListener('mouseup', endSeek);
  window.addEventListener('touchmove', onDragMove);
  window.addEventListener('touchend', endSeek);
}

function onDragMove(e: MouseEvent | TouchEvent) {
  if (!isDragging.value) return;
  applySeek(e);
}

function endSeek() {
  isDragging.value = false;
  window.removeEventListener('mousemove', onDragMove);
  window.removeEventListener('mouseup', endSeek);
  window.removeEventListener('touchmove', onDragMove);
  window.removeEventListener('touchend', endSeek);
  persistCurrent();
}

function toggleMute() {
  const el = videoRef.value;
  if (!el) return;
  el.muted = !el.muted;
  isMuted.value = el.muted;
}

/* --- Кастомный полноэкранный режим: на весь shell, а не только на video --- */
function toggleFullscreen() {
  const el = shellRef.value;
  if (!el) return;
  if (document.fullscreenElement) {
    document.exitFullscreen();
  } else {
    el.requestFullscreen?.();
  }
}

function onFullscreenChange() {
  isFullscreen.value = !!document.fullscreenElement;
}

function formatTime(sec: number) {
  if (!sec || isNaN(sec)) return '00:00';
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

function showControls() {
  controlsVisible.value = true;
  if (hideTimeout) clearTimeout(hideTimeout);
  if (isPlaying.value) {
    hideTimeout = setTimeout(() => {
      controlsVisible.value = false;
    }, 2500);
  }
}

function onShellLeave() {
  if (isPlaying.value && !isDragging.value) controlsVisible.value = false;
}

document.addEventListener('fullscreenchange', onFullscreenChange);

saveTimer = setInterval(() => {
  if (isPlaying.value) persistCurrent();
}, 5000);

onBeforeUnmount(() => {
  if (hideTimeout) clearTimeout(hideTimeout);
  if (saveTimer) clearInterval(saveTimer);
  persistCurrent();
  document.removeEventListener('fullscreenchange', onFullscreenChange);
  window.removeEventListener('beforeunload', persistCurrent);
  document.removeEventListener('visibilitychange', onVisibilityChange);
  endSeek();
});
</script>

<style scoped>
.episode-card.is-current {
  border-color: var(--brand);
  background: var(--brand-soft);
}

.player-shell__video {
  width: 100%;
  height: 100%;
  object-fit: cover;
  background: #000;
  position: relative;
  z-index: 1;
}
</style>
