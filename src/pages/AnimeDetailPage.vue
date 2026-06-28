<template>
  <div v-if="anime" class="fade-in">
    <!-- Banner -->
    <div class="detail-banner">
      <div class="detail-banner__bg" :style="{ backgroundImage: `url(${anime.banner})` }" />
      <div class="detail-banner__veil" />
    </div>

    <!-- Header grid -->
    <div class="detail-grid">
      <div class="detail-poster">
        <img :src="anime.cover" :alt="anime.title" />
      </div>

      <div class="detail-info">
        <h1 class="font-display">{{ anime.title }}</h1>

        <div class="detail-info__meta">
          <span><q-icon name="star" />{{ anime.rating.toFixed(1) }}</span>
          <span><q-icon name="calendar_today" size="16px" />{{ anime.year }}</span>
          <span><q-icon name="movie" size="16px" />{{ anime.type }}</span>
          <span v-if="totalEpisodes"><q-icon name="layers" size="16px" />{{ totalEpisodes }} ep</span>
        </div>

        <div class="detail-tags">
          <span v-for="g in anime.genres" :key="g">{{ g }}</span>
        </div>

        <div class="detail-actions">
          <q-btn
            class="app-btn-primary"
            icon="play_arrow"
            :label="t('detail.play')"
            unelevated
            @click="$router.push({ name: 'watch', params: { id: anime.id } })"
          />
          <q-btn
            class="app-btn-ghost"
            :icon="isFav(anime.id) ? 'favorite' : 'favorite_border'"
            :label="isFav(anime.id) ? t('detail.in_favorites') : t('detail.add_favorites')"
            unelevated
            @click="toggle(anime.id)"
          />
          <q-btn class="app-btn-ghost" icon="share" unelevated />
        </div>
      </div>
    </div>

    <!-- Body -->
    <div class="detail-body">
      <div class="detail-body__main">
        <h3 class="font-display">{{ t('detail.overview') }}</h3>
        <p class="detail-synopsis">{{ anime.synopsis }}</p>

        <h3 class="font-display" style="margin-top: 2rem;">{{ t('detail.episodes') }}</h3>

        <!-- Загрузка серий -->
        <div v-if="mediaLoading" class="flex justify-center" style="padding: 2rem;">
          <q-spinner color="primary" size="32px" />
        </div>

        <template v-else>
          <div v-for="season in media?.seasons" :key="season.season">
            <div v-if="media?.seasons && media.seasons.length > 1" class="season-title">
              {{ season.season }}
            </div>
            <div class="episode-list">
              <div
                v-for="ep in season.episodes"
                :key="ep.id"
                class="ep-row"
                @click="$router.push({ name: 'watch', params: { id: anime.id }, query: { ep: ep.id } })"
              >
                <div class="ep-row__num">{{ String(ep.episode).padStart(2, '0') }}</div>
                <div class="ep-row__thumb">
                  <img :src="anime.banner" :alt="ep.title" />
                </div>
                <div>
                  <div class="ep-row__title">{{ ep.title }}</div>
                  <div class="ep-row__sub">{{ anime.year }}</div>
                </div>
              </div>
            </div>
          </div>
        </template>
      </div>

      <aside class="detail-side">
        <h3 class="font-display">{{ t('detail.info') }}</h3>
        <dl>
          <dt>{{ t('detail.type') }}</dt>
          <dd>{{ anime.type }}</dd>
          <dt>{{ t('detail.year') }}</dt>
          <dd>{{ anime.year }}</dd>
          <template v-if="totalEpisodes">
            <dt>{{ t('detail.episodes_count') }}</dt>
            <dd>{{ totalEpisodes }}</dd>
          </template>
        </dl>
      </aside>
    </div>
  </div>

  <!-- Загрузка страницы -->
  <div v-else class="flex justify-center items-center" style="height: 400px;">
    <q-spinner color="primary" size="48px" />
  </div>
</template>

<script setup lang="ts">
import { computed, ref, onMounted, watch } from 'vue';
import { useRoute } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { getAnimeById, fetchCatalog, fetchMedia, useFavorites, type DriveMedia } from 'src/composables/useAnime';

const route = useRoute();
const { t } = useI18n();
const { isFav, toggle } = useFavorites();

const media = ref<DriveMedia | null>(null);
const mediaLoading = ref(false);

const anime = computed(() => getAnimeById(route.params.id as string));

const totalEpisodes = computed(() => {
  if (!media.value) return 0;
  return media.value.seasons.reduce((sum, s) => sum + s.episodes.length, 0);
});

async function loadMedia() {
  if (!anime.value) return;
  mediaLoading.value = true;
  try {
    media.value = await fetchMedia(anime.value.folderId);
  } catch (e) {
    console.error(e);
  } finally {
    mediaLoading.value = false;
  }
}

onMounted(async () => {
  await fetchCatalog();
  await loadMedia();
});

watch(() => route.params.id, loadMedia);
</script>
