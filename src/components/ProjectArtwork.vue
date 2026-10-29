<script setup lang="ts">
defineProps<{ variant: number }>()
</script>
<template>
  <div class="project-artwork" :class="'artwork-' + variant">
    <svg viewBox="0 0 420 320" fill="none" aria-hidden="true">
      <g v-if="variant === 1" stroke="currentColor" stroke-width=".8" transform="translate(210 160)"><ellipse v-for="i in 5" :key="i" rx="139" :ry="35 + i * 13" :transform="`rotate(${i * 34})`"/><circle r="17" fill="var(--art-bg)"/></g>
      <g v-else-if="variant === 2" stroke="currentColor" stroke-width=".7" transform="translate(210 160)"><rect v-for="i in 12" :key="i" :x="-78 - i * 2" :y="-78 - i * 2" :width="156 + i * 4" :height="156 + i * 4" :transform="`rotate(${i * 5.5})`"/></g>
      <g v-else stroke="currentColor" stroke-width=".65"><path v-for="i in 20" :key="i" :d="`M 25 ${70+i*8} C 130 ${-70+i*15}, 260 ${390-i*12}, 395 ${85+i*7}`"/></g>
    </svg>
  </div>
</template>
