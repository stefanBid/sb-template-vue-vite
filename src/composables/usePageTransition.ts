import { computed, ref } from 'vue'

// Set by the router before each navigation: true when only the params of the same page change
const pageSkipTransition = ref(false)

const pageTransition = computed(() => (
  pageSkipTransition.value
    ? { name: 'page', mode: 'out-in' as const, css: false }
    : { name: 'page', mode: 'out-in' as const, css: true }
))

export function usePageTransition() {
  return {
    pageSkipTransition,
    pageTransition,
  }
}
