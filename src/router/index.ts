import { createRouter, createWebHistory } from 'vue-router'

import { useAppError } from '@/composables/useAppError'
import { usePageTransition } from '@/composables/usePageTransition'
import ErrorView from '@/views/ErrorView.vue'
import HomeView from '@/views/HomeView.vue'

// https://router.vuejs.org/guide/advanced/meta.html#TypeScript
declare module 'vue-router' {
  interface RouteMeta {
    /** Layout wrapping the page; false renders the page alone. Defaults to 'default'. */
    layout?: 'default' | false
    /** i18n key of the document title (combined with appConfig.site.titleTemplate) */
    titleKey?: string
    /** i18n key of the meta description */
    descriptionKey?: string
  }
}

export const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
      meta: { titleKey: 'meta.home.title', descriptionKey: 'meta.home.description' },
    },
    // Every other page is lazy-loaded: () => import('@/views/AboutView.vue')
    {
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      // Static: App.vue renders the same view for uncaught errors
      component: ErrorView,
      props: { error: { statusCode: 404 } },
      meta: { layout: false },
    },
  ],
  scrollBehavior(to, _from, savedPosition) {
    if (to.hash) {
      return { el: to.hash, behavior: 'smooth' }
    }
    if (savedPosition) {
      return savedPosition
    }
    return { top: 0 }
  },
})

// Same page with different params (e.g. /blog/a → /blog/b): swap the content without the page transition
router.beforeEach((to, from) => {
  const { pageSkipTransition } = usePageTransition()
  pageSkipTransition.value = from.matched.length > 0 && to.matched[0]?.name === from.matched[0]?.name
})

// A lazy page that fails to load (network error, stale deploy) shows the error view instead of a blank page
router.onError((err) => {
  useAppError().showError(err)
})
