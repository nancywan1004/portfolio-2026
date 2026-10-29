<script setup lang="ts">
defineProps<{ variant: number }>()
</script>
<template>
  <div class="project-artwork" :class="'artwork-' + variant">
    <svg viewBox="0 0 420 320" fill="none" aria-hidden="true">
      <g v-if="variant === 1" stroke="currentColor" stroke-width=".8" transform="translate(210 160)"><ellipse v-for="i in 5" :key="i" rx="139" :ry="35 + i * 13" :transform="`rotate(${i * 34})`"/><circle r="17" fill="var(--art-bg)"/></g>
      <g v-else-if="variant === 2" stroke="currentColor" stroke-width=".7" transform="translate(210 160)"><rect v-for="i in 12" :key="i" :x="-78 - i * 2" :y="-78 - i * 2" :width="156 + i * 4" :height="156 + i * 4" :transform="`rotate(${i * 5.5})`"/></g>
      <g v-else-if="variant === 3" stroke="currentColor" stroke-width=".65"><path v-for="i in 20" :key="i" :d="`M 25 ${70+i*8} C 130 ${-70+i*15}, 260 ${390-i*12}, 395 ${85+i*7}`"/></g>
      <g v-else-if="variant === 4" stroke="currentColor" stroke-width=".55" transform="translate(210 160)"><line v-for="i in 36" :key="i" x1="0" y1="0" x2="150" y2="0" :transform="`rotate(${i * 10})`"/><circle r="97"/><circle r="54"/></g>
      <g v-else-if="variant === 5" stroke="currentColor" stroke-width=".7" transform="translate(210 160)"><circle v-for="i in 9" :key="i" :r="13 + i * 15" :cx="i % 2 ? -7 : 7" cy="0" :transform="`rotate(${i * 6})`"/><circle r="6" fill="currentColor" stroke="none"/></g>
      <g v-else-if="variant === 6" stroke="currentColor" stroke-width=".5" transform="translate(210 160)"><path v-for="i in 18" :key="i" :d="`M -152 ${-119 + i * 14} L 152 ${-119 + i * 14}`" :transform="`rotate(${i * 10})`"/></g>
      <g v-else stroke="currentColor" stroke-width=".7"><circle v-for="i in 96" :key="i" :cx="210 + Math.cos(i * .52) * (5 + i * 1.65)" :cy="160 + Math.sin(i * .52) * (5 + i * 1.65)" :r="1.05" fill="currentColor" stroke="none"/><circle cx="210" cy="160" r="15"/></g>
    </svg>
  </div>
</template>
