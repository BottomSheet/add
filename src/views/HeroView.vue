<template>
  <div class="hero-page" @touchmove.passive="onTouchMove">
    <!-- Falling petals -->
    <div class="petals-layer" aria-hidden="true">
      <div
        v-for="p in petals" :key="p.id"
        class="petal"
        :style="{
          left: p.x + '%',
          background: p.color,
          width: p.size + 'px',
          height: p.size + 'px',
          animationDuration: p.dur + 's',
          animationDelay: p.delay + 's',
        }"
      />
    </div>

    <!-- Decorative rings -->
    <div class="ring ring-1" aria-hidden="true" />
    <div class="ring ring-2" aria-hidden="true" />
    <div class="ring ring-3" aria-hidden="true" />

    <!-- Content -->
    <div class="hero-content">
      <div class="hero-badge">✦ выпускница 2026 ✦</div>

      <!-- Photo ring -->
      <div class="photo-ring" @click="photoTap">
        <img src="/photos/p7.jpg" alt="Ева" class="photo-ring__img" />
      </div>

      <!-- Name -->
      <h1 class="hero-name" @click="nameTap">ЕВА</h1>

      <p class="hero-tagline">одиннадцать лет — и вот этот день</p>

      <div class="hero-year">
        <span>2015</span>
        <div class="year-line" />
        <span>2026</span>
      </div>

      <router-link to="/gallery" class="hero-cta">
        <span>Открыть ✦</span>
      </router-link>
    </div>

    <!-- Scroll hint -->
    <div class="scroll-hint" aria-hidden="true">
      <span>листай</span>
      <div class="scroll-dot" />
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { spawnSpark, say, useTouchTrail } from '../composables/useEffects.js'

const { onTouchMove } = useTouchTrail()

// ── Petals ──────────────────────────────────────────────────────────────────
const PETAL_COLORS = ['#ffb8d4','#ffd6e7','#f5d0fe','#ffaecf','#ffd97d','#ff7eb6']
const petals = Array.from({ length: 20 }, (_, i) => ({
  id: i,
  x:     Math.random() * 100,
  color: PETAL_COLORS[Math.floor(Math.random() * PETAL_COLORS.length)],
  size:  8 + Math.random() * 14,
  dur:   5 + Math.random() * 8,
  delay: -Math.random() * 12,
}))

// ── Interactions ─────────────────────────────────────────────────────────────
function nameTap(e) {
  spawnSpark(e.clientX, e.clientY, 14)
  say('✦ ЕВА ✦')
}

function photoTap(e) {
  spawnSpark(e.clientX, e.clientY, 8)
  say('💖 Такая красивая!')
}
</script>

<style scoped>
.hero-page {
  min-height: 100svh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
  background: linear-gradient(160deg, #fff0f7 0%, #ffe4f0 35%, #ffd6e7 65%, #f5d0fe 100%);
  padding: 0 1.5rem 6rem;
}

/* ─── Petals ─── */
.petals-layer {
  position: absolute;
  inset: 0;
  pointer-events: none;
  overflow: hidden;
}
.petal {
  position: absolute;
  top: -40px;
  border-radius: 50% 0;
  opacity: 0.28;
  animation: petalFall linear infinite;
}
@keyframes petalFall {
  0%   { transform: translateY(-40px) rotate(0deg);    opacity: 0.32; }
  100% { transform: translateY(110vh) rotate(720deg);  opacity: 0; }
}

/* ─── Rings ─── */
.ring {
  position: absolute;
  border-radius: 50%;
  border: 1px solid rgba(255, 126, 182, 0.18);
  animation: ringPulse 4s ease-in-out infinite;
  pointer-events: none;
}
.ring-1 { width: 340px; height: 340px; animation-delay: 0s; }
.ring-2 { width: 500px; height: 500px; animation-delay: 1.3s; }
.ring-3 { width: 680px; height: 680px; animation-delay: 2.6s; }
@keyframes ringPulse {
  0%, 100% { opacity: 0.4; transform: scale(1); }
  50%       { opacity: 0.8; transform: scale(1.03); }
}

/* ─── Content ─── */
.hero-content {
  position: relative;
  z-index: 2;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 0;
}

.hero-badge {
  font-family: var(--font-label);
  font-size: 0.5rem;
  letter-spacing: 0.35em;
  text-transform: uppercase;
  color: var(--rose4);
  background: rgba(255, 126, 182, 0.12);
  border: 1px solid rgba(255, 126, 182, 0.3);
  border-radius: 50px;
  padding: 0.5rem 1.2rem;
  margin-bottom: 1.5rem;
  animation: fadeUp 0.7s 0.1s both;
}

/* ─── Photo ring ─── */
.photo-ring {
  width: min(240px, 68vw);
  height: min(240px, 68vw);
  border-radius: 50%;
  position: relative;
  cursor: pointer;
  margin-bottom: 1.8rem;
  animation: fadeUp 0.7s 0.25s both;
}
.photo-ring::before {
  content: '';
  position: absolute;
  inset: -7px;
  border-radius: 50%;
  background: conic-gradient(from 0deg, #ffaecf, #ffd97d, #ff7eb6, #f5d0fe, #ffaecf);
  animation: ringRotate 4s linear infinite;
  z-index: 0;
}
.photo-ring::after {
  content: '';
  position: absolute;
  inset: -3px;
  border-radius: 50%;
  background: var(--cream);
  z-index: 1;
}
@keyframes ringRotate { to { transform: rotate(360deg); } }

.photo-ring__img {
  position: relative;
  z-index: 2;
  width: 100%;
  height: 100%;
  border-radius: 50%;
  object-fit: cover;
  object-position: center top;
  filter: saturate(1.1) contrast(1.02);
}

/* ─── Name ─── */
.hero-name {
  font-family: var(--font-display);
  font-style: italic;
  font-weight: 900;
  font-size: clamp(5.5rem, 32vw, 10rem);
  line-height: 0.85;
  background: linear-gradient(135deg, #e8407a 0%, #ff7eb6 30%, #ffaecf 55%, #ffd97d 75%, #ff7eb6 100%);
  background-size: 300%;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  animation: nameReveal 1.1s cubic-bezier(0.22, 1, 0.36, 1) 0.15s both,
             nameShimmer 5s linear 1.3s infinite;
  filter: drop-shadow(0 4px 28px rgba(232, 64, 122, 0.22));
  cursor: pointer;
  user-select: none;
}
@keyframes nameReveal {
  from { opacity: 0; transform: scale(0.85) translateY(40px); }
  to   { opacity: 1; transform: scale(1)    translateY(0); }
}
@keyframes nameShimmer {
  0%   { background-position: 0%; }
  100% { background-position: 300%; }
}

.hero-tagline {
  font-family: var(--font-display);
  font-style: italic;
  font-size: clamp(0.85rem, 3.8vw, 1.25rem);
  color: var(--rose4);
  opacity: 0.7;
  margin-top: 0.6rem;
  animation: fadeUp 0.7s 0.5s both;
}

/* ─── Year bar ─── */
.hero-year {
  display: flex;
  align-items: center;
  gap: 0.8rem;
  margin: 1rem 0 2rem;
  animation: fadeUp 0.7s 0.6s both;
  font-family: var(--font-label);
  font-size: 0.6rem;
  font-weight: 200;
  letter-spacing: 0.2em;
  color: var(--rose3);
  opacity: 0.6;
}
.year-line {
  flex: 1;
  width: 80px;
  height: 1px;
  background: linear-gradient(90deg, transparent, var(--rose3), transparent);
}

/* ─── CTA ─── */
.hero-cta {
  display: inline-block;
  font-family: var(--font-label);
  font-size: 0.65rem;
  font-weight: 700;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  text-decoration: none;
  color: #fff;
  background: linear-gradient(135deg, var(--rose3), var(--rose4));
  border-radius: 50px;
  padding: 0.9rem 2.6rem;
  box-shadow: 0 8px 30px rgba(232, 64, 122, 0.3);
  animation: fadeUp 0.7s 0.75s both;
  position: relative;
  overflow: hidden;
  transition: transform 0.2s, box-shadow 0.2s;
  -webkit-tap-highlight-color: transparent;
}
.hero-cta::before {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, rgba(255,255,255,0.2), transparent);
  border-radius: 50px;
}
.hero-cta:active { transform: scale(0.95); box-shadow: 0 4px 18px rgba(232, 64, 122, 0.2); }

/* ─── Scroll hint ─── */
.scroll-hint {
  position: absolute;
  bottom: 5.5rem;
  left: 50%;
  transform: translateX(-50%);
  font-family: var(--font-label);
  font-size: 0.48rem;
  letter-spacing: 0.25em;
  text-transform: uppercase;
  color: var(--rose3);
  opacity: 0.45;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.4rem;
  animation: fadeUp 0.7s 1.2s both;
}
.scroll-dot {
  width: 4px; height: 4px;
  border-radius: 50%;
  background: var(--rose3);
  animation: scrollBounce 1.4s ease-in-out infinite;
}
@keyframes scrollBounce {
  0%, 100% { transform: translateY(0); opacity: 0.4; }
  50%       { transform: translateY(8px); opacity: 1; }
}

@keyframes fadeUp {
  from { opacity: 0; transform: translateY(24px); }
  to   { opacity: 1; transform: translateY(0); }
}
</style>
