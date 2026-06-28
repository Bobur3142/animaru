<template>
  <div class="fade-in">
    <!-- Загрузка -->
    <div v-if="isLoading" class="flex justify-center items-center" style="height: 300px;">
      <q-spinner color="primary" size="48px" />
    </div>

    <template v-else>
      <HeroSlider v-if="heroItems.length" :items="heroItems" />

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

      <!-- Жанры -->
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

      <!-- Все тайтлы -->
      <SectionHead
        :title="t('sections.popular')"
        :subtitle="t('sections.popular_sub')"
        :action-text="t('sections.see_all')"
        @action="$router.push({ name: 'browse' })"
      />
      <div class="anime-grid stagger">
        <AnimeCard v-for="a in topRated" :key="a.id" :anime="a" />
      </div>
    </template>

    <!-- Ошибка -->
    <div v-if="catalogError" class="text-center" style="padding: 2rem; color: var(--text-2);">
      {{ catalogError }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';
import AnimeCard from 'components/AnimeCard.vue';
import SectionHead from 'components/SectionHead.vue';
import HeroSlider from 'components/HeroSlider.vue';
import { animeList, isLoading, catalogError, fetchCatalog, GENRES } from 'src/composables/useAnime';

const { t } = useI18n();

onMounted(() => {
  fetchCatalog();
});

const heroItems = computed(() => animeList.value.slice(0, 4));
const trending  = computed(() => [...animeList.value].sort((a, b) => b.rating - a.rating).slice(0, 10));
const topRated  = computed(() => [...animeList.value].sort((a, b) => b.rating - a.rating));
</script>
