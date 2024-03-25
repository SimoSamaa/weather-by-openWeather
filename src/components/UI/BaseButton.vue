<template>
  <button
    class="bg-btn h-[44px] w-full flex gap-2 font-semibold text-lg items-center justify-center rounded-full capitalize transition-all duration-300 ease-out"
    :class="mode"
  >
    <slot></slot>
  </button>
</template>

<script setup>
defineProps({
  mode: {
    type: String,
    required: false,
    default: 'base-style'
  }
});
</script>

<style scoped>
.base-style {
  @apply w-full;
}

.full-rounded-style {
  @apply size-[44px];
}
</style>