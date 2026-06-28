<template>
  <div class="fade-in">
    <div class="mb-6">
      <h1 class="text-3xl font-bold font-display mb-1">{{ t('nav.browse') }}</h1>
      <p class="text-sm" style="color: var(--text-muted)">
        {{ filtered.length }} / {{ animeList.length }}
      </p>
    </div>

    <!-- Filters -->
    <div class="filters-bar">
      <q-select
        v-model="filters.genre"
        :options="genreOptions"
        :label="t('filters.genre')"
        class="app-select flex-1"
        style="min-width: 180px"
        outlined dense
        emit-value
        map-options
        :popup-content-class="'app-menu'"
      />
      <q-select
        v-model="filters.type"
        :options="typeOptions"
        :label="t('filters.type')"
        class="app-select flex-1"
        style="min-width: 140px"
        outlined dense
        emit-value
        map-options
        :popup-content-class="'app-menu'"
      />
      <q-select
        v-model="filters.status"
        :options="statusOptions"
        :label="t('filters.status')"
        class="app-select flex-1"
        style="min-width: 160px"
        outlined dense
        emit-value
        map-options
        :popup-content-class="'app-menu'"
      />
      <q-select
        v-model="filters.sort"
        :options="sortOptions"
        :label="t('filters.sort')"
        class="app-select flex-1"
        style="min-width: 160px"
        outlined dense
        emit-value
        map-options
        :popup-content-class="'app-menu'"
      />
      <q-btn
        class="app-btn-ghost"
        icon="restart_alt"
        :label="t('filters.reset')"
        flat unelevated
        @click="reset"
      />
    </div>

    <!-- Genre chips -->
    <div class="chip-row">
      <q-chip
        class="app-chip cursor-pointer"
        :class="{ 'app-chip--active': !filters.genre }"
        :label="t('filters.all')"
        clickable
        @click="filters.genre = null"
      />
      <q-chip
        v-for="g in GENRES"
        :key="g"
        class="app-chip cursor-pointer"
        :class="{ 'app-chip--active': filters.genre === g }"
        :label="g"
        clickable
        @click="filters.genre = g"
      />
    </div>

    <!-- Results -->
    <div v-if="filtered.length" class="anime-grid stagger" :key="gridKey">
      <AnimeCard v-for="a in filtered" :key="a.id" :anime="a" />
    </div>
    <div v-else class="empty-state">
      <q-icon name="search_off" />
      <h3>{{ t('empty.nothing') }}</h3>
      <p>{{ t('empty.nothing_sub') }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, reactive, watch, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRoute } from 'vue-router';
import AnimeCard from 'components/AnimeCard.vue';
import { animeList, GENRES } from 'src/composables/useAnime';

const { t } = useI18n();
const route = useRoute();

const filters = reactive({
  genre: (route.query.genre as string) || null as string | null,
  type: null as string | null,
  status: null as string | null,
  sort: 'rating' as 'rating' | 'newest' | 'popular',
  q: (route.query.q as string) || '',
});

watch(() => route.query, (q) => {
  if (q.genre && q.genre !== filters.genre) filters.genre = q.genre as string;
  if (typeof q.q === 'string') filters.q = q.q;
});

const genreOptions = computed(() => [
  { label: t('filters.all'), value: null },
  ...GENRES.map((g) => ({ label: g, value: g })),
]);
const typeOptions = computed(() => [
  { label: t('filters.all'), value: null },
  { label: 'TV',    value: 'TV' },
  { label: 'Movie', value: 'Movie' },
  { label: 'OVA',   value: 'OVA' },
]);
const statusOptions = computed(() => [
  { label: t('filters.all'),       value: null },
  { label: t('filters.ongoing'),   value: 'ongoing' },
  { label: t('filters.completed'), value: 'completed' },
]);
const sortOptions = computed(() => [
  { label: t('filters.sort_rating'),  value: 'rating' },
  { label: t('filters.sort_newest'),  value: 'newest' },
  { label: t('filters.sort_popular'), value: 'popular' },
]);

const filtered = computed(() => {
  let res = animeList.value.slice();
  if (filters.genre)  res = res.filter((a) => a.genres.includes(filters.genre!));
  if (filters.type)   res = res.filter((a) => a.type === filters.type);
  if (filters.status) res = res.filter((a) => a.status === filters.status);
  if (filters.q) {
    const q = filters.q.toLowerCase();
    res = res.filter((a) =>
      a.title.toLowerCase().includes(q) ||
      a.studio.toLowerCase().includes(q) ||
      a.genres.some((g) => g.toLowerCase().includes(q))
    );
  }
  if (filters.sort === 'rating') res.sort((a, b) => b.rating - a.rating);
  if (filters.sort === 'newest') res.sort((a, b) => b.year - a.year);
  return res;
});

const gridKey = ref(0);
watch(filters, () => { gridKey.value++; }, { deep: true });

function reset() {
  filters.genre = null;
  filters.type = null;
  filters.status = null;
  filters.sort = 'rating';
  filters.q = '';
}
</script>
