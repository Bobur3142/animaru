<template>
  <div class="anime-card" @click="goDetail">
    <div class="anime-card__poster">
      <img :src="anime.cover" :alt="anime.title" loading="lazy" />
      <div class="anime-card__overlay" />

      <div class="anime-card__badge">
        <q-icon name="star" />
        {{ anime.rating.toFixed(1) }}
      </div>

      <div v-if="rank" class="anime-card__rank">{{ rank }}</div>

      <div class="anime-card__play">
        <span><q-icon name="play_arrow" /></span>
      </div>
    </div>

    <div class="anime-card__body">
      <h3 class="anime-card__title">{{ anime.title }}</h3>
      <div class="anime-card__meta">
        <span>{{ anime.year }}</span>
        <span class="dot" />
        <span>{{ anime.type }}</span>
        <span class="dot" />
        <span>{{ anime.episodes }} ep</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';
import type { Anime } from 'src/composables/useAnime';

const props = defineProps<{ anime: Anime; rank?: number }>();
const router = useRouter();

function goDetail() {
  router.push({ name: 'anime-detail', params: { id: props.anime.id } });
}
</script>
