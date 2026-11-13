import { computed, markRaw, ref } from 'vue'

import { generateUuid } from '@/utils/generateUuid'

interface NotificationState {
  notifications: NotificationItem[]
}

// Shared across every caller: one notification stack for the whole app
const _notificationState = ref<NotificationState>({
  notifications: [],
})

export function useAppNotifications() {
  function _addNotification(newNotification: Omit<NotificationItem, 'id'>): string {
    const id = generateUuid()
    _notificationState.value.notifications.push({
      ...newNotification,
      // Icon components are rendered, never observed: keep them out of the reactive state
      icon: newNotification.icon ? markRaw(newNotification.icon) : newNotification.icon,
      id,
    })
    return id
  }

  // State
  const notifications = computed(() => _notificationState.value.notifications)

  /**
   * Removes a notification by its id.
   * @param id Notification id to remove
   */
  function removeNotification(id: string) {
    const index = _notificationState.value.notifications.findIndex(n => n.id === id)
    if (index > -1) {
      _notificationState.value.notifications.splice(index, 1)
    }
  }

  /**
   * Clears all notifications from the state.
   */
  function clearNotifications() {
    _notificationState.value.notifications = []
  }

  /**
   * Adds a success notification.
   * @param newNotification Notification data without type and id
   * @returns The generated notification id
   */
  function success(newNotification: Omit<NotificationItem, 'type' | 'id'>) {
    return _addNotification({ ...newNotification, type: 'success' })
  }

  /**
   * Adds a warning notification.
   * @param newNotification Notification data without type and id
   * @returns The generated notification id
   */
  function warning(newNotification: Omit<NotificationItem, 'type' | 'id'>) {
    return _addNotification({ ...newNotification, type: 'warning' })
  }

  /**
   * Adds an error notification.
   * @param newNotification Notification data without type and id
   * @returns The generated notification id
   */
  function error(newNotification: Omit<NotificationItem, 'type' | 'id'>) {
    return _addNotification({ ...newNotification, type: 'error' })
  }

  /**
   * Adds an info notification.
   * @param newNotification Notification data without type and id
   * @returns The generated notification id
   */
  function info(newNotification: Omit<NotificationItem, 'type' | 'id'>) {
    return _addNotification({
      ...newNotification, type: 'info',
    })
  }

  return {
    notifications,
    removeNotification,
    clearNotifications,
    success,
    warning,
    error,
    info,
  }
}
