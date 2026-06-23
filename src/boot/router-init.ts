import { piniaActions } from "src/stores/piniaActions";
import { piniaState } from 'src/stores/piniaState';

/*export default ({ router }: { router: any }) => {
  const publicPages = ['home', 'login'];

  router.beforeEach((to: any, from: any, next: any) => {
    const actions = piniaActions();
    const store = piniaState();
    const hasToken = !!store.user.token;

    if (hasToken) {
      actions.setAuthToken({
        token: store.user.token,
      });
    }

    // всегда можно открыть home
    if (to.name === 'home') {
      return next();
    }

    // защита приватных страниц
    if (!hasToken && !publicPages.includes(to.name)) {
      return next({ name: 'login' });
    }

    // если авторизован и идет на login
    if (hasToken && to.name === 'login') {
      return next({ name: 'cabinet' });
    }

    next();
  });

  return router;
};*/
