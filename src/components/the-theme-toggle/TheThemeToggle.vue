<script setup lang="ts">
import { useI18n } from 'vue-i18n'

import BaseIconButton from '@/components/base/icon-button/BaseIconButton.vue'
import { useAppColorMode } from '@/composables/useAppColorMode'
import IconLucideMoon from '~icons/lucide/moon'
import IconLucideSun from '~icons/lucide/sun'

// Dependencies
const { t } = useI18n()
const { isDark, toggle } = useAppColorMode()
</script>

<template>
  <BaseIconButton
    :aria-label="t('ui.toggle-theme')"
    :icon="isDark ? IconLucideMoon : IconLucideSun"
    @click="toggle"
  />
</template>
