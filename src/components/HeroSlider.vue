<template>
  <section class="hero fade-in">
    <div
      v-for="(item, idx) in items"
      :key="item.id"
      class="hero__slide"
      :class="{ 'is-active': idx === active }"
    >
      <div class="hero__bg" :style="{ backgroundImage: `url(${item.banner})` }" />
      <div class="hero__veil" />

      <div class="hero__content">
        <span class="hero__tag">
          <q-icon name="auto_awesome" size="14px" /> {{ t('hero.featured') }}
        </span>
        <h1>{{ item.title }}</h1>
        <div class="hero__meta">
          <span><q-icon name="star" />{{ item.rating.toFixed(1) }}</span>
          <span><q-icon name="calendar_today" size="16px" />{{ item.year }}</span>
          <span><q-icon name="movie" size="16px" />{{ item.type }}</span>
          <span><q-icon name="schedule" size="16px" />{{ item.episodes }} ep</span>
        </div>
        <p class="hero__desc">{{ item.synopsis }}</p>
        <div class="hero__cta">
          <q-btn
            class="app-btn-primary"
            icon="play_arrow"
            :label="t('hero.watch_now')"
            unelevated
            @click="goWatch(item.id)"
          />
          <q-btn
            class="app-btn-ghost"
            icon="add"
            :label="t('hero.add_list')"
            unelevated
            @click="toggle(item.id)"
          />
        </div>
      </div>
    </div>

    <div class="hero__dots">
      <button
        v-for="(_, idx) in items"
        :key="idx"
        :class="{ 'is-active': idx === active }"
        @click="active = idx"
      />
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';
import { useFavorites, type Anime } from 'src/composables/useAnime';

const props = defineProps<{ items: Anime[] }>();
const { t } = useI18n();
const router = useRouter();
const { toggle } = useFavorites();

const active = ref(0);
let timer: number | undefined;

function next() {
  active.value = (active.value + 1) % props.items.length;
}
function goWatch(id: string) {
  router.push({ name: 'watch', params: { id } });
}

onMounted(() => { timer = window.setInterval(next, 6000); });
onBeforeUnmount(() => { if (timer) clearInterval(timer); });
</script>
