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
          <span><q-icon name="schedule" size="16px" />{{ anime.duration }} {{ t('detail.min') }}</span>
          <span><q-icon name="layers" size="16px" />{{ anime.episodes }} ep</span>
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
          <q-btn class="app-btn-ghost" icon="play_circle_outline" :label="t('detail.trailer')" unelevated />
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
        <div class="episode-list">
          <div
            v-for="ep in episodes"
            :key="ep.num"
            class="ep-row"
            @click="$router.push({ name: 'watch', params: { id: anime.id } })"
          >
            <div class="ep-row__num">{{ String(ep.num).padStart(2, '0') }}</div>
            <div class="ep-row__thumb">
              <img :src="anime.banner" :alt="ep.title" />
            </div>
            <div>
              <div class="ep-row__title">{{ ep.title }}</div>
              <div class="ep-row__sub">{{ anime.year }} · {{ anime.studio }}</div>
            </div>
            <div class="ep-row__dur">
              <q-icon name="schedule" size="14px" /> {{ anime.duration }}:00
            </div>
          </div>
        </div>
      </div>

      <aside class="detail-side">
        <h3 class="font-display">{{ t('detail.info') }}</h3>
        <dl>
          <dt>{{ t('detail.studio') }}</dt>
          <dd>{{ anime.studio }}</dd>
          <dt>{{ t('detail.type') }}</dt>
          <dd>{{ anime.type }}</dd>
          <dt>{{ t('detail.status') }}</dt>
          <dd>{{ anime.status === 'ongoing' ? t('filters.ongoing') : t('filters.completed') }}</dd>
          <dt>{{ t('detail.year') }}</dt>
          <dd>{{ anime.year }}</dd>
          <dt>{{ t('detail.episodes_count') }}</dt>
          <dd>{{ anime.episodes }}</dd>
          <dt>{{ t('detail.duration') }}</dt>
          <dd>{{ anime.duration }} {{ t('detail.min') }}</dd>
        </dl>
      </aside>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { getAnimeById, useFavorites } from 'src/composables/useAnime';

const route = useRoute();
const { t } = useI18n();
const { isFav, toggle } = useFavorites();

const anime = computed(() => getAnimeById(route.params.id as string));

const epTitlePool = [
  'A Quiet Beginning', 'The First Light', 'Crossroads', 'Echoes from Below',
  'The Long Walk Home', 'Memory of Iron', 'Promises in the Rain',
  'What the Wind Remembers', 'The Last Lantern', 'A Smaller, Truer World',
  'The Crow That Wouldn\'t Speak', 'After the Bell',
];

const episodes = computed(() => {
  if (!anime.value) return [];
  return Array.from({ length: Math.min(anime.value.episodes, 12) }, (_, i) => ({
    num: i + 1,
    title: epTitlePool[i % epTitlePool.length],
  }));
});
</script>
