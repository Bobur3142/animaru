<template>
  <div class="fade-in">
    <div class="mb-6">
      <h1 class="text-3xl font-bold font-display mb-1">{{ t('fav.title') }}</h1>
      <p style="color: var(--text-muted)">{{ t('fav.sub') }}</p>
    </div>

    <div v-if="favorites.length" class="anime-grid stagger">
      <AnimeCard v-for="a in favorites" :key="a.id" :anime="a" />
    </div>

    <div v-else class="empty-state">
      <q-icon name="favorite_border" />
      <h3>{{ t('fav.empty') }}</h3>
      <p>{{ t('fav.empty_sub') }}</p>
      <q-btn
        class="app-btn-primary mt-4"
        icon="explore"
        :label="t('fav.browse')"
        unelevated
        @click="$router.push({ name: 'browse' })"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import AnimeCard from 'components/AnimeCard.vue';
import { useFavorites } from 'src/composables/useAnime';

const { t } = useI18n();
const { favorites } = useFavorites();
</script>
