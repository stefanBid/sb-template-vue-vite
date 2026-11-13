import { useColorMode } from '@vueuse/core'
import { computed } from 'vue'

/**
 * Light / dark theme, written as data-theme on <html> and persisted in localStorage.
 * "auto" follows the system preference. The inline script in index.html applies the
 * same key before the app mounts, so the first paint already has the right theme.
 * https://vueuse.org/core/useColorMode/
 */
export function useAppColorMode() {
  const mode = useColorMode({
    attribute: 'data-theme',
    storageKey: 'sb-color-mode',
    initialValue: 'auto',
  })

  // Resolved theme actually on screen ("auto" already turned into light or dark)
  const isDark = computed(() => mode.state.value === 'dark')

  function toggle() {
    mode.value = isDark.value ? 'light' : 'dark'
  }

  return {
    mode,
    isDark,
    toggle,
  }
}
