<template>
  <div class="section-head">
    <div>
      <h2 class="font-display">{{ title }}</h2>
      <p v-if="subtitle">{{ subtitle }}</p>
    </div>
    <a v-if="actionText" class="section-link" @click="$emit('action')">
      {{ actionText }} <q-icon name="arrow_forward" size="16px" />
    </a>
  </div>
</template>

<script setup lang="ts">
defineProps<{ title: string; subtitle?: string; actionText?: string }>();
defineEmits<{ (e: 'action'): void }>();
</script>
