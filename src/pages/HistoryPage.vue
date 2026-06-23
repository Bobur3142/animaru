<template>
  <div class="fade-in">
    <div class="mb-6">
      <h1 class="text-3xl font-bold font-display mb-1">{{ t('nav.history') }}</h1>
      <p style="color: var(--text-muted)">{{ t('sections.continue_sub') }}</p>
    </div>

    <div class="grid gap-3 stagger" style="grid-template-columns: repeat(auto-fill, minmax(360px, 1fr));">
      <div
        v-for="cw in continueWatching"
        :key="cw.animeId + cw.ep"
        class="episode-card"
        @click="$router.push({ name: 'watch', params: { id: cw.animeId } })"
      >
        <div class="episode-card__thumb">
          <img :src="getAnimeById(cw.animeId)?.banner" :alt="cw.title" />
          <div class="episode-card__progress"><span :style="{ width: cw.progress * 100 + '%' }" /></div>
        </div>
        <div class="episode-card__info">
          <div class="ep">{{ t('watch.episode') }} {{ cw.ep }}</div>
          <h4>{{ getAnimeById(cw.animeId)?.title }}</h4>
          <p>{{ cw.title }} · {{ cw.duration }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { continueWatching, getAnimeById } from 'src/composables/useAnime';

const { t } = useI18n();
</script>
