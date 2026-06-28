export const url_http = {
  BASE_URL:
    process.env.NODE_ENV === 'production' ? 'api/' : 'https://fund.uznature.uz/api',
  BASE_RESOURCE_URL:
    process.env.NODE_ENV === 'production' ? 'api' : 'http://localhost:8085/api',
  BASE_TIMEOUT: 10 * 60 * 1000,
  UPLOAD_TIMEOUT: 2 * 60 * 1000,
  EXCEL_TIMEOUT: 10 * 60 * 1000,

  // ← URL бэкенда Google Drive
  DRIVE_API: 'https://animaru-bekend.onrender.com',
};

export const base_lang = {
  code: 'ru',
  name: 'Русский',
};

export const urls = {};
