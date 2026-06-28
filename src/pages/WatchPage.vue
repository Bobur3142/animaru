<template>
  <div v-if="anime" class="fade-in">
    <div class="mb-4 flex items-center gap-2">
      <q-btn class="app-icon-btn" icon="arrow_back" flat unelevated @click="$router.back()" />
      <div>
        <div class="text-xs font-semibold uppercase tracking-wider" style="color: var(--brand)">
          {{ t('watch.now_playing') }} · {{ t('watch.episode') }} {{ currentEpIndex + 1 }}
        </div>
        <h1 class="text-2xl font-bold font-display" style="margin: 2px 0 0">{{ anime.title }}</h1>
      </div>
    </div>

    <!-- Загрузка -->
    <div v-if="mediaLoading" class="flex justify-center items-center" style="height: 400px;">
      <q-spinner color="primary" size="48px" />
    </div>

    <div v-else class="watch-grid">
      <!-- Плеер -->
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
          :src="currentStreamUrl"
          @click="togglePlay"
          @timeupdate="onTimeUpdate"
          @loadedmetadata="onLoadedMeta"
          @play="isPlaying = true"
          @pause="isPlaying = false"
          @ended="onEnded"
        />

        <div v-if="!isPlaying" class="player-shell__play" @click="togglePlay">
          <q-icon name="play_arrow" />
        </div>

        <div class="player-shell__bar" v-show="controlsVisible">
          <div class="ico" @click="togglePlay">
            <q-icon :name="isPlaying ? 'pause' : 'play_arrow'" size="20px" />
          </div>
          <span class="time">{{ formatTime(currentTime) }}</span>

          <div class="progress" ref="progressRef" @mousedown="startSeek" @touchstart="startSeek">
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

      <!-- Список серий -->
      <aside class="episodes-panel">
        <h3 class="font-display">{{ t('watch.episodes_list') }}</h3>
        <div class="ep-list hide-scroll">
          <template v-for="season in allSeasons" :key="season.season">
            <div v-if="allSeasons.length > 1" class="season-label">{{ season.season }}</div>
            <div
              v-for="ep in season.episodes"
              :key="ep.id"
              class="episode-card"
              :class="{ 'is-current': ep.id === currentEpId }"
              @click="selectEpisode(ep.id)"
            >
              <div class="episode-card__thumb">
                <img :src="anime.cover" :alt="ep.title" />
                <div v-if="getEpisodeProgressPct(ep.id)" class="episode-card__progress">
                  <span :style="{ width: getEpisodeProgressPct(ep.id) + '%' }" />
                </div>
              </div>
              <div class="episode-card__info">
                <div class="ep">{{ t('watch.episode') }} {{ ep.episode }}</div>
                <p>{{ ep.title }}</p>
              </div>
            </div>
          </template>
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
import { computed, ref, reactive, onBeforeUnmount, onMounted, watch } from 'vue';
import { useRoute } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { getAnimeById, fetchCatalog, fetchMedia, getStreamUrl, type DriveEpisode, type DriveSeason } from 'src/composables/useAnime';

const route = useRoute();
const { t } = useI18n();

const anime = computed(() => getAnimeById(route.params.id as string));
const mediaLoading = ref(false);
const allSeasons = ref<DriveSeason[]>([]);
const currentEpId = ref<string>('');

const currentEpIndex = computed(() => {
  const allEps = allSeasons.value.flatMap(s => s.episodes);
  return allEps.findIndex(e => e.id === currentEpId.value);
});

const currentStreamUrl = computed(() => {
  const allEps = allSeasons.value.flatMap(s => s.episodes);
  const ep = allEps.find(e => e.id === currentEpId.value);
  return ep ? getStreamUrl(ep.streamUrl) : '';
});

async function loadMedia() {
  if (!anime.value) return;
  mediaLoading.value = true;
  try {
    const media = await fetchMedia(anime.value.folderId);
    allSeasons.value = media.seasons;

    // Выбираем серию из query params или первую
    const epFromQuery = route.query.ep as string;
    const allEps = media.seasons.flatMap(s => s.episodes);
    if (epFromQuery && allEps.find(e => e.id === epFromQuery)) {
      currentEpId.value = epFromQuery;
    } else if (allEps.length > 0) {
      currentEpId.value = allEps[0].id;
    }

    // Загружаем прогресс для всех серий
    allEps.forEach(ep => loadProgressFor(ep.id));

    // Восстанавливаем позицию
    const saved = loadProgressFor(currentEpId.value);
    if (saved) pendingResumeTime.value = saved.time;

  } catch (e) {
    console.error(e);
  } finally {
    mediaLoading.value = false;
  }
}

function selectEpisode(epId: string) {
  if (epId === currentEpId.value) return;
  const el = videoRef.value;
  if (el) saveProgressFor(currentEpId.value, el.currentTime, duration.value);
  currentEpId.value = epId;
  const saved = loadProgressFor(epId);
  pendingResumeTime.value = saved ? saved.time : null;
}

// ─── Прогресс просмотра ───────────────────────────────────────────────────────

const STORAGE_PREFIX = 'watch-progress';

function progressKey(epId: string) {
  return `${STORAGE_PREFIX}:${route.params.id}:${epId}`;
}

const progressMap = reactive<Record<string, { time: number; duration: number }>>({});

function loadProgressFor(epId: string) {
  try {
    const raw = localStorage.getItem(progressKey(epId));
    if (!raw) return null;
    const parsed = JSON.parse(raw) as { time: number; duration: number };
    progressMap[epId] = parsed;
    return parsed;
  } catch { return null; }
}

function saveProgressFor(epId: string, time: number, dur: number) {
  if (!dur || isNaN(dur)) return;
  const payload = { time, duration: dur };
  progressMap[epId] = payload;
  try { localStorage.setItem(progressKey(epId), JSON.stringify(payload)); } catch {}
}

function clearProgressFor(epId: string) {
  delete progressMap[epId];
  try { localStorage.removeItem(progressKey(epId)); } catch {}
}

function getEpisodeProgressPct(epId: string) {
  const p = progressMap[epId];
  if (!p || !p.duration) return 0;
  return Math.min(100, (p.time / p.duration) * 100);
}

// ─── Плеер ───────────────────────────────────────────────────────────────────

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
const pendingResumeTime = ref<number | null>(null);
let hideTimeout: ReturnType<typeof setTimeout> | null = null;
let saveTimer: ReturnType<typeof setInterval> | null = null;

const progressPct = computed(() => {
  if (!duration.value) return 0;
  return (currentTime.value / duration.value) * 100;
});

function togglePlay() {
  const el = videoRef.value;
  if (!el) return;
  el.paused ? el.play() : el.pause();
}

function onTimeUpdate() {
  if (videoRef.value && !isDragging.value) currentTime.value = videoRef.value.currentTime;
}

function onLoadedMeta() {
  const el = videoRef.value;
  if (!el) return;
  duration.value = el.duration;
  if (pendingResumeTime.value && pendingResumeTime.value > 0 && pendingResumeTime.value < el.duration - 1) {
    el.currentTime = pendingResumeTime.value;
    currentTime.value = pendingResumeTime.value;
  }
  pendingResumeTime.value = null;
}

function onEnded() {
  isPlaying.value = false;
  clearProgressFor(currentEpId.value);
}

function pctFromEvent(e: MouseEvent | TouchEvent) {
  const bar = progressRef.value;
  if (!bar) return 0;
  const rect = bar.getBoundingClientRect();
  const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
  return Math.min(1, Math.max(0, (clientX - rect.left) / rect.width));
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
  if (isDragging.value) applySeek(e);
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

function toggleFullscreen() {
  const el = shellRef.value;
  if (!el) return;
  document.fullscreenElement ? document.exitFullscreen() : el.requestFullscreen?.();
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
    hideTimeout = setTimeout(() => { controlsVisible.value = false; }, 2500);
  }
}

function onShellLeave() {
  if (isPlaying.value && !isDragging.value) controlsVisible.value = false;
}

function persistCurrent() {
  if (videoRef.value && duration.value) {
    saveProgressFor(currentEpId.value, videoRef.value.currentTime, duration.value);
  }
}

document.addEventListener('fullscreenchange', onFullscreenChange);

onMounted(async () => {
  await fetchCatalog();
  await loadMedia();
  saveTimer = setInterval(() => { if (isPlaying.value) persistCurrent(); }, 5000);
  window.addEventListener('beforeunload', persistCurrent);
  document.addEventListener('visibilitychange', () => { if (document.hidden) persistCurrent(); });
});

onBeforeUnmount(() => {
  if (hideTimeout) clearTimeout(hideTimeout);
  if (saveTimer) clearInterval(saveTimer);
  persistCurrent();
  document.removeEventListener('fullscreenchange', onFullscreenChange);
  window.removeEventListener('beforeunload', persistCurrent);
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
.season-label {
  font-size: 12px;
  font-weight: 600;
  color: var(--text-2);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  padding: 8px 0 4px;
}
</style>
