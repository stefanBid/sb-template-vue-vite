<script setup lang="ts">
import type { Component } from 'vue'

interface BaseIconButtonProps {
  icon: Component
  ariaLabel?: string
  isActive?: boolean
  isDisabled?: boolean
}

// Input / Output
const props = withDefaults(defineProps<BaseIconButtonProps>(), {
  ariaLabel: undefined,
  isActive: false,
  isDisabled: false,
})

const emit = defineEmits<{
  (e: 'click'): void
}>()

// Events
const onClick = () => {
  emit('click')
}
</script>

<template>
  <button
    :aria-label="props.ariaLabel"
    class="group relative inline-flex items-center justify-center rounded-sm border border-border sb-transition sb-focus cursor-pointer disabled:cursor-not-allowed disabled:opacity-45 size-7 md:size-8 before:absolute before:-inset-2 md:before:-inset-1.5"
    :class="{
      'bg-surface-2': props.isActive,
      'bg-surface border hover:bg-surface-2': !props.isActive,
    }"
    :disabled="props.isDisabled"
    type="button"
    @click="onClick"
  >
    <component
      :is="props.icon"
      class="size-4.5 md:size-5"
      :class="{
        'text-ink': props.isActive,
        'text-ink-muted group-hover:text-ink': !props.isActive,
      }"
    />
  </button>
</template>
