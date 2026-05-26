<template>
  <div class="gallery-page">
    <header class="gallery-header">
      <p class="section-eyebrow">✦ галерея ✦</p>
      <h2 class="section-title">Ева в кадре</h2>
    </header>

    <!-- Film strip row 1 -->
    <div class="strip-wrap">
      <div class="strip strip--left">
        <div
          v-for="f in [...row1, ...row1]"
          :key="f.src + Math.random()"
          class="frame"
          @click="frameTap(f.caption)"
        >
          <img :src="f.src" :alt="f.caption" />
          <div class="frame__caption">{{ f.caption }}</div>
        </div>
      </div>
    </div>

    <!-- Film strip row 2 -->
    <div class="strip-wrap">
      <div class="strip strip--right">
        <div
          v-for="f in [...row2, ...row2]"
          :key="f.src + Math.random()"
          class="frame"
          @click="frameTap(f.caption)"
        >
          <img :src="f.src" :alt="f.caption" />
          <div class="frame__caption">{{ f.caption }}</div>
        </div>
      </div>
    </div>

    <!-- Polaroid grid -->
    <div class="polaroid-section">
      <p class="section-eyebrow">✦ любимые кадры ✦</p>
      <div class="polaroid-grid">
        <div
          v-for="(p, i) in polaroids"
          :key="i"
          class="polaroid"
          :class="{ visible: p.visible }"
          :ref="el => polaroidRefs[i] = el"
          :style="{ '--tilt': p.tilt + 'deg' }"
          @click="polaroidTap(i, $event)"
        >
          <img :src="p.src" :alt="p.label" />
          <div class="polaroid__label">{{ p.label }}</div>
        </div>
      </div>
    </div>

    <!-- Big quote -->
    <div class="quote-section">
      <div class="quote-card" :class="{ visible: quoteVisible }" ref="quoteRef">
        <div class="quote-mark">"</div>
        <blockquote class="quote-text">
          Ты — не просто выпускница.<br/>
          Ты — целая поэма, написанная светом.
        </blockquote>
        <cite class="quote-attr">— для тебя, Ева</cite>
      </div>
    </div>

    <!-- Navigate next -->
    <div class="page-footer">
      <router-link to="/letters" class="next-btn">
        Читать письма ✦
      </router-link>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { spawnSpark, say, useReveal } from '../composables/useEffects.js'

const row1 = [
  { src: '/photos/p1.jpg', caption: 'взгляд' },
  { src: '/photos/p4.jpg', caption: 'задумчивая' },
  { src: '/photos/p7.jpg', caption: 'нежность' },
  { src: '/photos/p11.jpg', caption: 'розовая' },
]
const row2 = [
  { src: '/photos/p2.jpg', caption: 'ввысь' },
  { src: '/photos/p5.jpg', caption: 'привет!' },
  { src: '/photos/p10.jpg', caption: 'локон' },
  { src: '/photos/p6.jpg', caption: 'поцелуй' },
]

const polaroids = ref([
  { src: '/photos/p1.jpg',  label: '💖 взгляд',      tilt: -3,  visible: false },
  { src: '/photos/p10.jpg', label: '🌸 розовая',      tilt:  2,  visible: false },
  { src: '/photos/p4.jpg',  label: '✦ задумчивая',   tilt: -1.5, visible: false },
  { src: '/photos/p6.jpg',  label: '💋 поцелуй',     tilt:  3,  visible: false },
])

const polaroidRefs = ref({})
const quoteRef = ref(null)
const quoteVisible = ref(false)

const { observe, cleanup } = useReveal(0.2)

function frameTap(caption) { say('✦ ' + caption) }

function polaroidTap(i, e) {
  spawnSpark(e.clientX, e.clientY, 7)
  const msgs = ['💖 ты прекрасна','✦ мой любимый кадр','🌸 невозможно оторваться','✦ просто смотрю']
  say(msgs[i % msgs.length])
}

onMounted(() => {
  polaroids.value.forEach((_, i) => {
    observe(polaroidRefs.value[i], () => {
      setTimeout(() => { polaroids.value[i].visible = true }, i * 120)
    })
  })
  observe(quoteRef.value, () => { quoteVisible.value = true })
})
onUnmounted(cleanup)
</script>

<style scoped>
.gallery-page {
  min-height: 100svh;
  background: linear-gradient(180deg, #1a0010 0%, #2d0020 60%, #1a0010 100%);
  color: var(--rose);
  padding-top: 3rem;
}

/* ─── Header ─── */
.gallery-header {
  text-align: center;
  padding: 0 1.5rem 2.5rem;
}
.section-eyebrow {
  font-family: var(--font-label);
  font-size: 0.5rem;
  letter-spacing: 0.35em;
  text-transform: uppercase;
  color: var(--rose3);
  opacity: 0.7;
  margin-bottom: 0.6rem;
}
.section-title {
  font-family: var(--font-display);
  font-style: italic;
  font-weight: 900;
  font-size: clamp(2rem, 8vw, 3rem);
  background: linear-gradient(135deg, var(--rose2), var(--gold));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

/* ─── Film strip ─── */
.strip-wrap {
  overflow: hidden;
  position: relative;
  padding: 0.6rem 0;
}
.strip-wrap::before,
.strip-wrap::after {
  content: '';
  position: absolute;
  top: 0; bottom: 0;
  width: 50px;
  z-index: 2;
  pointer-events: none;
}
.strip-wrap::before { left: 0;  background: linear-gradient(90deg,  #1a0010, transparent); }
.strip-wrap::after  { right: 0; background: linear-gradient(-90deg, #1a0010, transparent); }

.strip {
  display: flex;
  gap: 0.8rem;
  width: max-content;
  padding: 0 1rem;
}
.strip--left  { animation: filmLeft  28s linear infinite; }
.strip--right { animation: filmRight 24s linear infinite; }
@keyframes filmLeft  { 0% { transform: translateX(0); }    100% { transform: translateX(-50%); } }
@keyframes filmRight { 0% { transform: translateX(-50%); } 100% { transform: translateX(0); } }

.frame {
  flex-shrink: 0;
  width: 150px;
  height: 200px;
  border-radius: 8px;
  overflow: hidden;
  position: relative;
  cursor: pointer;
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.5);
  transition: transform 0.3s;
}
.frame:active { transform: scale(0.95); }
.frame img {
  width: 100%; height: 100%;
  object-fit: cover;
  object-position: center top;
  filter: saturate(1.2) brightness(0.9);
}
.frame::after {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(180deg, transparent 45%, rgba(232, 64, 122, 0.25) 100%);
}
.frame__caption {
  position: absolute;
  bottom: 0.6rem;
  left: 0; right: 0;
  text-align: center;
  font-family: var(--font-label);
  font-size: 0.48rem;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: rgba(255, 214, 231, 0.65);
  z-index: 1;
}

/* ─── Polaroid grid ─── */
.polaroid-section {
  padding: 3rem 1.2rem 1rem;
}
.polaroid-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  max-width: 420px;
  margin: 1.5rem auto 0;
}
.polaroid {
  background: #fff;
  border-radius: 4px;
  padding: 0.5rem 0.5rem 2.2rem;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.4);
  transform: rotate(var(--tilt)) scale(0.9);
  opacity: 0;
  transition: opacity 0.6s ease, transform 0.6s cubic-bezier(0.22, 1, 0.36, 1);
  cursor: pointer;
  -webkit-tap-highlight-color: transparent;
}
.polaroid.visible {
  opacity: 1;
  transform: rotate(var(--tilt)) scale(1);
}
.polaroid:active { transform: rotate(var(--tilt)) scale(0.95) !important; }
.polaroid img {
  width: 100%; aspect-ratio: 1;
  object-fit: cover;
  object-position: center top;
  display: block;
  border-radius: 2px;
}
.polaroid__label {
  text-align: center;
  font-family: var(--font-display);
  font-style: italic;
  font-size: 0.72rem;
  color: rgba(80, 20, 40, 0.7);
  margin-top: 0.5rem;
}

/* ─── Quote ─── */
.quote-section {
  padding: 2rem 1.5rem 3rem;
}
.quote-card {
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(255, 174, 207, 0.2);
  border-radius: 20px;
  padding: 2.5rem 1.8rem;
  max-width: 380px;
  margin: 0 auto;
  text-align: center;
  position: relative;
  opacity: 0;
  transform: translateY(30px);
  transition: opacity 0.9s ease, transform 0.9s cubic-bezier(0.22, 1, 0.36, 1);
}
.quote-card.visible { opacity: 1; transform: translateY(0); }
.quote-mark {
  font-family: var(--font-display);
  font-size: 5rem;
  line-height: 0.6;
  color: var(--rose3);
  opacity: 0.25;
  position: absolute;
  top: 1.2rem; left: 1.2rem;
}
.quote-text {
  font-family: var(--font-display);
  font-style: italic;
  font-size: clamp(1.1rem, 4.5vw, 1.5rem);
  line-height: 1.6;
  color: var(--rose);
  font-weight: 400;
}
.quote-attr {
  display: block;
  margin-top: 1rem;
  font-family: var(--font-label);
  font-size: 0.52rem;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: var(--rose3);
  opacity: 0.6;
  font-style: normal;
}

/* ─── Footer nav ─── */
.page-footer {
  text-align: center;
  padding: 0 1.5rem 2rem;
}
.next-btn {
  display: inline-block;
  font-family: var(--font-label);
  font-size: 0.62rem;
  font-weight: 700;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  text-decoration: none;
  color: var(--rose4);
  border: 1px solid rgba(255, 126, 182, 0.35);
  border-radius: 50px;
  padding: 0.8rem 2rem;
  transition: background 0.3s, color 0.3s;
}
.next-btn:active {
  background: rgba(255, 126, 182, 0.15);
}
</style>
