import { defineBoot } from '#q-app/wrappers';
import { createI18n } from 'vue-i18n';

import messages from 'src/i18n';

export type MessageLanguages = keyof typeof messages;
export type MessageSchema = typeof messages['uz'];

declare module 'vue-i18n' {
  export interface DefineLocaleMessage extends MessageSchema {}
  export interface DefineDateTimeFormat {}
  export interface DefineNumberFormat {}
}

const saved = (typeof localStorage !== 'undefined' && localStorage.getItem('locale')) || 'uz';
const initial = (['uz', 'ru', 'en'] as const).includes(saved as any) ? saved : 'uz';

const i18n = createI18n<MessageSchema, MessageLanguages>({
  legacy: false,
  locale: initial as MessageLanguages,
  messages,
  globalInjection: true,
  fallbackLocale: 'en',
  warnHtmlInMessage: 'off',
  warnHtmlMessage: false,
});

export default defineBoot(({ app }) => {
  app.use(i18n);
});

export { i18n };
