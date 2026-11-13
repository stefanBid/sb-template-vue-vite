<script setup lang="ts">
import { computed, nextTick, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'

import TheFooter from '@/components/the-footer/TheFooter.vue'
import TheHeader from '@/components/the-header/TheHeader.vue'
import TheNotificationBanner from '@/components/the-notification/TheNotificationBanner.vue'
import TheNotificationBox from '@/components/the-notification/TheNotificationBox.vue'
import { useAppNotifications } from '@/composables/useAppNotifications'
import { appConfig } from '@/config/app'
import type { AppLocale } from '@/i18n'
import IconFlagpackGbUkm from '~icons/flagpack/gb-ukm'
import IconFlagpackIt from '~icons/flagpack/it'
import IconLucideJoystick from '~icons/lucide/joystick'

// Dependencies
const { t, locale } = useI18n()
const { notifications, removeNotification, info } = useAppNotifications()

// Data
const routes = computed<Array<RouteItem>>(() => [
  { name: t('nav.sections.actions'), path: '/#buttons', sectionIds: ['buttons', 'badges'] },
  { name: t('nav.sections.content'), path: '/#cards', sectionIds: ['cards', 'accordion'] },
  { name: t('nav.sections.form'), path: '/#form', sectionIds: ['form'] },
  { name: t('nav.sections.overlays'), path: '/#dialog', sectionIds: ['dialog', 'components'] },
  { name: t('nav.sections.system'), path: '/#i18n', sectionIds: ['i18n', 'responsive'] },
])

// One entry per locale in SUPPORTED_LOCALES (src/i18n/index.ts)
const langs: Array<MenuItem> = [
  { code: 'en', label: 'English', icon: IconFlagpackGbUkm },
  { code: 'it', label: 'Italiano', icon: IconFlagpackIt },
]

// Events

const onChangeLang = (langCode: string) => {
  locale.value = langCode as AppLocale
}

const onCloseNotification = (id: string) => {
  removeNotification(id)
}

onMounted(() => {
  nextTick(() => {
    info({
      title: t('ui.welcome-title'),
      message: t('ui.welcome-message'),
      icon: IconLucideJoystick,
      autoClose: true,
      dismissible: true,
      duration: 10000,
    })
  })
})
</script>

<template>
  <div>
    <TheHeader
      :langs="langs"
      :routes="routes"
      :selected-lang-id="locale"
      @change-lang="langCode => onChangeLang(langCode)"
    />
    <main class="pt-16 px-6 md:px-10 sb-transition">
      <div class="w-full max-w-350 mx-auto sb-transition">
        <slot />
      </div>
    </main>
    <TheFooter
      :email="appConfig.social.email"
      :github-url="appConfig.social.githubUrl"
      :instagram-url="appConfig.social.instagramUrl"
      :linkedin-url="appConfig.social.linkedinUrl"
      :phone="appConfig.social.phone"
      :quick-links="routes"
    />
    <TheNotificationBox>
      <transition-group class="flex flex-col gap-3" name="slide-down" tag="div">
        <TheNotificationBanner
          v-for="notification in notifications"
          :key="notification.id"
          :auto-close="notification.autoClose"
          :dismissible="notification.dismissible"
          :duration="notification.duration"
          :icon="notification.icon"
          :message="notification.message"
          :title="notification.title"
          :type="notification.type"
          @close="onCloseNotification(notification.id)"
        />
      </transition-group>
    </TheNotificationBox>
  </div>
</template>
