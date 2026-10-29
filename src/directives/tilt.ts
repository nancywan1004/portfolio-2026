import type { Directive } from 'vue'

type TiltValue = number | { max?: number } | undefined
const listeners = new WeakMap<HTMLElement, { move: (event: PointerEvent) => void; leave: () => void }>()

export const tilt: Directive<HTMLElement, TiltValue> = {
  mounted(el, binding) {
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return
    const max = typeof binding.value === 'number' ? binding.value : binding.value?.max ?? 2
    el.classList.add('is-tiltable')
    const move = (event: PointerEvent) => {
      const rect = el.getBoundingClientRect()
      const x = (event.clientX - rect.left) / Math.max(rect.width, 1) - .5
      const y = (event.clientY - rect.top) / Math.max(rect.height, 1) - .5
      el.style.setProperty('--tilt-x', `${(-y * max).toFixed(2)}deg`)
      el.style.setProperty('--tilt-y', `${(x * max).toFixed(2)}deg`)
    }
    const leave = () => {
      el.style.setProperty('--tilt-x', '0deg')
      el.style.setProperty('--tilt-y', '0deg')
    }
    el.addEventListener('pointermove', move)
    el.addEventListener('pointerleave', leave)
    listeners.set(el, { move, leave })
  },
  unmounted(el) {
    const handler = listeners.get(el)
    if (handler) {
      el.removeEventListener('pointermove', handler.move)
      el.removeEventListener('pointerleave', handler.leave)
      listeners.delete(el)
    }
  },
}
