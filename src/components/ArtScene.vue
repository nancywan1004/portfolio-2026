<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import * as THREE from 'three'
import { Line2 } from 'three/addons/lines/Line2.js'
import { LineGeometry } from 'three/addons/lines/LineGeometry.js'
import { LineMaterial } from 'three/addons/lines/LineMaterial.js'
import gsap from 'gsap'

const props = withDefaults(defineProps<{ compact?: boolean; highlight?: number; paused?: boolean; openable?: boolean }>(), { compact: false, highlight: -1, paused: false, openable: true })
const emit = defineEmits<{ open: []; rotated: [] }>()
const host = ref<HTMLDivElement>()
const failed = ref(false)
const dragging = ref(false)
const reduced = window.matchMedia('(prefers-reduced-motion: reduce)')
const scene = new THREE.Scene()
const camera = new THREE.OrthographicCamera(-3.5, 3.5, 3.5, -3.5, .1, 50)
camera.position.z = 12
const orbit = new THREE.Group()
scene.add(orbit)
const core = new THREE.Group()
let renderer: THREE.WebGLRenderer | undefined
let observer: ResizeObserver | undefined
let frame = 0, previous = 0, time = 0
let width = 1, height = 1
const geometry: THREE.BufferGeometry[] = []
const materials: THREE.Material[] = []
const rings: Line2[] = []
const satellites: { mesh: THREE.Mesh; phase: number; speed: number }[] = []
const tilt = { x: 0, y: 0 }
const drag = { x: 0, y: 0, lastX: 0, lastY: 0, distance: 0, id: -1 }
const hover = { x: 0, y: 0 }
const label = computed(() => props.openable ? '旋转轨道装置：拖动或使用方向键，按 Enter 打开 AI 助手，R 重置' : '旋转轨道装置：拖动或使用方向键旋转，R 重置')
const shape = { scale: 1, offset: 0 }
let disposed = false
watch(() => props.highlight, index => gsap.to(shape, { scale: index < 0 ? 1 : 1.025, offset: index < 0 ? 0 : (index - 1.5) * .055, duration: reduced.matches ? 0 : .8, ease: 'power2.out' }))

function size() {
  if (!host.value || !renderer) return
  width = host.value.clientWidth; height = host.value.clientHeight
  const aspect = width / Math.max(height, 1)
  const half = Math.max(3.05, 3.05 / aspect)
  camera.left = -half * aspect; camera.right = half * aspect
  camera.top = half; camera.bottom = -half; camera.updateProjectionMatrix()
  renderer.setSize(width, height)
  rings.forEach(ring => (ring.material as LineMaterial).resolution.set(width, height))
}
function pointerDown(event: PointerEvent) {
  if (event.button !== 0 || event.isPrimary === false) return
  host.value?.focus({ preventScroll: true })
  drag.id = event.pointerId; drag.lastX = event.clientX; drag.lastY = event.clientY; drag.distance = 0
  dragging.value = true; host.value?.setPointerCapture(event.pointerId)
}
function pointerMove(event: PointerEvent) {
  if (!host.value) return
  const bounds = host.value.getBoundingClientRect()
  hover.x = (event.clientX - bounds.left) / bounds.width * 2 - 1
  hover.y = (event.clientY - bounds.top) / bounds.height * 2 - 1
  if (!dragging.value || event.pointerId !== drag.id) return
  const dx = event.clientX - drag.lastX, dy = event.clientY - drag.lastY
  drag.distance += Math.abs(dx) + Math.abs(dy)
  drag.x += dx * .007; drag.y += dy * .007
  drag.lastX = event.clientX; drag.lastY = event.clientY
}
function pointerUp(event: PointerEvent) {
  if (event.pointerId !== drag.id) return
  const click = drag.distance < 6
  dragging.value = false; drag.id = -1
  if (host.value?.hasPointerCapture(event.pointerId)) host.value.releasePointerCapture(event.pointerId)
  if (click && props.openable) emit('open'); else if (!click) emit('rotated')
}
function cancel() { dragging.value = false; drag.id = -1; hover.x = 0; hover.y = 0 }
function keyboard(event: KeyboardEvent) {
  if (['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(event.key)) {
    event.preventDefault()
    if (event.key === 'ArrowLeft') drag.x -= .18
    if (event.key === 'ArrowRight') drag.x += .18
    if (event.key === 'ArrowUp') drag.y -= .18
    if (event.key === 'ArrowDown') drag.y += .18
    emit('rotated')
  }
  if ((event.key === 'Enter' || event.key === ' ') && props.openable) { event.preventDefault(); emit('open') }
  if (event.key.toLowerCase() === 'r') reset()
}
function reset() { gsap.to(drag, { x: 0, y: 0, duration: reduced.matches ? 0 : 1, ease: 'power3.out' }) }
defineExpose({ reset, readDrag: () => drag.x })
function render(now: number) {
  if (disposed) return
  const dt = previous ? Math.min((now - previous) / 1000, .05) : 0
  previous = now
  if (!document.hidden) {
    if (!reduced.matches && !props.paused && !dragging.value) time += dt
    const damping = 1 - Math.exp(-dt * (dragging.value ? 14 : 4))
    const targetX = drag.y + (reduced.matches ? 0 : hover.y * .07)
    const targetY = drag.x + (reduced.matches ? 0 : hover.x * .1)
    tilt.x += (targetX - tilt.x) * damping; tilt.y += (targetY - tilt.y) * damping
    orbit.rotation.set(.12 + tilt.x, -.18 + tilt.y + time * .035 + shape.offset, -.12 + Math.sin(time * .08) * .03)
    orbit.scale.setScalar(shape.scale)
    const easing = reduced.matches ? 0 : (dragging.value ? .012 : .02)
    core.position.set(-tilt.y * easing, tilt.x * easing, 0)
    rings.forEach((ring, index) => {
      const base = index < 4 ? .78 : index < 6 ? .44 : .22
      ;(ring.material as LineMaterial).opacity = props.highlight < 0 ? base : index % 4 === props.highlight ? .95 : base * .55
    })
    satellites.forEach(({ mesh, phase, speed }) => {
      const t = phase + time * speed
      mesh.position.set(Math.cos(t) * 2.63, Math.sin(t) * 2.63, 0)
    })
    renderer?.render(scene, camera)
  }
  frame = requestAnimationFrame(render)
}
onMounted(() => {
  try {
    renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true })
    renderer.setPixelRatio(Math.min(devicePixelRatio, 2)); renderer.setClearColor(0x000000, 0)
    renderer.domElement.setAttribute('aria-hidden', 'true'); host.value!.appendChild(renderer.domElement)
    const poses = [[1.35,0,.1], [1.28,0,1.62], [.95,0,-.67], [1.1,0,.7], [1.48,0,-.24], [1.47,0,1.4], [1.5,0,.42], [.9,0,-.42]]
    poses.forEach((pose, index) => {
      const group = new THREE.Group(); group.rotation.order = 'ZYX'; group.rotation.set(pose[0]!, pose[1]!, pose[2]!)
      const vertices: number[] = []
      for (let i = 0; i <= 256; i++) { const t = i / 256 * Math.PI * 2; vertices.push(Math.cos(t) * 2.63, Math.sin(t) * 2.63, 0) }
      const lineGeometry = new LineGeometry(); lineGeometry.setPositions(vertices)
      const material = new LineMaterial({ color: 0x33332f, linewidth: index < 4 ? .85 : .65, transparent: true, depthWrite: false, depthTest: false })
      const line = new Line2(lineGeometry, material); group.add(line); orbit.add(group)
      geometry.push(lineGeometry); materials.push(material); rings.push(line)
      if (index < 3) {
        const dotGeometry = new THREE.SphereGeometry(.025, 12, 8)
        const dotMaterial = new THREE.MeshBasicMaterial({ color: 0x242422 })
        const mesh = new THREE.Mesh(dotGeometry, dotMaterial); group.add(mesh)
        geometry.push(dotGeometry); materials.push(dotMaterial); satellites.push({ mesh, phase: index * 2.1 + .6, speed: .045 + index * .012 })
      }
    })
    const coreGeometry = new THREE.CircleGeometry(.37, 64)
    const coreMaterial = new THREE.MeshBasicMaterial({ color: 0xf9f8f6, depthTest: false, transparent: true, opacity: 1 })
    const coreFace = new THREE.Mesh(coreGeometry, coreMaterial); coreFace.renderOrder = 10
    geometry.push(coreGeometry); materials.push(coreMaterial)
    const rimGeometry = new THREE.BufferGeometry().setFromPoints(Array.from({ length: 97 }, (_, i) => new THREE.Vector3(Math.cos(i / 96 * Math.PI * 2) * .375, Math.sin(i / 96 * Math.PI * 2) * .375, .01)))
    const rimMaterial = new THREE.LineBasicMaterial({ color: 0x292927, depthTest: false, transparent: true, opacity: 1 })
    const rim = new THREE.Line(rimGeometry, rimMaterial); rim.renderOrder = 11
    geometry.push(rimGeometry); materials.push(rimMaterial)
    core.add(coreFace, rim); scene.add(core)
    observer = new ResizeObserver(size); observer.observe(host.value!); size()
    frame = requestAnimationFrame(render)
  } catch { failed.value = true }
})
onBeforeUnmount(() => {
  disposed = true; cancelAnimationFrame(frame); observer?.disconnect()
  gsap.killTweensOf(shape); gsap.killTweensOf(drag)
  geometry.forEach(g => g.dispose()); materials.forEach(m => m.dispose()); renderer?.dispose()
})
</script>

<template>
  <div ref="host" class="orbital-art" :class="{ 'is-dragging': dragging, compact }" role="button" tabindex="0" :aria-label="label" @pointerdown="pointerDown" @pointermove="pointerMove" @pointerup="pointerUp" @pointercancel="cancel" @lostpointercapture="cancel" @pointerleave="hover.x = 0; hover.y = 0" @keydown="keyboard">
    <span v-if="openable" class="ask-label">和我聊聊 <span>↗</span></span>
    <svg v-if="failed" viewBox="-310 -310 620 620" class="orbit-fallback" aria-hidden="true"><g fill="none" stroke="currentColor" stroke-width=".7"><ellipse v-for="i in 7" :key="i" rx="265" :ry="48 + i * 22" :transform="`rotate(${i * 29})`"/></g><circle r="37" fill="#f9f8f6"/></svg>
  </div>
</template>
