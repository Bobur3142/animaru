<template>
  <div class="fade-in">
    <HeroSlider :items="heroItems" />

    <!-- Continue Watching -->
    <SectionHead
      :title="t('sections.continue')"
      :subtitle="t('sections.continue_sub')"
      :action-text="t('sections.see_all')"
    />
    <div class="grid gap-3 stagger" style="grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));">
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

    <!-- Trending -->
    <SectionHead
      :title="t('sections.trending')"
      :subtitle="t('sections.trending_sub')"
      :action-text="t('sections.see_all')"
      @action="$router.push({ name: 'browse' })"
    />
    <div class="scroll-row hide-scroll stagger">
      <AnimeCard
        v-for="(a, i) in trending"
        :key="a.id"
        :anime="a"
        :rank="i + 1"
      />
    </div>

    <!-- Genres -->
    <SectionHead :title="t('sections.by_genre')" />
    <div class="grid gap-3 stagger" style="grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));">
      <div
        v-for="g in GENRES.slice(0, 8)"
        :key="g"
        class="genre-pill text-center"
        @click="$router.push({ name: 'browse', query: { genre: g } })"
      >
        <span>{{ g }}</span>
      </div>
    </div>

    <!-- Top Rated -->
    <SectionHead
      :title="t('sections.popular')"
      :subtitle="t('sections.popular_sub')"
      :action-text="t('sections.see_all')"
      @action="$router.push({ name: 'browse' })"
    />
    <div class="anime-grid stagger">
      <AnimeCard v-for="a in topRated" :key="a.id" :anime="a" />
    </div>

    <!-- New Releases -->
    <SectionHead
      :title="t('sections.new_releases')"
      :subtitle="t('sections.new_releases_sub')"
    />
    <div class="scroll-row hide-scroll stagger">
      <AnimeCard v-for="a in newReleases" :key="a.id" :anime="a" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import AnimeCard from 'components/AnimeCard.vue';
import SectionHead from 'components/SectionHead.vue';
import HeroSlider from 'components/HeroSlider.vue';
import { animeList, continueWatching, getAnimeById, GENRES } from 'src/composables/useAnime';

const { t } = useI18n();

const heroItems   = computed(() => animeList.slice(0, 4));
const trending    = computed(() => [...animeList].sort((a, b) => b.rating - a.rating).slice(0, 10));
const topRated    = computed(() => [...animeList].sort((a, b) => b.rating - a.rating).slice(0, 12));
const newReleases = computed(() => animeList.filter(a => a.year >= 2024));
</script>
