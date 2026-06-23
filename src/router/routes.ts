import type { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '',                name: 'home',          component: () => import('pages/HomePage.vue') },
      { path: 'browse',          name: 'browse',        component: () => import('pages/BrowsePage.vue') },
      { path: 'favorites',       name: 'favorites',     component: () => import('pages/FavoritesPage.vue') },
      { path: 'history',         name: 'history',       component: () => import('pages/HistoryPage.vue') },
      { path: 'anime/:id',       name: 'anime-detail',  component: () => import('pages/AnimeDetailPage.vue') },
      { path: 'watch/:id',       name: 'watch',         component: () => import('pages/WatchPage.vue') },
    ],
  },
  {
    path: '/:catchAll(.*)*',
    redirect: { name: 'home' },
  },
];

export default routes;
