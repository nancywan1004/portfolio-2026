<script setup lang="ts">
const props = defineProps<{
  id: string
  number: string
  title: string
  description: string
  cover: string
  coverAlt: string
  base?: string
  group?: string
}>()

const routeBase = props.base ?? '#work/universe'
const groupName = props.group ?? 'universe-technical-chapters'

function rememberChapter(event: Event) {
  const chapter = event.currentTarget as HTMLDetailsElement
  const hash = `${routeBase}/${props.id}`
  const isCurrentChapter = location.hash === hash || location.hash.startsWith(hash + '/')
  if (chapter.open) {
    if (!isCurrentChapter) history.replaceState(history.state, '', hash)
    requestAnimationFrame(() => {
      const target = routeBase === '#work/universe' && location.hash === '#work/universe/shader/ownership' ? document.getElementById('shader-ownership') : chapter
      target?.scrollIntoView({ block: 'start', behavior: 'instant' })
    })
  } else if (isCurrentChapter) {
    history.replaceState(history.state, '', routeBase)
    requestAnimationFrame(() => {
      if (!chapter.parentElement?.querySelector('.case-chapter[open]')) {
        chapter.parentElement?.scrollIntoView({ block: 'start', behavior: 'instant' })
      }
    })
  }
}
</script>

<template>
  <details :id="id" class="case-chapter" :name="groupName" tabindex="-1" @toggle="rememberChapter">
    <summary class="chapter-summary">
      <span class="chapter-number">{{ number }}</span>
      <div class="chapter-overview"><h3>{{ title }}</h3><p>{{ description }}</p><span class="chapter-action"><span class="when-closed">展开案例</span><span class="when-open">收起案例</span></span></div>
      <img class="chapter-cover" :src="cover" :alt="coverAlt" loading="lazy" />
      <span class="chapter-toggle" aria-hidden="true"></span>
    </summary>
    <div class="chapter-content"><slot /></div>
  </details>
</template>

<style scoped>
.case-chapter{border-top:1px solid #b9b9af;scroll-margin-top:24px}
.case-chapter:last-child{border-bottom:1px solid #b9b9af}
.case-chapter:focus{outline:none}
.chapter-summary{display:grid;grid-template-columns:56px minmax(0,1fr) 176px 32px;gap:24px;align-items:center;padding:30px 0;cursor:pointer;list-style:none;transition:background .2s}
.chapter-summary::-webkit-details-marker{display:none}
.chapter-summary:focus-visible{outline:1px solid var(--ink);outline-offset:6px}
.chapter-summary:hover .chapter-action{color:var(--ink)}
.chapter-number{font-size:25px;align-self:start;padding-top:4px;color:#8c8d81;font-variant-numeric:tabular-nums}
.chapter-overview h3{font-size:clamp(19px,1.8vw,26px);line-height:1.4;letter-spacing:-.02em;font-weight:400;margin:0 0 10px}
.chapter-overview p{max-width:620px;font-size:15px;line-height:1.85;color:#6a6c61;margin:0}
.chapter-action{display:block;font-size:10px;color:#86877b;margin-top:16px;letter-spacing:.04em}
.chapter-cover{display:block;width:100%;aspect-ratio:16/10;object-fit:cover;filter:saturate(.5);transition:filter .2s}
.chapter-summary:hover .chapter-cover{filter:saturate(1)}
.chapter-toggle{position:relative;display:block;width:28px;height:28px}
.chapter-toggle:before,.chapter-toggle:after{content:'';position:absolute;background:#66695d;left:6px;right:6px;height:1px;top:14px}
.chapter-toggle:after{transform:rotate(90deg);transition:transform .2s}
.case-chapter[open]>.chapter-summary .chapter-toggle:after{transform:rotate(0)}
.when-open{display:none}
.case-chapter[open]>.chapter-summary .when-open{display:inline}
.case-chapter[open]>.chapter-summary .when-closed{display:none}
.case-chapter[open]>.chapter-summary{padding-bottom:30px;border-bottom:1px solid var(--rule)}
.chapter-content{padding:32px 0 45px}
@media(max-width:850px){.chapter-summary{grid-template-columns:40px minmax(0,1fr) 120px 24px;gap:18px}.chapter-number{font-size:23px}}
@media(max-width:600px){.chapter-summary{grid-template-columns:28px minmax(0,1fr) 24px;gap:12px;padding:25px 0}.chapter-cover{grid-column:2;grid-row:2;width:112px;aspect-ratio:16/9}.chapter-toggle{grid-column:3;grid-row:1;align-self:start;margin-top:2px}.chapter-number{font-size:20px;padding-top:3px}.chapter-overview h3{font-size:21px;margin-bottom:8px}.chapter-overview p{font-size:14px;line-height:1.85}.chapter-action{font-size:10px;margin-top:12px}.chapter-content{padding:25px 0 30px}.case-chapter[open]>.chapter-summary{padding-bottom:25px}}
@media(prefers-reduced-motion:reduce){.chapter-summary,.chapter-cover,.chapter-toggle:after{transition:none}}
</style>
