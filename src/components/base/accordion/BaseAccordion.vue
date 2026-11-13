<script setup lang="ts">
import { computed, ref } from 'vue'
import type { Component } from 'vue'

import IconLucideChevronDown from '~icons/lucide/chevron-down'

interface BaseAccordionProps {
  id: string
  title: string
  icon?: Component
  isOpen?: boolean
  defaultOpen?: boolean
}

// Input / Output
const props = withDefaults(defineProps<BaseAccordionProps>(), {
  isOpen: undefined,
  defaultOpen: false,
  icon: undefined,
})

const emit = defineEmits<{
  (e: 'toggle'): void
}>()

// State
const buttonId = computed(() => `${props.id}-button`)
const panelId = computed(() => `${props.id}-panel`)
const internalOpen = ref(props.defaultOpen)
const open = computed(() => props.isOpen !== undefined ? props.isOpen : internalOpen.value)

// Events
const onToggle = () => {
  if (props.isOpen !== undefined) {
    emit('toggle')
  }
  else {
    internalOpen.value = !internalOpen.value
  }
}
</script>

<template>
  <div
    class="border border-border rounded-md bg-surface overflow-hidden shadow-sm sb-transition hover:shadow-md sb-focus-within"
    :data-accordion-id="props.id"
  >
    <!-- Header -->
    <h3 class="sb-h4 text-ink">
      <button
        :id="buttonId"
        :aria-controls="panelId"
        :aria-expanded="open ? 'true' : 'false'"
        class="w-full p-4 md:p-6 cursor-pointer flex items-center gap-4 md:gap-6 text-left sb-transition sb-no-focus"
        :class="{
          'bg-surface-2': open,
          'bg-surface hover:bg-surface-2': !open,
        }"
        type="button"
        @click="onToggle"
      >
        <!-- Icon Box -->
        <span
          v-if="props.icon"
          class="shrink-0 size-12 md:size-14 rounded-sm bg-primary-soft flex items-center justify-center sb-transition"
        >
          <component
            :is="props.icon"
            class="size-6 md:size-7 text-primary sb-transition"
          />
        </span>

        <!-- Content -->
        <span class="flex-1 min-w-0 sb-transition">
          {{ props.title }}
        </span>

        <!-- Chevron -->
        <IconLucideChevronDown
          class="shrink-0 size-5 md:size-6 text-primary sb-transition"
          :class="{
            'rotate-180': open,
          }"
        />
      </button>
    </h3>

    <!-- Content -->
    <transition name="slide-down">
      <div
        v-if="open"
        :id="panelId"
        :aria-labelledby="buttonId"
        class="p-6 md:p-8 border-t border-border"
        role="region"
      >
        <div class="text-ink-muted sb-transition">
          <slot />
        </div>
      </div>
    </transition>
  </div>
</template>
