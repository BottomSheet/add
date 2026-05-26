import { ref, reactive } from 'vue'

// ─── Sparks ───────────────────────────────────────────────────────────────────
const CHARS = ['✦','✧','◦','⊹','✶','⁺','∘','·','★','♡','✿','❀']
let sparkId = 0
export const sparks = ref([])

export function spawnSpark(x, y, count = 1) {
  for (let i = 0; i < count; i++) {
    const id = sparkId++
    const angle = Math.random() * Math.PI * 2
    const dist  = 20 + Math.random() * 70
    sparks.value.push({
      id,
      x: x - 10,
      y: y - 10,
      e: CHARS[Math.floor(Math.random() * CHARS.length)],
      tx: Math.cos(angle) * dist,
      ty: Math.sin(angle) * dist,
    })
    setTimeout(() => {
      sparks.value = sparks.value.filter(s => s.id !== id)
    }, 820)
  }
}

// ─── Touch trail ─────────────────────────────────────────────────────────────
export function useTouchTrail() {
  function onTouchMove(e) {
    if (Math.random() > 0.45) return
    const t = e.touches[0]
    spawnSpark(t.clientX, t.clientY, 1)
  }
  return { onTouchMove }
}

// ─── Toast ───────────────────────────────────────────────────────────────────
export const toast = reactive({ show: false, msg: '' })
let toastTimer

export function say(msg) {
  clearTimeout(toastTimer)
  toast.msg = msg
  toast.show = true
  toastTimer = setTimeout(() => { toast.show = false }, 2600)
}

// ─── Confetti ────────────────────────────────────────────────────────────────
export function launchConfetti() {
  const cv = document.getElementById('confetti-canvas')
  if (!cv) return
  const ctx = cv.getContext('2d')
  cv.width  = window.innerWidth
  cv.height = window.innerHeight

  const cols = ['#ffb8d4','#ff85b3','#ffd97d','#f5d0fe','#e8407a','#fff0f9','#ffaecf','#ffd6e7']
  const particles = Array.from({ length: 220 }, () => {
    const a = Math.PI * 2 * Math.random()
    return {
      x:   Math.random() * cv.width,
      y:   -20 - Math.random() * 400,
      vx:  Math.cos(a) * (1 + Math.random() * 2),
      vy:  2 + Math.random() * 4.5,
      w:   3 + Math.random() * 9,
      h:   2 + Math.random() * 3.5,
      col: cols[Math.floor(Math.random() * cols.length)],
      rot: Math.random() * Math.PI * 2,
      rv:  (Math.random() - 0.5) * 0.22,
    }
  })

  let raf
  const draw = () => {
    ctx.clearRect(0, 0, cv.width, cv.height)
    let alive = false
    particles.forEach(p => {
      p.x += p.vx; p.y += p.vy; p.rot += p.rv
      if (p.y < cv.height + 20) alive = true
      ctx.save()
      ctx.translate(p.x, p.y)
      ctx.rotate(p.rot)
      ctx.fillStyle = p.col
      ctx.beginPath()
      ctx.ellipse(0, 0, p.w, p.h, 0, 0, Math.PI * 2)
      ctx.fill()
      ctx.restore()
    })
    if (alive) raf = requestAnimationFrame(draw)
    else ctx.clearRect(0, 0, cv.width, cv.height)
  }
  cancelAnimationFrame(raf)
  draw()
}

// ─── Intersection Observer helper ────────────────────────────────────────────
export function useReveal(threshold = 0.2) {
  const observers = []

  function observe(el, onVisible) {
    if (!el) return
    const io = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          onVisible()
          io.disconnect()
        }
      })
    }, { threshold })
    io.observe(el)
    observers.push(io)
  }

  function cleanup() {
    observers.forEach(io => io.disconnect())
  }

  return { observe, cleanup }
}
