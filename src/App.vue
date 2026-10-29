<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import ArtScene from './components/ArtScene.vue'
import StarMark from './components/StarMark.vue'
import ProjectArtwork from './components/ProjectArtwork.vue'
import UniverseCase from './components/UniverseCase.vue'
import ExplorationCase from './components/ExplorationCase.vue'
import ScrollField from './components/ScrollField.vue'
import SideOrbit from './components/SideOrbit.vue'
import { projects, explorations, experience, education, profile, skills, resume, featureFlags } from './content'
import type { Project } from './content'
import { tilt as vTilt } from './directives/tilt'

type Page = 'home' | 'work' | 'background' | 'labs' | 'contact' | 'chat'
const pages: Page[] = ['home', 'work', 'background', 'labs', 'contact', 'chat']
const legacyPages: Record<string, Page> = { experience: 'background', about: 'background' }
function readPage(): Page {
  const hash = location.hash.slice(1).split('/')[0] ?? ''
  const mapped = legacyPages[hash] ?? hash
  if (!pages.includes(mapped as Page)) return 'home'
  if (mapped === 'chat' && !featureFlags.assistant) return 'home'
  return mapped as Page
}
const page = ref<Page>(readPage())
const previousScrollRestoration = history.scrollRestoration
history.scrollRestoration = 'manual'
const previousPage = ref<Page>('home')
const highlighted = ref(-1)
const paused = ref(false)
const art = ref<InstanceType<typeof ArtScene>>()
const orbitNav = ref<HTMLElement>()
const navHover = ref(false)
const title = ref<HTMLElement>()
const questionField = ref<HTMLInputElement>()
const messageList = ref<HTMLElement>()
const selectedProject = ref<string | null>(null)
const expandedExploration = ref<string | null>(null)
function toggleExploration(id: string) {
  expandedExploration.value = expandedExploration.value === id ? null : id
}
const activeSection = ref(0)
const assistantEnabled = featureFlags.assistant
const question = ref('')
const nav: { page: Page; label: string; subtitle: string }[] = [
  { page: 'work', label: '项目', subtitle: '工作项目与个人实践' },
  { page: 'background', label: '背景', subtitle: '经历、教育与技术栈' },
  { page: 'labs', label: '探索', subtitle: '新技术调研与测试记录' },
  { page: 'contact', label: '联系', subtitle: '联系方式与合作方向' },
]
const workProjects = computed(() => projects.map((project, index) => ({ project, index })).filter(entry => entry.project.kind === 'work'))
const personalProjects = computed(() => projects.map((project, index) => ({ project, index })).filter(entry => entry.project.kind === 'personal'))
const projectGroups = computed(() => [
  { key: 'work', label: '工作项目', note: '产品研发中的完整链路、技术方案与取舍。', entries: workProjects.value },
  { key: 'personal', label: '个人项目', note: '自主发起的图形实验与工具实践。', entries: personalProjects.value },
])
function statusLabel(project: Project, open: boolean) {
  if (project.id === '01') return open ? '完整案例 / 阅读中' : '查看完整案例 ↓'
  if (project.status === 'draft') return open ? '整理中 / 阅读中' : '案例整理中 ↓'
  return open ? '项目笔记 / 阅读中' : '项目笔记 ↓'
}
type Section = { id: string; label: string }
const sections = computed<Section[]>(() => {
  if (page.value === 'work') return projects.map(project => ({ id: `work-${project.id}`, label: project.title }))
  if (page.value === 'background') return [
    ...experience.map((item, index) => ({ id: `experience-${index}`, label: item.title })),
    { id: 'background-education', label: '教育背景' },
    { id: 'background-skills', label: '技术背景' },
  ]
  if (page.value === 'labs') return explorations.map((item, index) => ({ id: `labs-${index}`, label: item.title }))
  if (page.value === 'contact') return [{ id: 'contact-email', label: '邮箱' }, { id: 'contact-phone', label: '电话' }, { id: 'contact-github', label: 'GitHub' }, { id: 'contact-site', label: '个人网站' }]
  return []
})
const fieldKind = computed<'work' | 'background' | 'labs' | 'contact'>(() => page.value === 'work' || page.value === 'background' || page.value === 'labs' ? page.value : 'contact')
const copy = computed(() => ({
  background: { eyebrow: '02 / 背景', lines: ['个人经历'], description: '四年+三维与 XR 项目研发，近期聚焦 3DGS 渲染扩展与大场景优化。' },
  labs: { eyebrow: '03 / 技术探索', lines: ['新技术调研', '与测试记录'], description: '把正在调研与验证的技术方向整理成可复查的记录，保留测试条件与结论边界。' },
  contact: { eyebrow: '04 / 联系', lines: ['联系方式', '与合作方向'], description: '围绕实时三维、交互体验与创意开发，展开一次交流。' },
}[page.value as 'background' | 'labs' | 'contact']))
const messages = ref<{ id: number; role: 'assistant' | 'user'; text: string; link?: boolean }[]>([
  { id: 0, role: 'assistant', text: '你好，我是万乐琪作品集的导览助手。可以聊聊 Universe 的重光照、大场景 LOD、Shader 特效，或这份作品集的交互设计。' },
])
async function go(target: Page) {
  if (target === page.value) { window.scrollTo({ top: 0 }); return }
  if (target === 'chat') previousPage.value = page.value
  page.value = target; highlighted.value = -1; selectedProject.value = null; expandedExploration.value = null
  if (location.hash !== '#' + target) location.hash = target
  window.scrollTo({ top: 0, behavior: 'instant' })
  await nextTick(); title.value?.focus({ preventScroll: true })
  if (target === 'chat') messageList.value?.scrollTo({ top: messageList.value.scrollHeight })
}
async function openUniverse() {
  await go('work')
  selectedProject.value = '01'
  await nextTick()
  document.getElementById('universe-heading')?.scrollIntoView({ behavior: 'instant' })
  document.getElementById('universe-heading')?.focus({ preventScroll: true })
}
async function openLinkedCase() {
  const match = location.hash.match(/^#work\/universe(?:\/(relighting|lod|shader)(\/ownership)?)?$/)
  if (!match) return
  if (match[2] && match[1] !== 'shader') return
  selectedProject.value = '01'
  await nextTick()
  const chapter = document.getElementById(match[1] || 'universe-heading')
  if (chapter instanceof HTMLDetailsElement) chapter.open = true
  await nextTick()
  const target = match[2] ? document.getElementById('shader-ownership') : chapter
  target?.scrollIntoView({ behavior: 'instant' })
  target?.focus({ preventScroll: true })
}
async function openLinkedExploration() {
  const match = location.hash.match(/^#labs\/([^/]+)(?:\/([^/]+))?$/)
  if (!match) return
  const item = explorations.find(entry => entry.id === match[1])
  if (!item) return
  expandedExploration.value = item.id
  await nextTick()
  const chapter = document.getElementById(match[2] || 'labs-case-' + item.id)
  if (chapter instanceof HTMLDetailsElement) chapter.open = true
  await nextTick()
  chapter?.scrollIntoView({ behavior: 'instant' })
  chapter?.focus({ preventScroll: true })
}
async function hashChange() {
  const target = readPage()
  if (target !== page.value) {
    page.value = target
    selectedProject.value = null
    window.scrollTo({ top: 0, behavior: 'instant' })
    await nextTick()
    title.value?.focus({ preventScroll: true })
  }
  await openLinkedCase()
  await openLinkedExploration()
}
onMounted(() => { openLinkedCase(); openLinkedExploration() })
let revealObserver: IntersectionObserver | undefined
let sectionFrame = 0
function trackSection() {
  sectionFrame = 0
  const nodes = Array.from(document.querySelectorAll<HTMLElement>('.editorial-page [data-section]'))
  if (!nodes.length) { activeSection.value = 0; return }
  if (document.documentElement.scrollHeight - innerHeight < 300) return
  if (scrollY + innerHeight >= document.documentElement.scrollHeight - 4) {
    activeSection.value = Number(nodes[nodes.length - 1]!.dataset.index || nodes.length - 1)
    return
  }
  const line = innerHeight * .42
  let index = 0
  nodes.forEach(node => { if (node.getBoundingClientRect().top <= line) index = Number(node.dataset.index || 0) })
  activeSection.value = index
}
function scheduleTrack() { if (!sectionFrame) sectionFrame = requestAnimationFrame(trackSection) }
function observeSections() {
  revealObserver?.disconnect()
  activeSection.value = 0
  trackSection()
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
  const root = document.querySelector('.editorial-page')
  if (!root) return
  revealObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => { if (entry.isIntersecting) { entry.target.classList.add('is-inview'); revealObserver?.unobserve(entry.target) } })
  }, { rootMargin: '0px 0px -8% 0px', threshold: .04 })
  root.querySelectorAll<HTMLElement>('.reveal').forEach(target => revealObserver?.observe(target))
}
const calloutDegrees = [160, 250, 340, 70]
const calloutAngles = calloutDegrees.map(degrees => degrees * Math.PI / 180)
const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
const wideQuery = window.matchMedia('(min-width: 761px)')
let navFrame = 0, navPrevious = 0, navTime = 0, navSmooth = 0
function clearCalloutShift() {
  orbitNav.value?.querySelectorAll<HTMLElement>('.orbit-callout').forEach(element => { element.style.removeProperty('--drift-x'); element.style.removeProperty('--drift-y') })
}
function navLoop(now: number) {
  const nav = orbitNav.value
  if (!nav || page.value !== 'home' || !wideQuery.matches || motionQuery.matches || document.hidden) {
    clearCalloutShift(); navFrame = requestAnimationFrame(navLoop); return
  }
  const dt = navPrevious ? Math.min((now - navPrevious) / 1000, .05) : 0
  navPrevious = now
  if (!navHover.value && !paused.value) navTime += dt
  const drag = art.value?.readDrag?.() ?? 0
  const wanted = Math.max(-.1, Math.min(.1, drag * .3)) + Math.sin(navTime * .22) * .035
  navSmooth += (wanted - navSmooth) * (1 - Math.exp(-dt * 3))
  const radius = nav.clientWidth * .44
  Array.from(nav.querySelectorAll<HTMLElement>('.orbit-callout')).forEach((element, index) => {
    const base = calloutAngles[index] ?? 0
    const angle = base + navSmooth
    const x = (Math.cos(angle) - Math.cos(base)) * radius
    const y = (Math.sin(angle) - Math.sin(base)) * radius
    element.style.setProperty('--drift-x', `${x.toFixed(2)}px`)
    element.style.setProperty('--drift-y', `${y.toFixed(2)}px`)
  })
  navFrame = requestAnimationFrame(navLoop)
}
function primeOrbitIntro() {
  const nav = orbitNav.value
  if (!nav || motionQuery.matches) return
  const items = Array.from(nav.querySelectorAll<HTMLElement>('.orbit-callout'))
  if (!items.length) return
  const radius = nav.clientWidth * .44
  items.forEach((element, index) => {
    const angle = calloutAngles[index] ?? 0
    element.style.setProperty('--in-from-x', `${(-Math.cos(angle) * radius).toFixed(1)}px`)
    element.style.setProperty('--in-from-y', `${(-Math.sin(angle) * radius).toFixed(1)}px`)
  })
  nav.classList.add('is-intro')
  requestAnimationFrame(() => requestAnimationFrame(() => nav.classList.remove('is-intro')))
}
function startNav() { if (!navFrame) { navPrevious = 0; navFrame = requestAnimationFrame(navLoop) } }
function stopNav() { if (navFrame) cancelAnimationFrame(navFrame); navFrame = 0; navPrevious = 0; clearCalloutShift() }
function jumpToSection(id: string) {
  const index = sections.value.findIndex(item => item.id === id)
  if (index >= 0) activeSection.value = index
  document.getElementById(id)?.scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'start' })
}
onMounted(() => { observeSections(); addEventListener('scroll', scheduleTrack, { passive: true }); addEventListener('resize', scheduleTrack); startNav(); primeOrbitIntro() })
watch(page, async () => { await nextTick(); observeSections(); if (page.value === 'home') primeOrbitIntro() })
watch(page, value => { if (value === 'home') startNav(); else stopNav() })
function keyboard(event: KeyboardEvent) {
  if (event.key === 'Escape') void go(page.value === 'chat' ? previousPage.value : 'home')
}
window.addEventListener('hashchange', hashChange)
window.addEventListener('keydown', keyboard)
onBeforeUnmount(() => { window.removeEventListener('hashchange', hashChange); window.removeEventListener('keydown', keyboard); history.scrollRestoration = previousScrollRestoration; revealObserver?.disconnect(); cancelAnimationFrame(sectionFrame); removeEventListener('scroll', scheduleTrack); removeEventListener('resize', scheduleTrack); stopNav() })
watch(page, value => { document.title = value === 'home' ? '万乐琪 — 实时三维与交互开发' : `${nav.find(item => item.page === value)?.label || '作品集助手'} — 万乐琪` }, { immediate: true })
async function send(value = question.value) {
  const text = value.trim().slice(0, 500)
  if (!text) return
  question.value = ''
  messages.value.push({ id: messages.value.length, role: 'user', text })
  const project = /universe|lod|shader|光照|特效|项目|作品|三维|分块|预算/i.test(text)
  let response = '我可以介绍 Universe 项目的重光照、大场景 LOD 与 Shader 特效，也可以带你浏览开发经历。这是本地预设回答的导览原型。'
  if (/lod|分块|预算|性能/i.test(text)) response = 'LOD 项目先在交付压力下改善视野优先加载与细化，再建立对标原始 Supersplat-Viewer 的评测流程。之后通过 Profiler 修复无效轮询与增量更新路径，验证场景尺度、叶块粒度和 renderScale 的取舍，最后调整视锥外降档与预算，形成桌面 2.5M、移动端 1M 的默认性能档。项目页按轮次展示改动与阶段数据。'
  else if (/光照|手电|笔刷/i.test(text)) response = '重光照能力包括昼夜调节、局部灯光、亮灯笔刷和交互手电筒。笔刷通过烘焙世界空间亮度场，改用纹理查询来控制逐高斯计算成本。项目页可以观看手电筒和综合创作演示。'
  else if (/shader|特效|素描/i.test(text)) response = 'Shader 章节关注着色所有权、风格化算法、开场门控与光照交接。演示包含风格化创作和钢笔速写，项目页保留了原发布平台的观看入口。'
  else if (project) response = 'Universe 是一个三维重建与创作 SaaS 平台，希望让用户通过相机创建场景底座，再进行光照、特效与交互创作。我担任三维前端开发，项目页介绍重光照、大场景 LOD 与 Shader 三个方向。'
  else if (/设计|流程|理念|process/i.test(text)) response = '这份作品集以编辑排版、留白与程序化轨道几何组织内容。拖动中央装置可以旋转，四个星形入口连接项目、经历、关于与联系；点击装置进入导览助手。'
  else if (/联系|合作|邮箱|电话|contact/i.test(text)) response = `可以通过邮箱 ${profile.email} 或电话 ${profile.phone} 联系，GitHub 与个人网站链接列在联系页。当前页面本身不会发送消息。`
  else if (/教育|学校|学历/i.test(text)) response = '教育背景：英属哥伦比亚大学数字媒体硕士（09/21 — 12/22，CGPA 4.2/4.3），以及同校计算机与统计学理学荣誉学士（09/16 — 08/21）。背景页同时列出教育与技术背景。'
  else if (/技能|资质|语言|工具/i.test(text)) response = '技术背景包括 JS/TS、C#、Python、C++；Unity、IsaacSim、UE5；Meta Quest 2/3 与 Pico 4 UE；以及 Codex/GPT、Cursor、CodeBuddy。持有 Unity Certified Professional Programmer 与 Microsoft Azure Fundamentals 认证，英语雅思 7.5、日语 N5 水平。'
  else if (/经历|履历|背景/i.test(text)) response = '我是万乐琪，XR / 三维图形开发工程师。目前在北京数原数字化城市研究中心任高级三维工程师，负责 3DGS 渲染与创作平台的重光照、特效与大场景 LOD 优化；此前在 Yumebau 负责 XR 内容与系统，并有 Unity 主程、RBC 与 SAP 的实习经历。背景页按时间顺序列出完整内容。'
  messages.value.push({ id: messages.value.length, role: 'assistant', text: response, link: project })
  await nextTick(); messageList.value?.scrollTo({ top: messageList.value.scrollHeight, behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' })
  questionField.value?.focus({ preventScroll: true })
}
</script>

<template>
  <div class="site-shell" :class="{ 'assistant-open': page === 'chat' }">
    <header v-if="page !== 'chat'" class="site-header">
      <button class="monogram" aria-label="返回首页" @click="go('home')">Nancy Wan</button>
      <nav aria-label="主导航"><button v-for="item in nav" :key="item.page" :class="{ current: page === item.page }" :aria-current="page === item.page ? 'page' : undefined" @click="go(item.page)">{{ item.label }}</button></nav>
    </header>

    <main v-if="page === 'home'" class="home-page page-appear">
      <div class="home-intro"><p class="home-signature"><span class="home-name"><span class="intro-line" style="--intro-delay:.95s">万乐琪</span><span class="home-name-en"><span class="intro-line" style="--intro-delay:1.06s">Nancy Wan</span></span></span></p><h1 ref="title" tabindex="-1"><span class="intro-line" style="--intro-delay:1.16s">实时三维</span><em><span class="intro-line" style="--intro-delay:1.34s">与交互开发</span></em></h1><p class="serif intro-description"><span class="intro-line" style="--intro-delay:1.48s">专注 Web3D、3DGS 场景渲染，</span><br class="desktop-break"><span class="intro-line" style="--intro-delay:1.6s">以及实时图形与交互系统开发。</span></p></div>
      <div class="home-art"><ArtScene ref="art" :highlight="highlighted" :paused="paused" :openable="assistantEnabled" @open="go('chat')" /></div>
      <div ref="orbitNav" class="orbit-navigation" aria-label="浏览作品集">
        <button v-for="(item, index) in nav" :key="item.page" class="orbit-callout" :class="['callout-' + item.page, { 'is-highlighted': highlighted === index }]" @pointerenter="highlighted = index; navHover = true" @pointerleave="highlighted = -1; navHover = false" @focus="highlighted = index" @blur="highlighted = -1" @click="go(item.page)">
          <StarMark/><span class="callout-number">0{{ index + 1 }}</span><span class="callout-copy"><span class="callout-title">{{ item.label }}<span class="callout-arrow">↗</span></span><span class="callout-subtitle">{{ item.subtitle }}</span></span>
        </button>
      </div>
      <div class="home-bottom"><p class="eyebrow">选择栏目，查看项目与背景</p><div class="rotation-controls"><span>{{ assistantEnabled ? '拖动旋转 · 点击对话' : '拖动旋转 · 方向键微调' }}</span><button :aria-label="paused ? '继续自动旋转' : '暂停自动旋转'" :aria-pressed="paused" @click="paused = !paused">{{ paused ? '继续' : '暂停' }}</button><button aria-label="重置旋转" @click="art?.reset()">重置 ↺</button></div></div>
    </main>

    <main v-else-if="page === 'chat'" class="assistant-page page-appear">
      <section class="assistant-intro"><p class="eyebrow">作品集导览 / 01</p><h1 ref="title" tabindex="-1">项目与技术<em>问答助手</em></h1><p class="serif">查询项目背景、技术实现、<br>开发经历与相关资料。</p><div class="assistant-art"><ArtScene compact :paused="paused" @open="questionField?.focus()" /></div><button class="assistant-back text-link" @click="go(previousPage)">← 返回{{ nav.find(item => item.page === previousPage)?.label || '首页' }}</button></section>
      <section class="conversation" aria-label="作品集助手"><button class="close-assistant" aria-label="关闭助手" @click="go(previousPage)"><span></span><span></span></button>
        <div ref="messageList" class="messages" role="log" aria-label="对话内容" aria-live="polite" aria-relevant="additions"><article v-for="message in messages" :key="message.id" class="message" :class="message.role"><span class="eyebrow">{{ message.role === 'assistant' ? '导览助手' : '你' }}</span><p class="serif">{{ message.text }}</p><button v-if="message.link" class="text-link answer-link" @click="openUniverse()">查看 Universe 项目 ↗</button></article></div>
        <div class="suggestions"><button @click="send('介绍一下 Universe 项目')">介绍一下 Universe 项目</button><button @click="send('LOD 是怎么优化的？')">LOD 是怎么优化的？</button><button @click="send('重光照有哪些能力？')">重光照有哪些能力？</button></div>
        <form class="question-form" @submit.prevent="send()"><label class="sr-only" for="question">输入问题</label><input id="question" ref="questionField" v-model="question" maxlength="500" placeholder="你想了解什么？" autocomplete="off"><button type="submit" aria-label="发送问题" :disabled="!question.trim()">→</button></form>
        <p class="conversation-note">本地导览原型 · 预设回答 <span>静态演示</span></p>
      </section>
    </main>

    <main v-else :key="page" class="editorial-page page-appear" :class="'page-' + page">
      <template v-if="page === 'work'">
        <section class="work-intro"><p class="eyebrow">01 / 项目与实践</p><div class="work-heading"><h1 ref="title" tabindex="-1">三维前端<em>项目与技术实践</em></h1><p class="serif">项目背景、个人职责、技术方案与阶段验证结果。</p></div></section>
        <p class="content-notice">项目索引 / 工作与个人项目分组排列，整理中的条目会标注状态。</p>
        <section v-for="(group, groupIndex) in projectGroups" :key="group.key" class="work-group" :aria-label="group.label">
          <header class="work-group-heading"><p class="eyebrow">0{{ groupIndex + 1 }} / {{ group.label }}</p><p class="serif">{{ group.note }}</p></header>
          <div class="work-list">
            <article v-for="entry in group.entries" :key="entry.project.id" :id="'work-' + entry.project.id" class="work-row reveal" data-section :data-index="entry.index"><div class="work-meta"><span>{{ entry.project.id }}</span><span>{{ entry.project.category }}</span><span class="work-year">{{ entry.project.year }}</span></div><button class="work-image" v-tilt="4" :aria-label="'查看 ' + entry.project.title" :aria-expanded="selectedProject === entry.project.id" :aria-controls="'case-' + entry.project.id" @click="selectedProject = selectedProject === entry.project.id ? null : entry.project.id"><img v-if="entry.project.id === '01'" class="universe-cover" src="/media/universe/platform-home.png" alt="Universe 开放平台首页" loading="lazy"><ProjectArtwork v-else :variant="entry.index + 1"/></button><div class="work-copy"><h2 class="serif"><button :aria-expanded="selectedProject === entry.project.id" @click="selectedProject = selectedProject === entry.project.id ? null : entry.project.id">{{ entry.project.title }}</button></h2><p>{{ entry.project.tags }}</p><span class="case-status" :class="{ 'is-draft': entry.project.status === 'draft' }">{{ statusLabel(entry.project, selectedProject === entry.project.id) }}</span></div><button class="work-arrow" :aria-label="(selectedProject === entry.project.id ? '收起 ' : '展开 ') + entry.project.title" :aria-expanded="selectedProject === entry.project.id" @click="selectedProject = selectedProject === entry.project.id ? null : entry.project.id">{{ selectedProject === entry.project.id ? '−' : '↗' }}</button><div v-if="selectedProject === entry.project.id" :id="'case-' + entry.project.id" :class="entry.project.id === '01' ? 'full-case-detail' : 'case-detail'"><UniverseCase v-if="entry.project.id === '01'"/><template v-else><p class="eyebrow">项目笔记 / {{ entry.project.id }}</p><div><p class="serif">{{ entry.project.description }}</p><p>{{ entry.project.detail }}</p></div></template></div></article>
          </div>
        </section>
      </template>

      <template v-else>
        <section class="editorial-intro"><p class="eyebrow">{{ copy?.eyebrow }}</p><div class="editorial-heading"><h1 ref="title" tabindex="-1" class="serif"><span v-for="line in copy?.lines" :key="line">{{ line }}</span></h1><p class="serif">{{ copy?.description }}</p></div></section>
        <template v-if="page === 'background'">
          <div class="notice-row"><p class="content-notice">实践记录 / 按时间倒序排列，包含工作与实习经历。</p><a class="text-link resume-link" :href="resume.href" :download="resume.filename"><span>下载简历</span><span class="resume-link-meta">{{ resume.meta }}</span><span class="resume-link-arrow" aria-hidden="true">↓</span></a></div>
          <section class="editorial-rows" aria-label="开发经历"><article v-for="(item, index) in experience" :key="item.title" :id="'experience-' + index" class="editorial-row reveal" data-section :data-index="index" v-tilt="1.2"><p class="eyebrow">{{ item.period }}</p><div><h2 class="serif">{{ item.title }}</h2><p class="row-place">{{ item.place }}</p></div><div class="row-detail"><p class="row-description">{{ item.description }}</p><ul v-if="item.points.length" class="row-points"><li v-for="point in item.points" :key="point">{{ point }}</li></ul></div></article></section>
          <section id="background-education" class="education-section" aria-labelledby="education-title" data-section :data-index="5"><div class="education-heading"><p class="eyebrow">背景 / 教育</p><h2 id="education-title" class="serif">教育背景</h2><p>英属哥伦比亚大学 / 2016 — 2022</p></div><article v-for="item in education" :key="item.title" class="editorial-row reveal" v-tilt="1.2"><p class="eyebrow">{{ item.period }}</p><div><h3 class="serif">{{ item.title }}</h3><p class="row-place">{{ item.place }}</p></div><p class="row-description">{{ item.description }}</p></article></section>
          <section id="background-skills" class="education-section skills-section" aria-labelledby="skills-title" data-section :data-index="6"><div class="education-heading"><p class="eyebrow">背景 / 技术</p><h2 id="skills-title" class="serif">技术背景</h2><p>编程语言、软件、硬件与 AI 工具</p></div><article v-for="group in skills" :key="group.label" class="skill-row reveal"><p class="eyebrow">{{ group.label }}</p><ul class="skill-items"><li v-for="item in group.items" :key="item">{{ item }}</li></ul></article></section>
        </template>
        <template v-else-if="page === 'labs'">
          <p class="content-notice">探索记录 / 逐条记录测试条件、取舍与结论边界。</p>
          <section class="editorial-rows" aria-label="技术探索"><article v-for="(item, index) in explorations" :key="item.id" :id="'labs-' + index" class="editorial-row reveal" data-section :data-index="index"><p class="eyebrow">{{ item.id }} / {{ item.topic }}</p><div><h2 class="serif">{{ item.title }}</h2><p class="row-place">{{ item.status }}</p></div><div class="row-detail"><p class="row-description">{{ item.summary }}</p><button class="text-link explore-toggle" :aria-expanded="expandedExploration === item.id" :aria-controls="'labs-case-' + item.id" @click="toggleExploration(item.id)">{{ expandedExploration === item.id ? '收起完整记录 −' : '展开完整记录 ↗' }}</button></div><div v-if="expandedExploration === item.id" :id="'labs-case-' + item.id" class="full-case-detail"><ExplorationCase /></div></article></section>
        </template>
        <template v-else-if="page === 'contact'">
          <section class="editorial-rows" aria-label="联系信息"><article id="contact-email" class="editorial-row reveal" data-section :data-index="0"><p class="eyebrow">邮箱</p><h2><a :href="'mailto:' + profile.email">{{ profile.email }}</a></h2><p class="row-description">优先通过邮件联系，可附项目背景与时间安排。</p></article><article id="contact-phone" class="editorial-row reveal" data-section :data-index="1"><p class="eyebrow">电话</p><h2><a :href="'tel:' + profile.phone.replace(/[^+\d]/g, '')">{{ profile.phone }}</a></h2><p class="row-description">如需即时沟通，可以直接拨打。</p></article><article id="contact-github" class="editorial-row reveal" data-section :data-index="2"><p class="eyebrow">GitHub</p><h2><a :href="profile.github" target="_blank" rel="noreferrer">github.com/nancywan1004</a></h2><p class="row-description">代码仓库入口。</p></article></section><div class="contact-action"><p class="serif">实时三维与交互开发相关合作</p><a class="text-link" :href="'mailto:' + profile.email">写邮件 ↗</a></div>
        </template>
      </template>
      <footer class="page-footer"><button class="text-link" @click="go('home')">← 返回首页</button><span>{{ page === 'work' ? '空间 · 图形 · 交互' : '万乐琪 / 三维图形与交互开发' }}</span><button v-if="assistantEnabled" class="text-link footer-assistant" @click="go('chat')">作品集助手 ↗</button></footer>
    </main>

    <ScrollField v-if="page !== 'home' && page !== 'chat'" :key="'field-' + page" :kind="fieldKind" :active="activeSection" />
    <SideOrbit v-if="page !== 'home' && page !== 'chat'" :key="'rail-' + page" :items="sections" :active="activeSection" @jump="jumpToSection" />
  </div>
</template>
