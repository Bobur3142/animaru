import { computed } from 'vue';
import { useI18n } from 'vue-i18n';

const STORAGE_KEY = 'locale';

export const SUPPORTED_LOCALES = [
  { code: 'uz', label: "O'zbek", flag: '🇺🇿' },
  { code: 'ru', label: 'Русский', flag: '🇷🇺' },
  { code: 'en', label: 'English', flag: '🇬🇧' },
] as const;

export type LocaleCode = typeof SUPPORTED_LOCALES[number]['code'];

export function useLocale() {
  const { locale } = useI18n();

  const current = computed(() =>
    SUPPORTED_LOCALES.find((l) => l.code === locale.value) ?? SUPPORTED_LOCALES[0]
  );

  function setLocale(code: LocaleCode) {
    locale.value = code;
    localStorage.setItem(STORAGE_KEY, code);
  }

  return { locale, current, setLocale, options: SUPPORTED_LOCALES };
}
