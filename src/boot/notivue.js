import { boot } from 'quasar/wrappers'
import { createNotivue } from 'notivue'
import 'notivue/notifications.css'
import 'notivue/animations.css'
import 'notivue/notification-progress.css'

export default boot(({ app }) => {
  const notivue = createNotivue({
    theme: 'slate',
    showProgress: false,
    showTitle: true,
    position: 'top-center',
    limit: 1,
    enqueue: false,
    pauseOnHover: false,
    pauseOnFocusLoss: true,
    closeOnClick: true,
    clearOnSwipe: true,
    avoidDuplicates: true,
    animate: true,
    animationDuration: 300,
    animations: {
      enter: 'slide-in-top',
      leave: 'slide-out-top',
      clearAll: 'fade'
    },
    notifications: {
      global: {
        duration: 4000,
        title: true
      }
    }
  })

  app.use(notivue)
})
