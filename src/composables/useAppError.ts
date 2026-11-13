import { ref } from 'vue'

export interface AppError {
  statusCode?: number
  statusMessage?: string
  message?: string
  stack?: string
}

// The error currently shown in place of the page (null: the page renders normally)
const error = ref<AppError | null>(null)

export function useAppError() {
  /**
   * Replaces the current page with the error view.
   */
  function showError(value: unknown) {
    if (value instanceof Error) {
      error.value = { statusCode: 500, message: value.message, stack: value.stack }
    }
    else {
      error.value = { statusCode: 500, message: String(value) }
    }
  }

  /**
   * Dismisses the error view: the current route renders again.
   */
  function clearError() {
    error.value = null
  }

  return {
    error,
    showError,
    clearError,
  }
}
