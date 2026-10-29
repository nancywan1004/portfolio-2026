<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'
import * as THREE from 'three'

type Kind = 'work' | 'background' | 'labs' | 'contact'
type RingSpec = { radius: number; squash: number; rotation: number }
type ClusterSpec = { nx: number; ny: number; dir: number; rings: RingSpec[] }

const props = withDefaults(defineProps<{ kind: Kind; active?: number }>(), { active: 0 })
const host = ref<HTMLDivElement>()
const reduced = window.matchMedia('(prefers-reduced-motion: reduce)')

const layouts: Record<Kind, ClusterSpec[]> = {
  work: [
    { nx: 1.06, ny: -0.02, dir: 1, rings: [
      { radius: .92, squash: .3, rotation: .55 },
      { radius: .78, squash: .26, rotation: .55 },
      { radius: 1.06, squash: .36, rotation: .55 },
      { radius: .6, squash: .2, rotation: .55 },
    ] },
    { nx: -1, ny: -0.66, dir: -1, rings: [
      { radius: .52, squash: .16, rotation: -.42 },
      { radius: .66, squash: .22, rotation: -.42 },
    ] },
  ],
  background: [
    { nx: 1.04, ny: 0, dir: 1, rings: [
      { radius: .86, squash: .62, rotation: -.36 },
      { radius: .7, squash: .5, rotation: -.36 },
      { radius: 1.02, squash: .74, rotation: -.36 },
      { radius: .56, squash: .4, rotation: -.36 },
    ] },
    { nx: -.98, ny: .6, dir: -1, rings: [
      { radius: .46, squash: .34, rotation: .5 },
    ] },
  ],
  labs: [
    { nx: 1, ny: -0.02, dir: 1, rings: [
      { radius: .72, squash: .68, rotation: .24 },
      { radius: .9, squash: .84, rotation: .24 },
      { radius: .52, squash: .48, rotation: .24 },
    ] },
  ],
  contact: [
    { nx: .98, ny: .08, dir: 1, rings: [
      { radius: .95, squash: .78, rotation: .32 },
      { radius: 1.16, squash: .94, rotation: .32 },
    ] },
  ],
}

const scene = new THREE.Scene()
const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, .1, 20)
camera.position.z = 5
const field = new THREE.Group()
scene.add(field)
const clusters: { group: THREE.Group; spec: ClusterSpec; lines: THREE.Line[] }[] = []
const geometry: THREE.BufferGeometry[] = []
const materials: THREE.LineBasicMaterial[] = []
const scroll = { progress: 0, target: 0 }
const pointer = { x: 0, y: 0, currentX: 0, currentY: 0 }
let pulse = 1, pulseTarget = 1
let renderer: THREE.WebGLRenderer | undefined
let observer: ResizeObserver | undefined
let frame = 0, previous = 0, time = 0, aspect = 1, disposed = false

function makeRing(spec: RingSpec, opacity: number) {
  const points: THREE.Vector3[] = []
  for (let i = 0; i <= 180; i++) {
    const t = i / 180 * Math.PI * 2
    points.push(new THREE.Vector3(Math.cos(t) * spec.radius, Math.sin(t) * spec.radius * spec.squash, 0))
  }
  const lineGeometry = new THREE.BufferGeometry().setFromPoints(points)
  const material = new THREE.LineBasicMaterial({ color: 0xcfccc1, transparent: true, opacity, depthTest: false })
  const line = new THREE.Line(lineGeometry, material)
  line.rotation.z = spec.rotation
  geometry.push(lineGeometry); materials.push(material)
  return line
}
function build() {
  layouts[props.kind].forEach(spec => {
    const group = new THREE.Group()
    const lines = spec.rings.map((ring, index) => {
      const line = makeRing(ring, Math.max(.16, .44 - index * .06))
      group.add(line)
      return line
    })
    field.add(group)
    clusters.push({ group, spec, lines })
  })
}
function size() {
  if (!host.value || !renderer) return
  const width = host.value.clientWidth, height = host.value.clientHeight
  aspect = width / Math.max(height, 1)
  camera.left = -aspect; camera.right = aspect; camera.top = 1; camera.bottom = -1
  camera.updateProjectionMatrix()
  renderer.setSize(width, height)
}
function readScroll() {
  const max = document.documentElement.scrollHeight - innerHeight
  scroll.target = max > 0 ? Math.min(1, Math.max(0, scrollY / max)) : 0
}
function pointerMove(event: PointerEvent) {
  if (reduced.matches) return
  pointer.x = event.clientX / innerWidth * 2 - 1
  pointer.y = event.clientY / innerHeight * 2 - 1
}
function render(now: number) {
  if (disposed) return
  const dt = previous ? Math.min((now - previous) / 1000, .05) : 0
  previous = now
  if (!document.hidden) {
    if (!reduced.matches) time += dt
    const damping = 1 - Math.exp(-dt * 3)
    scroll.progress += (scroll.target - scroll.progress) * damping
    pointer.currentX += (pointer.x - pointer.currentX) * damping
    pointer.currentY += (pointer.y - pointer.currentY) * damping
    pulse += (pulseTarget - pulse) * damping
    clusters.forEach(({ group, spec, lines }) => {
      group.rotation.z = spec.dir * (scroll.progress * 1.1 + time * .013 + 1.4)
      group.position.set(spec.nx * aspect + pointer.currentX * .025 * spec.dir, spec.ny + spec.dir * (scroll.progress - .5) * .18 - pointer.currentY * .02, 0)
      group.scale.setScalar((1 + scroll.progress * .05) * pulse)
      const highlight = props.active % spec.rings.length
      lines.forEach((line, index) => {
        const material = line.material as THREE.LineBasicMaterial
        material.opacity = index === highlight ? .78 : Math.max(.18, .48 - index * .06)
      })
    })
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
    build(); size(); readScroll()
    observer = new ResizeObserver(size); observer.observe(host.value!)
    addEventListener('scroll', readScroll, { passive: true })
    addEventListener('resize', readScroll)
    addEventListener('pointermove', pointerMove, { passive: true })
    frame = requestAnimationFrame(render)
  } catch { /* 无 WebGL 时保持纯排版页面 */ }
})
onBeforeUnmount(() => {
  disposed = true
  cancelAnimationFrame(frame)
  observer?.disconnect()
  removeEventListener('scroll', readScroll)
  removeEventListener('resize', readScroll)
  removeEventListener('pointermove', pointerMove)
  geometry.forEach(item => item.dispose())
  materials.forEach(item => item.dispose())
  renderer?.dispose()
})
</script>

<template>
  <div ref="host" class="scroll-field" aria-hidden="true"></div>
</template>
