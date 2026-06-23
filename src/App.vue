<template>
  <router-view />

  <Notivue v-slot="item" class="notivue-override">
    <NotivueSwipe :item="item">
      <Notification class="notification-content" :item="item" :theme="lightTheme" :icons="filledIcons" />
    </NotivueSwipe>
  </Notivue>
</template>

<script setup lang="ts">
import { Notivue, Notification, NotivueSwipe, lightTheme, filledIcons } from 'notivue';
// boot theme once at app start so SSR/CSR are consistent
import 'src/composables/useTheme';
</script>

<style lang="scss">
.notivue-override { z-index: 99999 !important; }
</style>
