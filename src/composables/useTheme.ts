import { ref, watch } from 'vue';

export type ThemeMode = 'light' | 'dark';

const STORAGE_KEY = 'app-theme';

function readInitial(): ThemeMode {
  if (typeof window === 'undefined') return 'dark';
  const saved = localStorage.getItem(STORAGE_KEY) as ThemeMode | null;
  if (saved === 'light' || saved === 'dark') return saved;
  return window.matchMedia?.('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
}

const theme = ref<ThemeMode>(readInitial());

function apply(mode: ThemeMode) {
  if (typeof document === 'undefined') return;
  document.documentElement.setAttribute('data-theme', mode);
}

apply(theme.value);
watch(theme, (v) => {
  apply(v);
  localStorage.setItem(STORAGE_KEY, v);
});

export function useTheme() {
  function toggle() {
    theme.value = theme.value === 'dark' ? 'light' : 'dark';
  }
  function set(mode: ThemeMode) {
    theme.value = mode;
  }
  return { theme, toggle, set };
}
