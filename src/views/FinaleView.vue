<template>
  <div class="finale-page">
    <!-- Animated background blobs -->
    <div class="blobs" aria-hidden="true">
      <div class="blob blob-1" />
      <div class="blob blob-2" />
      <div class="blob blob-3" />
    </div>

    <!-- Floating petals layer -->
    <div class="petals-layer" aria-hidden="true">
      <div v-for="p in petals" :key="p.id" class="petal"
        :style="{ left: p.x + '%', background: p.c, width: p.s + 'px', height: p.s + 'px',
                  animationDuration: p.dur + 's', animationDelay: p.delay + 's' }" />
    </div>

    <!-- Photo with spinning ring -->
    <div class="photo-wrap reveal-scale" :class="{ visible: vis.photo }" ref="photoRef">
      <div class="photo-ring">
        <img src="/photos/p10.jpg" alt="Ева" />
      </div>
      <div class="photo-hearts">
        <span v-for="h in floatingHearts" :key="h.id" class="float-heart"
          :style="{ left: h.x + '%', animationDuration: h.dur + 's', animationDelay: h.delay + 's', fontSize: h.size + 'rem' }">
          {{ h.e }}
        </span>
      </div>
    </div>

    <!-- Main text -->
    <h1 class="finale-name reveal" :class="{ visible: vis.name }" ref="nameRef">
      Люблю тебя,<br/><em>Ева</em>
    </h1>

    <p class="finale-text reveal" :class="{ visible: vis.text }" ref="textRef">
      Впереди целый мир — и ты входишь в него такой,
      какой должна быть: собой. Тобой. Единственной.
    </p>

    <!-- Signature card -->
    <div class="sig-card reveal" :class="{ visible: vis.sig }" ref="sigRef">
      <div class="sig-line" />
      <p class="sig-msg">
        Ты — моё самое любимое приключение,
        мой любимый человек, моя Ева.
      </p>
      <div class="sig-line" />
    </div>

    <!-- Interactive heart -->
    <div class="heart-section reveal" :class="{ visible: vis.heart }" ref="heartRef">
      <button class="heart-btn" @click="heartTap" :class="{ beat: heartBeat }">
        ❤️
      </button>
      <p class="heart-hint">нажми</p>
      <p class="heart-counter" v-if="heartCount > 0">
        ты нажала {{ heartCount }} {{ heartWord }} ✦
      </p>
    </div>

    <!-- All photos strip at bottom -->
    <div class="bottom-strip reveal" :class="{ visible: vis.strip }" ref="stripRef">
      <div class="strip-inner">
        <div v-for="(src, i) in allPhotos" :key="i" class="strip-photo"
          :style="{ '--tilt': (Math.random()-.5)*6 + 'deg' }">
          <img :src="src" alt="" />
        </div>
        <!-- duplicate for scroll -->
        <div v-for="(src, i) in allPhotos" :key="'b'+i" class="strip-photo"
          :style="{ '--tilt': (Math.random()-.5)*6 + 'deg' }">
          <img :src="src" alt="" />
        </div>
      </div>
    </div>

    <!-- Final signature -->
    <footer class="final-footer">
      <p>ЕВА ✦ 2026 ✦ 11 КЛАСС</p>
    </footer>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted, onUnmounted } from 'vue'
import { spawnSpark, say, launchConfetti, useReveal } from '../composables/useEffects.js'

// ── Petals ────────────────────────────────────────────────────────────────────
const PETAL_COLORS = ['#ffb8d4','#ffd6e7','#f5d0fe','#ffaecf','#ffd97d','#ff7eb6']
const petals = Array.from({ length: 22 }, (_, i) => ({
  id: i,
  x:   Math.random() * 100,
  c:   PETAL_COLORS[Math.floor(Math.random() * PETAL_COLORS.length)],
  s:   7 + Math.random() * 14,
  dur: 5 + Math.random() * 8,
  delay: -Math.random() * 12,
}))

// ── Floating hearts on photo ──────────────────────────────────────────────────
const floatingHearts = Array.from({ length: 6 }, (_, i) => ({
  id: i,
  x:    10 + Math.random() * 80,
  e:    ['💖','✦','🌸','💫','❤️','✨'][i],
  dur:  3 + Math.random() * 3,
  delay: Math.random() * 4,
  size: 0.7 + Math.random() * 0.5,
}))

// ── Refs + visibility ─────────────────────────────────────────────────────────
const vis = reactive({
  photo: false, name: false, text: false,
  sig: false, heart: false, strip: false
})
const photoRef = ref(null)
const nameRef  = ref(null)
const textRef  = ref(null)
const sigRef   = ref(null)
const heartRef = ref(null)
const stripRef = ref(null)

const { observe, cleanup } = useReveal(0.25)

onMounted(() => {
  const pairs = [
    [photoRef, 'photo', 0],
    [nameRef,  'name',  150],
    [textRef,  'text',  250],
    [sigRef,   'sig',   350],
    [heartRef, 'heart', 400],
    [stripRef, 'strip', 500],
  ]
  pairs.forEach(([r, key, delay]) => {
    observe(r.value, () => setTimeout(() => { vis[key] = true }, delay))
  })
})
onUnmounted(cleanup)

// ── Heart interaction ─────────────────────────────────────────────────────────
const heartCount = ref(0)
const heartBeat  = ref(false)

const heartWord = computed(() => {
  const n = heartCount.value
  if (n === 1) return 'раз'
  if (n <= 4)  return 'раза'
  return 'раз'
})

function heartTap(e) {
  heartCount.value++
  heartBeat.value = true
  setTimeout(() => { heartBeat.value = false }, 400)
  spawnSpark(e.clientX, e.clientY, 12)

  const msgs = [
    '❤️ Люблю тебя!',
    '💖 Ты моя!',
    '✦ Люблю тебя, Ева',
    '🌸 Ты лучшая',
    '💫 Навсегда',
    '❤️ Мой любимый человек',
  ]
  say(msgs[heartCount.value % msgs.length])

  if (heartCount.value === 5 || heartCount.value === 10 || heartCount.value % 15 === 0) {
    launchConfetti()
  }
}

// ── All photos ────────────────────────────────────────────────────────────────
const allPhotos = [
  '/photos/p1.jpg', '/photos/p2.jpg', '/photos/p4.jpg',
  '/photos/p5.jpg', '/photos/p6.jpg', '/photos/p7.jpg',
  '/photos/p10.jpg', '/photos/p11.jpg',
]
</script>

<style scoped>
.finale-page {
  min-height: 100svh;
  background: linear-gradient(160deg, #ffd6e7, #f5d0fe 40%, #ffe4f0 70%, #ffd6e7);
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 3rem 1.5rem 2rem;
  position: relative;
  overflow: hidden;
  text-align: center;
}

/* ─── Blobs ─── */
.blobs { position: absolute; inset: 0; pointer-events: none; overflow: hidden; }
.blob {
  position: absolute;
  border-radius: 50%;
  filter: blur(60px);
  opacity: 0.35;
  animation: blobFloat ease-in-out infinite;
}
.blob-1 { width: 300px; height: 300px; background: var(--rose3); top: -80px; left: -80px; animation-duration: 8s; }
.blob-2 { width: 250px; height: 250px; background: var(--lavender); bottom: 20%; right: -60px; animation-duration: 10s; animation-delay: 2s; }
.blob-3 { width: 200px; height: 200px; background: var(--gold); bottom: 10%; left: 10%; animation-duration: 7s; animation-delay: 4s; }
@keyframes blobFloat {
  0%, 100% { transform: translate(0, 0) scale(1); }
  50%       { transform: translate(20px, -20px) scale(1.08); }
}

/* ─── Petals ─── */
.petals-layer { position: absolute; inset: 0; pointer-events: none; overflow: hidden; }
.petal {
  position: absolute; top: -40px;
  border-radius: 50% 0; opacity: 0.25;
  animation: petalFall linear infinite;
}
@keyframes petalFall {
  0%   { transform: translateY(-40px) rotate(0deg);   opacity: 0.3; }
  100% { transform: translateY(110vh) rotate(720deg); opacity: 0; }
}

/* ─── Photo ─── */
.photo-wrap {
  position: relative;
  margin-bottom: 2rem;
  z-index: 2;
}
.photo-ring {
  width: min(240px, 68vw);
  height: min(240px, 68vw);
  border-radius: 50%;
  position: relative;
}
.photo-ring::before {
  content: '';
  position: absolute; inset: -8px;
  border-radius: 50%;
  background: conic-gradient(from 0deg, #ffaecf, #ffd97d, #ff7eb6, #f5d0fe, #ffaecf);
  animation: ringRotate 5s linear infinite;
  z-index: 0;
}
.photo-ring::after {
  content: '';
  position: absolute; inset: -3px;
  border-radius: 50%;
  background: linear-gradient(135deg, #ffd6e7, #f5d0fe);
  z-index: 1;
}
@keyframes ringRotate { to { transform: rotate(360deg); } }
.photo-ring img {
  position: relative; z-index: 2;
  width: 100%; height: 100%;
  border-radius: 50%;
  object-fit: cover; object-position: center top;
  filter: saturate(1.15) contrast(1.02);
  display: block;
}
.photo-hearts {
  position: absolute; inset: -20px;
  pointer-events: none; overflow: visible;
}
.float-heart {
  position: absolute;
  bottom: 0;
  animation: floatUp linear infinite;
  opacity: 0;
}
@keyframes floatUp {
  0%   { transform: translateY(0);      opacity: 0; }
  10%  { opacity: 0.7; }
  90%  { opacity: 0.4; }
  100% { transform: translateY(-200px); opacity: 0; }
}

/* ─── Text ─── */
.finale-name {
  font-family: var(--font-display);
  font-style: italic;
  font-weight: 900;
  font-size: clamp(2.2rem, 10vw, 3.5rem);
  color: var(--rose4);
  line-height: 1.15;
  margin-bottom: 1.2rem;
  position: relative; z-index: 2;
  filter: drop-shadow(0 2px 12px rgba(232, 64, 122, 0.2));
}
.finale-name em { color: var(--rose3); font-style: italic; }

.finale-text {
  font-family: var(--font-body);
  font-style: italic;
  font-size: clamp(0.88rem, 3.8vw, 1.1rem);
  line-height: 1.85;
  color: rgba(130, 30, 60, 0.72);
  max-width: 320px;
  margin: 0 auto 2rem;
  position: relative; z-index: 2;
}

/* ─── Signature card ─── */
.sig-card {
  background: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(20px);
  border-radius: 20px;
  padding: 1.8rem 1.5rem;
  max-width: 340px;
  width: 100%;
  margin: 0 auto 2.5rem;
  border: 1px solid rgba(255, 174, 207, 0.35);
  box-shadow: 0 8px 32px rgba(232, 64, 122, 0.1);
  position: relative; z-index: 2;
}
.sig-line {
  width: 40px; height: 1px;
  background: linear-gradient(90deg, transparent, var(--rose3), transparent);
  margin: 0.8rem auto;
}
.sig-msg {
  font-family: var(--font-display);
  font-style: italic;
  font-size: clamp(0.9rem, 3.8vw, 1.15rem);
  line-height: 1.7;
  color: var(--rose4);
}

/* ─── Heart ─── */
.heart-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.4rem;
  position: relative; z-index: 2;
  margin-bottom: 2.5rem;
}
.heart-btn {
  font-size: 3.8rem;
  background: none; border: none;
  cursor: pointer;
  line-height: 1;
  filter: drop-shadow(0 0 18px rgba(232, 64, 122, 0.4));
  animation: heartPulse 1.6s ease-in-out infinite;
  -webkit-tap-highlight-color: transparent;
  transition: transform 0.15s;
}
.heart-btn.beat { animation: heartBeat 0.4s ease; }
@keyframes heartPulse { 0%,100%{transform:scale(1)} 50%{transform:scale(1.1)} }
@keyframes heartBeat  { 0%{transform:scale(1)} 30%{transform:scale(1.4)} 60%{transform:scale(0.9)} 100%{transform:scale(1)} }

.heart-hint {
  font-family: var(--font-label);
  font-size: 0.48rem;
  letter-spacing: 0.3em;
  text-transform: uppercase;
  color: var(--rose3);
  opacity: 0.55;
}
.heart-counter {
  font-family: var(--font-display);
  font-style: italic;
  font-size: 0.85rem;
  color: var(--rose4);
  opacity: 0.75;
}

/* ─── Bottom strip ─── */
.bottom-strip {
  width: 100%;
  overflow: hidden;
  position: relative;
  z-index: 2;
  margin-bottom: 1.5rem;
}
.strip-inner {
  display: flex;
  gap: 0.6rem;
  width: max-content;
  animation: stripScroll 20s linear infinite;
  padding: 0 0.3rem;
}
@keyframes stripScroll {
  0%   { transform: translateX(0); }
  100% { transform: translateX(-50%); }
}
.strip-photo {
  flex-shrink: 0;
  width: 90px; height: 110px;
  border-radius: 8px;
  overflow: hidden;
  transform: rotate(var(--tilt));
  box-shadow: 0 6px 20px rgba(0,0,0,0.15);
  border: 3px solid rgba(255,255,255,0.8);
}
.strip-photo img {
  width: 100%; height: 100%;
  object-fit: cover; object-position: center top;
  filter: saturate(1.1);
}

/* ─── Footer ─── */
.final-footer {
  font-family: var(--font-label);
  font-size: 0.48rem;
  letter-spacing: 0.3em;
  text-transform: uppercase;
  color: rgba(200, 80, 120, 0.4);
  padding-bottom: 1.5rem;
  position: relative; z-index: 2;
}

/* ─── Reveal helpers ─── */
.reveal {
  opacity: 0;
  transform: translateY(28px);
  transition: opacity 0.8s ease, transform 0.8s cubic-bezier(0.22, 1, 0.36, 1);
}
.reveal.visible { opacity: 1; transform: translateY(0); }
.reveal-scale {
  opacity: 0;
  transform: scale(0.85);
  transition: opacity 0.9s ease, transform 0.9s cubic-bezier(0.22, 1, 0.36, 1);
}
.reveal-scale.visible { opacity: 1; transform: scale(1); }
</style>
