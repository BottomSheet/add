<template>
  <div class="mosaic-page">
    <header class="mosaic-header">
      <p class="eyebrow">✦ фотоальбом ✦</p>
      <h2 class="title">Ты такая красивая</h2>
    </header>

    <div class="mosaic-grid">
      <div
        v-for="(item, i) in items"
        :key="i"
        class="mosaic-item"
        :class="[item.span, { visible: item.visible }]"
        :ref="el => itemRefs[i] = el"
        :style="{ transitionDelay: (i * 0.1) + 's' }"
        @click="itemTap(i, $event)"
      >
        <img :src="item.src" :alt="item.caption" />
        <div class="mosaic-overlay" />
        <div class="mosaic-caption">{{ item.caption }}</div>

        <!-- tap ripple -->
        <div v-if="item.ripple" class="ripple"
          :style="{ left: item.rippleX + 'px', top: item.rippleY + 'px' }" />
      </div>
    </div>

    <!-- full-screen viewer -->
    <transition name="viewer">
      <div v-if="viewing !== null" class="viewer" @click="viewing = null">
        <img :src="items[viewing]?.src" :alt="items[viewing]?.caption" />
        <div class="viewer-caption">{{ items[viewing]?.caption }}</div>
        <button class="viewer-close" @click.stop="viewing = null">✕</button>
      </div>
    </transition>

    <div class="page-footer">
      <router-link to="/wishes" class="next-btn">Загадать желания ✦</router-link>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { spawnSpark, say, useReveal } from '../composables/useEffects.js'

const viewing = ref(null)

const items = ref([
  { src: '/photos/p11.jpg', caption: 'всё впереди',   span: 'wide', visible: false, ripple: false },
  { src: '/photos/p1.jpg',  caption: 'взгляд',        span: 'tall', visible: false, ripple: false },
  { src: '/photos/p2.jpg',  caption: 'ввысь',         span: 'sq',   visible: false, ripple: false },
  { src: '/photos/p4.jpg',  caption: 'задумчивая',    span: 'tall', visible: false, ripple: false },
  { src: '/photos/p5.jpg',  caption: 'привет!',       span: 'sq',   visible: false, ripple: false },
  { src: '/photos/p7.jpg',  caption: 'нежность',      span: 'wide', visible: false, ripple: false },
  { src: '/photos/p10.jpg', caption: 'розовые локоны', span: 'sq',  visible: false, ripple: false },
  { src: '/photos/p6.jpg',  caption: 'воздушный поцелуй', span: 'sq', visible: false, ripple: false },
])

const itemRefs = ref({})
const { observe, cleanup } = useReveal(0.15)

function itemTap(i, e) {
  spawnSpark(e.clientX, e.clientY, 6)
  const msgs = ['💖 ты прекрасна','✦ мой любимый кадр','🌸 не могу оторваться','✦ просто смотрю','💫 красота!']
  say(msgs[i % msgs.length])

  // ripple
  const rect = e.currentTarget.getBoundingClientRect()
  items.value[i].rippleX = e.clientX - rect.left
  items.value[i].rippleY = e.clientY - rect.top
  items.value[i].ripple = true
  setTimeout(() => { items.value[i].ripple = false }, 600)

  // open viewer on second tap
  viewing.value = i
}

onMounted(() => {
  items.value.forEach((_, i) => {
    observe(itemRefs.value[i], () => {
      setTimeout(() => { items.value[i].visible = true }, i * 90)
    })
  })
})
onUnmounted(cleanup)
</script>

<style scoped>
.mosaic-page {
  min-height: 100svh;
  background: linear-gradient(180deg, #1a0010, #3d0028, #1a0010);
  padding: 3rem 0 2rem;
}

/* ─── Header ─── */
.mosaic-header {
  text-align: center;
  padding: 0 1.5rem 2rem;
}
.eyebrow {
  font-family: var(--font-label);
  font-size: 0.5rem;
  letter-spacing: 0.35em;
  text-transform: uppercase;
  color: var(--rose3);
  opacity: 0.7;
  margin-bottom: 0.6rem;
}
.title {
  font-family: var(--font-display);
  font-style: italic;
  font-weight: 900;
  font-size: clamp(1.8rem, 7vw, 2.8rem);
  background: linear-gradient(135deg, var(--rose2), var(--gold));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

/* ─── Mosaic grid ─── */
.mosaic-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.6rem;
  padding: 0 0.8rem;
  max-width: 480px;
  margin: 0 auto;
}
.mosaic-item {
  border-radius: 14px;
  overflow: hidden;
  position: relative;
  cursor: pointer;
  opacity: 0;
  transform: scale(0.9);
  transition: opacity 0.6s ease, transform 0.6s cubic-bezier(0.22, 1, 0.36, 1),
              box-shadow 0.3s;
}
.mosaic-item.visible { opacity: 1; transform: scale(1); }
.mosaic-item:active   { transform: scale(0.96) !important; }

.mosaic-item.wide { grid-column: 1 / -1; aspect-ratio: 16 / 7; }
.mosaic-item.tall { aspect-ratio: 2 / 3; }
.mosaic-item.sq   { aspect-ratio: 1; }

.mosaic-item img {
  width: 100%; height: 100%;
  object-fit: cover;
  object-position: center top;
  filter: saturate(1.15) brightness(0.92);
  transition: transform 0.5s ease, filter 0.4s;
  display: block;
}
.mosaic-item.visible:hover img {
  transform: scale(1.04);
  filter: saturate(1.3) brightness(1);
}

.mosaic-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(180deg, transparent 40%, rgba(26, 0, 16, 0.65));
  opacity: 0;
  transition: opacity 0.5s;
}
.mosaic-item.visible .mosaic-overlay { opacity: 1; }

.mosaic-caption {
  position: absolute;
  bottom: 0.6rem; left: 0.8rem; right: 0.8rem;
  font-family: var(--font-label);
  font-size: 0.46rem;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: rgba(255, 214, 231, 0.7);
}

/* ripple */
.ripple {
  position: absolute;
  width: 80px; height: 80px;
  border-radius: 50%;
  margin: -40px 0 0 -40px;
  background: rgba(255, 255, 255, 0.3);
  animation: rippleOut 0.6s ease forwards;
  pointer-events: none;
}
@keyframes rippleOut {
  to { transform: scale(3); opacity: 0; }
}

/* ─── Viewer ─── */
.viewer {
  position: fixed;
  inset: 0;
  z-index: 800;
  background: rgba(10, 0, 7, 0.95);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem;
}
.viewer img {
  max-width: 100%;
  max-height: 70svh;
  border-radius: 12px;
  object-fit: contain;
}
.viewer-caption {
  margin-top: 1rem;
  font-family: var(--font-display);
  font-style: italic;
  font-size: 1rem;
  color: var(--rose2);
}
.viewer-close {
  position: absolute;
  top: 1.2rem; right: 1.5rem;
  background: none; border: none;
  color: var(--rose2); font-size: 1.4rem;
  cursor: pointer; padding: 0.5rem;
}
.viewer-enter-active, .viewer-leave-active {
  transition: opacity 0.3s ease;
}
.viewer-enter-from, .viewer-leave-to { opacity: 0; }

/* ─── Footer nav ─── */
.page-footer {
  text-align: center;
  padding: 2rem 1.5rem;
}
.next-btn {
  display: inline-block;
  font-family: var(--font-label);
  font-size: 0.62rem;
  font-weight: 700;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  text-decoration: none;
  color: var(--rose2);
  border: 1px solid rgba(255, 174, 207, 0.3);
  border-radius: 50px;
  padding: 0.8rem 2rem;
}
.next-btn:active { background: rgba(255, 126, 182, 0.1); }
</style>
