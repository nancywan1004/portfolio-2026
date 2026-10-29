<script setup lang="ts">
import { ref } from 'vue'

defineProps<{
  title: string
  description: string
  category: string
  platform: string
  url: string
  cover?: string
}>()
const imageFailed = ref(false)
</script>

<template>
  <a class="media-preview-card" :href="url" target="_blank" rel="noopener noreferrer" :aria-label="`${title}，前往${platform}观看（新窗口）`">
    <div class="media-preview-visual">
      <img v-if="cover && !imageFailed" :src="cover" :alt="title + '，原视频封面'" width="1440" height="1080" loading="lazy" decoding="async" @error="imageFailed = true">
      <div v-else class="media-preview-fallback"><span>{{ platform }}</span><strong>{{ category }}</strong><small>链接预览 · 暂无视频封面</small></div>
      <span class="media-platform">{{ platform }}</span>
      <span v-if="cover && !imageFailed" class="media-open-indicator" aria-hidden="true">↗</span>
      <span class="media-destination">前往{{ platform }}观看 ↗</span>
    </div>
    <div class="media-preview-copy"><p class="eyebrow">{{ category }}</p><h4>{{ title }}</h4><p>{{ description }}</p><span class="media-preview-source">{{ platform === '小红书' ? '超维视境 BeyondSight · 小红书' : '微信视频号 · 原始分享链接' }}</span></div>
  </a>
</template>
