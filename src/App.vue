<script setup lang="ts">
import { useTitle } from '@vueuse/core'
import { computed, watchEffect } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute } from 'vue-router'

import { useAppError } from '@/composables/useAppError'
import { usePageTransition } from '@/composables/usePageTransition'
import { appConfig } from '@/config/app'
import DefaultLayout from '@/layouts/DefaultLayout.vue'
import ErrorView from '@/views/ErrorView.vue'

// Dependencies
const { t } = useI18n()
const route = useRoute()
const { pageTransition } = usePageTransition()
const { error } = useAppError()

// Data
const layouts = {
  default: DefaultLayout,
}

const layout = computed(() => {
  const name = route.meta.layout ?? 'default'
  return name === false ? null : layouts[name]
})

// Document title and description follow the route meta and the current locale
const title = computed(() => route.meta.titleKey ? t(route.meta.titleKey) : appConfig.site.name)
useTitle(title, { titleTemplate: appConfig.site.titleTemplate })

watchEffect(() => {
  const description = route.meta.descriptionKey ? t(route.meta.descriptionKey) : ''
  document.querySelector('meta[name="description"]')?.setAttribute('content', description)
})
</script>

<template>
  <ErrorView v-if="error" :error="error" />
  <RouterView v-else v-slot="{ Component, route: viewRoute }">
    <component :is="layout ?? 'div'">
      <Transition
        :css="pageTransition.css"
        :mode="pageTransition.mode"
        :name="pageTransition.name"
      >
        <component :is="Component" :key="viewRoute.path" />
      </Transition>
    </component>
  </RouterView>
</template>
