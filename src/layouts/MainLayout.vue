<template>
  <div class="app-shell">
    <!-- ─── Sidebar ─── -->
    <aside class="app-sidebar">
      <router-link to="/" class="app-brand">
        <div class="app-brand__mark">A</div>
        <div class="app-brand__text">{{ t('app_name') }}</div>
      </router-link>

      <div class="nav-section-title">{{ t('sections.menu') }}</div>
      <div
        v-for="link in primaryLinks"
        :key="link.name"
        class="nav-link"
        :class="{ 'is-active': isActive(link.name) }"
        @click="$router.push({ name: link.name })"
      >
        <q-icon :name="link.icon" />
        <span>{{ t(link.label) }}</span>
      </div>

      <div class="nav-section-title">{{ t('sections.library') }}</div>
      <div
        v-for="link in libraryLinks"
        :key="link.name"
        class="nav-link"
        :class="{ 'is-active': isActive(link.name) }"
        @click="$router.push({ name: link.name })"
      >
        <q-icon :name="link.icon" />
        <span>{{ t(link.label) }}</span>
      </div>

      <div class="nav-section-title">{{ t('sections.genres') }}</div>
      <div
        v-for="g in topGenres"
        :key="g"
        class="nav-link"
        @click="$router.push({ name: 'browse', query: { genre: g } })"
      >
        <q-icon name="local_fire_department" />
        <span>{{ g }}</span>
      </div>
    </aside>

    <!-- ─── Main column ─── -->
    <div class="min-w-0">
      <!-- Topbar -->
      <header class="app-topbar">
        <q-input
          v-model="searchQuery"
          class="app-search flex-1 max-w-xl"
          :placeholder="t('search.placeholder')"
          dense
          borderless
          @keyup.enter="submitSearch"
        >
          <template #prepend>
            <q-icon name="search" />
          </template>
          <template v-if="searchQuery" #append>
            <q-icon name="close" class="cursor-pointer" @click="searchQuery = ''" />
          </template>
        </q-input>

        <div class="flex-1" />

        <!-- Language -->
        <q-btn class="app-icon-btn" flat unelevated>
          <span class="text-base">{{ current.flag }}</span>
          <q-menu class="app-menu" :offset="[0, 8]" anchor="bottom right" self="top right">
            <q-list style="min-width: 180px">
              <q-item
                v-for="opt in options"
                :key="opt.code"
                v-close-popup
                clickable
                :active="opt.code === locale"
                @click="setLocale(opt.code)"
              >
                <q-item-section avatar style="min-width: 30px">
                  <span class="text-lg">{{ opt.flag }}</span>
                </q-item-section>
                <q-item-section>{{ opt.label }}</q-item-section>
                <q-item-section v-if="opt.code === locale" side>
                  <q-icon name="check" color="primary" />
                </q-item-section>
              </q-item>
            </q-list>
          </q-menu>
        </q-btn>

        <!-- Theme toggle -->
        <q-btn class="app-icon-btn" flat unelevated @click="toggle">
          <q-icon :name="theme === 'dark' ? 'light_mode' : 'dark_mode'" />
          <q-tooltip class="bg-grey-9">
            {{ theme === 'dark' ? t('theme.light') : t('theme.dark') }}
          </q-tooltip>
        </q-btn>

        <!-- Notifications -->
        <q-btn class="app-icon-btn" flat unelevated>
          <q-icon name="notifications_none" />
        </q-btn>

        <!-- Avatar -->
        <div
          class="w-11 h-11 rounded-xl flex items-center justify-center text-white font-bold cursor-pointer"
          style="background: linear-gradient(135deg, var(--brand), var(--accent));"
        >
          S
        </div>
      </header>

      <!-- Page content -->
      <main class="app-main">
        <router-view v-slot="{ Component }">
          <transition name="page" mode="out-in">
            <component :is="Component" />
          </transition>
        </router-view>
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRoute, useRouter } from 'vue-router';
import { useTheme } from 'src/composables/useTheme';
import { useLocale } from 'src/composables/useLocale';

const { t } = useI18n();
const route = useRoute();
const router = useRouter();
const { theme, toggle } = useTheme();
const { locale, current, setLocale, options } = useLocale();

const searchQuery = ref('');

const primaryLinks = [
  { name: 'home',      icon: 'explore',         label: 'nav.discover'  },
  { name: 'browse',    icon: 'grid_view',       label: 'nav.browse'    },
  { name: 'history',   icon: 'history',         label: 'nav.history'   },
];
const libraryLinks = [
  { name: 'favorites', icon: 'favorite_border', label: 'nav.favorites' },
];
const topGenres = ['Action', 'Romance', 'Sci-Fi', 'Fantasy', 'Comedy'];

function isActive(name: string) { return route.name === name; }
function submitSearch() {
  router.push({ name: 'browse', query: { q: searchQuery.value } });
}
</script>

<style scoped>
.page-enter-active, .page-leave-active { transition: opacity .25s ease, transform .25s ease; }
.page-enter-from { opacity: 0; transform: translateY(8px); }
.page-leave-to { opacity: 0; transform: translateY(-8px); }
</style>
