<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import * as THREE from 'three'
import { Line2 } from 'three/addons/lines/Line2.js'
import { LineGeometry } from 'three/addons/lines/LineGeometry.js'
import { LineMaterial } from 'three/addons/lines/LineMaterial.js'

type Item = { id: string; label: string }
const props = defineProps<{ items: Item[]; active: number }>()
const emit = defineEmits<{ jump: [id: string] }>()
const host = ref<HTMLDivElement>()
const dragging = ref(false)
const reduced = window.matchMedia('(prefers-reduced-motion: reduce)')
const current = computed(() => props.items[props.active] ?? props.items[0])
const next = computed(() => props.items.length ? props.items[(props.active + 1) % props.items.length] : undefined)

const scene = new THREE.Scene()
const camera = new THREE.OrthographicCamera(-3.4, 3.4, 3.4, -3.4, .1, 20)
camera.position.z = 8
const orbit = new THREE.Group()
scene.add(orbit)
const geometry: THREE.BufferGeometry[] = []
const materials: THREE.Material[] = []
const rings: Line2[] = []
const satellites: { mesh: THREE.Mesh; phase: number; speed: number }[] = []
const tilt = { x: 0, y: 0 }
const drag = { x: 0, y: 0, lastX: 0, lastY: 0, distance: 0, id: -1 }
const scroll = { progress: 0, target: 0 }
let pulse = 1
let renderer: THREE.WebGLRenderer | undefined
let observer: ResizeObserver | undefined
let frame = 0, previous = 0, time = 0, width = 1, height = 1, disposed = false

watch(() => props.active, () => { pulse = reduced.matches ? 1 : 1.16 })

function size() {
  if (!host.value || !renderer) return
  width = host.value.clientWidth; height = host.value.clientHeight
  renderer.setSize(width, height)
  rings.forEach(ring => (ring.material as LineMaterial).resolution.set(width, height))
}
function readScroll() {
  const max = document.documentElement.scrollHeight - innerHeight
  scroll.target = max > 0 ? Math.min(1, Math.max(0, scrollY / max)) : 0
}
function pointerDown(event: PointerEvent) {
  if (event.button !== 0 || event.isPrimary === false) return
  drag.id = event.pointerId; drag.lastX = event.clientX; drag.lastY = event.clientY; drag.distance = 0
  dragging.value = true; host.value?.setPointerCapture(event.pointerId)
}
function pointerMove(event: PointerEvent) {
  if (!dragging.value || event.pointerId !== drag.id) return
  const dx = event.clientX - drag.lastX, dy = event.clientY - drag.lastY
  drag.distance += Math.abs(dx) + Math.abs(dy)
  drag.x += dx * .012; drag.y += dy * .012
  drag.lastX = event.clientX; drag.lastY = event.clientY
}
function pointerUp(event: PointerEvent) {
  if (event.pointerId !== drag.id) return
  const click = drag.distance < 6
  dragging.value = false; drag.id = -1
  if (host.value?.hasPointerCapture(event.pointerId)) host.value.releasePointerCapture(event.pointerId)
  if (click && next.value) emit('jump', next.value.id)
}
function cancel() { dragging.value = false; drag.id = -1 }
function keyboard(event: KeyboardEvent) {
  if (event.key === 'Enter' || event.key === ' ') {
    event.preventDefault()
    if (next.value) emit('jump', next.value.id)
    return
  }
  if (!['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(event.key)) return
  event.preventDefault()
  if (event.key === 'ArrowLeft') drag.x -= .16
  if (event.key === 'ArrowRight') drag.x += .16
  if (event.key === 'ArrowUp') drag.y -= .16
  if (event.key === 'ArrowDown') drag.y += .16
}
function render(now: number) {
  if (disposed) return
  const dt = previous ? Math.min((now - previous) / 1000, .05) : 0
  previous = now
  if (!document.hidden) {
    if (!reduced.matches) time += dt
    const damping = 1 - Math.exp(-dt * (dragging.value ? 14 : 4))
    scroll.progress += (scroll.target - scroll.progress) * (1 - Math.exp(-dt * 3))
    pulse += (1 - pulse) * (1 - Math.exp(-dt * 5))
    tilt.x += (drag.y - tilt.x) * damping
    tilt.y += (drag.x - tilt.y) * damping
    orbit.rotation.set(.14 + tilt.x, -.2 + tilt.y + scroll.progress * 1.5 + time * .03, -.12)
    orbit.scale.setScalar(pulse)
    renderer?.render(scene, camera)
  }
  frame = requestAnimationFrame(render)
}
onMounted(() => {
  try {
    renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true })
    renderer.setPixelRatio(Math.min(devicePixelRatio, 2))
    renderer.setClearColor(0x000000, 0)
    renderer.domElement.setAttribute('aria-hidden', 'true')
    host.value?.appendChild(renderer.domElement)
    const poses: [number, number, number][] = [[1.35, 0, .1], [1.26, 0, 1.5], [.98, 0, -.66], [1.12, 0, .74]]
    poses.forEach((pose, index) => {
      const group = new THREE.Group()
      group.rotation.order = 'ZYX'
      group.rotation.set(pose[0], pose[1], pose[2])
      const vertices: number[] = []
      for (let i = 0; i <= 192; i++) {
        const t = i / 192 * Math.PI * 2
        vertices.push(Math.cos(t) * 2.55, Math.sin(t) * 2.55, 0)
      }
      const lineGeometry = new LineGeometry()
      lineGeometry.setPositions(vertices)
      const material = new LineMaterial({ color: 0x3a3a35, linewidth: index ? .7 : .9, transparent: true, depthWrite: false, depthTest: false })
      material.opacity = index ? .55 : .9
      const line = new Line2(lineGeometry, material)
      group.add(line); orbit.add(group)
      geometry.push(lineGeometry); materials.push(material); rings.push(line)
      if (index < 2) {
        const dotGeometry = new THREE.SphereGeometry(.05, 12, 8)
        const dotMaterial = new THREE.MeshBasicMaterial({ color: 0x242422 })
        const mesh = new THREE.Mesh(dotGeometry, dotMaterial)
        group.add(mesh)
        geometry.push(dotGeometry); materials.push(dotMaterial)
        satellites.push({ mesh, phase: index * 2.4 + .4, speed: .07 + index * .03 })
      }
    })
    observer = new ResizeObserver(size); observer.observe(host.value!)
    size(); readScroll()
    addEventListener('scroll', readScroll, { passive: true })
    frame = requestAnimationFrame(render)
  } catch { /* 无 WebGL 时仅保留章节索引 */ }
})
onBeforeUnmount(() => {
  disposed = true
  cancelAnimationFrame(frame)
  observer?.disconnect()
  removeEventListener('scroll', readScroll)
  geometry.forEach(item => item.dispose())
  materials.forEach(item => item.dispose())
  renderer?.dispose()
})
</script>

<template>
  <aside class="orbit-rail" aria-label="章节三维导航">
    <div ref="host" class="rail-device" :class="{ 'is-dragging': dragging }" role="button" tabindex="0"
      :aria-label="`三维章节装置：拖动旋转，点击前往${next ? '「' + next.label + '」' : '下一章节'}`"
      @pointerdown="pointerDown" @pointermove="pointerMove" @pointerup="pointerUp" @pointercancel="cancel" @lostpointercapture="cancel" @keydown="keyboard">
      <span class="rail-dot" :class="{ 'is-dragging': dragging }"></span>
    </div>
    <nav class="rail-ticks" aria-label="章节列表">
      <button v-for="(item, index) in items" :key="item.id" :class="{ current: index === active }"
        :aria-current="index === active ? 'true' : undefined" :title="item.label" :aria-label="item.label"
        @click="emit('jump', item.id)"><span>{{ String(index + 1).padStart(2, '0') }}</span></button>
    </nav>
    <p class="rail-caption">{{ current?.label }}</p>
  </aside>
</template>
