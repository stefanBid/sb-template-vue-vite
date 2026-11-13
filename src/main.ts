import '@fontsource/poppins/600.css'
import '@fontsource/poppins/700.css'
import '@fontsource/inter/400.css'
import '@fontsource/inter/600.css'
import '@fontsource/inter/700.css'
import './assets/css/main.css'

import { createApp } from 'vue'

import App from './App.vue'
import { useAppError } from './composables/useAppError'
import { i18n } from './i18n'
import { router } from './router'

const app = createApp(App)

// Uncaught errors from components, hooks and watchers replace the page with the error view
app.config.errorHandler = (err) => {
  console.error(err)
  useAppError().showError(err)
}

app.use(i18n)
app.use(router)

// Mount once the first route is resolved, so the first render already has the right layout and meta
router.isReady().then(() => app.mount('#app'))
