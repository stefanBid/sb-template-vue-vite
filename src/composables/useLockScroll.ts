import { computed, ref, watch } from 'vue'

import { generateUuid } from '@/utils/generateUuid'

const SCROLL_LOCK_CLASS = 'app-scroll-locked'

// Shared across every caller: the page stays locked while at least one owner holds the lock
const _owners = ref<string[]>([])
const isLocked = computed(() => _owners.value.length > 0)

// Apply / remove the class on <html>
watch(isLocked, (value) => {
  document.documentElement.classList.toggle(SCROLL_LOCK_CLASS, value)
})

export function useLockScroll() {
  // Internal State
  let _ownerId: string | null = null

  function _ensureOwnerId() {
    if (!_ownerId) {
      _ownerId = generateUuid()
    }
    return _ownerId
  }

  /**
   * Locks the scroll for the current owner instance.
   */
  function lock() {
    const id = _ensureOwnerId()

    // avoid duplicates if lock() is called multiple times by the same owner
    if (!_owners.value.includes(id)) {
      _owners.value = [..._owners.value, id]
    }
  }

  /**
   * Unlocks the scroll for the current owner instance.
   */
  function unlock() {
    if (!_ownerId) {
      return
    }

    if (_owners.value.includes(_ownerId)) {
      _owners.value = _owners.value.filter(id => id !== _ownerId)
    }
  }

  return {
    isLocked,
    lock,
    unlock,
  }
}
