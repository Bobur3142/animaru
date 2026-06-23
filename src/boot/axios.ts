import axios, { type AxiosInstance } from 'axios';
import { boot } from "quasar/wrappers";
import { base_lang, url_http } from "boot/constants";
import { piniaState } from "stores/piniaState";
import { push } from "notivue";
import { piniaActions } from "stores/piniaActions";
import { i18n } from "src/boot/i18n";

declare module 'vue' {
  interface ComponentCustomProperties {
    $axios: AxiosInstance;
    $api: AxiosInstance;
  }
}

const api = axios.create();
let $axios = axios;

let is401Handled = false;
let catchedNetworkError = false;

export default boot(({ app, router }) => {  // router берём ТОЛЬКО отсюда
  axios.defaults.timeout = url_http.BASE_TIMEOUT;
  axios.defaults.withCredentials = true;
  axios.defaults.baseURL = url_http.BASE_URL;

  axios.interceptors.response.use(
    (response) => response,
    async (error) => {
      if (error.response?.data instanceof ArrayBuffer) {
        try {
        } catch (e) {
          console.error(e);
        }
      }

      if (error.code === 'ERR_NETWORK') {
        if (catchedNetworkError) return Promise.reject();
        catchedNetworkError = true;
        setTimeout(() => { catchedNetworkError = false }, 3000);

        return Promise.reject({
          type: "warning",
          errorCode: 401,
          errorDescription: "",
          errorMessage: i18n.global.t('system.noInternetConnection'),
        });
      }

      if (error.response?.status === 401) {
        if (!is401Handled) {
          is401Handled = true;

          piniaActions().clearUserSession();

          // Ждём следующего тика чтобы стор успел очиститься
          await Promise.resolve();

          try {
            await router.replace({ name: 'login' });
          } catch (e) {
            // NavigationDuplicated — игнорируем
          } finally {
            is401Handled = false; // сбрасываем флаг после навигации
          }
        }
        return Promise.reject(error);
      }

      if (error.response?.data) {
        const errorData = error.response.data as { ERROR?: { message: string; description?: string } };
        if (!errorData?.ERROR) return Promise.reject(error);
        if (errorData.ERROR?.message || errorData.ERROR?.description) {
          push.error({
            title: errorData.ERROR?.message || "",
            message: errorData.ERROR?.description || "",
          });
        }
      }

      return Promise.reject(error);
    }
  );

  axios.interceptors.request.use(
    (request) => {
      const auth = piniaState().auth;
      if (auth !== null) {
        request.headers.Authorization = `Bearer ${auth.token}`;
      }
      request.headers["Accept-Language"] = localStorage.getItem("eco_lang") || base_lang.code;
      return request;
    },
    (error) => Promise.reject(error)
  );

  app.config.globalProperties.$axios = axios;
  app.config.globalProperties.$api = api;
  $axios = axios;
});

export { api, $axios, axios };
