<template>
  <div class="game-page">
    <!-- Score -->
    <div class="score-bar">
      <div class="score-item">
        <span class="score-label">Поймано</span>
        <span class="score-num">{{ popCount }}</span>
      </div>
      <div class="score-item">
        <span class="score-label">Цель</span>
        <span class="score-num">{{ goal }}</span>
      </div>
      <div class="score-item">
        <span class="score-label">Время</span>
        <span class="score-num" :class="{ urgent: timeLeft <= 10 }">{{ timeLeft }}с</span>
      </div>
    </div>

    <!-- Arena -->
    <div class="arena" ref="arenaRef" @click.self="missClick">
      <!-- Balloons -->
      <div
        v-for="b in balloons"
        :key="b.id"
        class="balloon"
        :class="{ popping: b.popping }"
        :style="{
          left: b.x + '%',
          bottom: b.started ? '110%' : '-10%',
          fontSize: b.size + 'rem',
          transition: b.started ? `bottom ${b.dur}s linear` : 'none',
          '--rot': b.rot + 'deg',
        }"
        @click.stop="popBalloon(b, $event)"
        @touchstart.stop.prevent="popBalloon(b, $event.touches[0])"
      >{{ b.emoji }}</div>

      <!-- Particles on pop -->
      <div
        v-for="p in particles"
        :key="p.id"
        class="particle"
        :style="{ left: p.x + 'px', top: p.y + 'px', '--tx': p.tx + 'px', '--ty': p.ty + 'px', '--c': p.c }"
      />

      <!-- State overlays -->
      <transition name="overlay-fade">
        <div v-if="phase === 'idle'" class="overlay">
          <p class="overlay-eyebrow">✦ мини-игра ✦</p>
          <h2 class="overlay-title">Лопни шарики!</h2>
          <p class="overlay-sub">Поймай {{ goal }} шариков за {{ totalTime }} секунд</p>
          <button class="overlay-btn" @click="startGame">Начать ✦</button>
        </div>
      </transition>

      <transition name="overlay-fade">
        <div v-if="phase === 'end'" class="overlay overlay--end">
          <div class="result-emoji">{{ result.emoji }}</div>
          <h2 class="overlay-title">{{ result.title }}</h2>
          <p class="overlay-sub">Ты лопнула {{ popCount }} шариков!</p>
          <p class="result-msg">{{ result.msg }}</p>
          <button class="overlay-btn" @click="resetGame">Ещё раз ✦</button>
        </div>
      </transition>
    </div>

    <!-- Combo display -->
    <transition name="combo-anim">
      <div v-if="combo >= 3" class="combo-badge">
        🔥 COMBO ×{{ combo }}
      </div>
    </transition>

    <div class="page-footer">
      <router-link to="/finale" class="next-btn">Финал ✦</router-link>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onUnmounted } from 'vue'
import { spawnSpark, say, launchConfetti } from '../composables/useEffects.js'

// ── Config ───────────────────────────────────────────────────────────────────
const goal      = 25
const totalTime = 40
const EMOJIS = ['🎈','🎀','🌸','💖','✨','🌷','🦋','💫','🩷','🫶','⭐','🌟']
const COLORS = ['#ffb8d4','#ff85b3','#ffd97d','#f5d0fe','#ffaecf','#ff7eb6']

// ── State ────────────────────────────────────────────────────────────────────
const phase     = ref('idle')   // idle | playing | end
const balloons  = ref([])
const particles = ref([])
const popCount  = ref(0)
const timeLeft  = ref(totalTime)
const combo     = ref(0)
const arenaRef  = ref(null)

let balloonId  = 0
let particleId = 0
let spawnTimer = null
let countdown  = null
let comboTimer = null

// ── Result ───────────────────────────────────────────────────────────────────
const result = computed(() => {
  const n = popCount.value
  if (n >= goal)    return { emoji: '🏆', title: 'Победа!',       msg: 'Ты настоящий мастер шариков, Ева! ✦', }
  if (n >= goal*.7) return { emoji: '🌸', title: 'Почти!',        msg: 'Ещё чуть-чуть — и ты бы всё поймала!', }
  if (n >= goal*.4) return { emoji: '💫', title: 'Неплохо!',      msg: 'Хорошая попытка, попробуй ещё!', }
  return                      { emoji: '🎀', title: 'Ещё раз?',   msg: 'Шарики оказались хитрыми 😄', }
})

// ── Game flow ─────────────────────────────────────────────────────────────────
function startGame() {
  phase.value    = 'playing'
  popCount.value = 0
  timeLeft.value = totalTime
  combo.value    = 0
  balloons.value = []

  spawnTimer = setInterval(spawnBalloon, 700)
  spawnBalloon(); spawnBalloon(); spawnBalloon()

  countdown = setInterval(() => {
    timeLeft.value--
    if (timeLeft.value <= 0) endGame()
  }, 1000)
}

function endGame() {
  clearInterval(spawnTimer)
  clearInterval(countdown)
  phase.value = 'end'
  if (popCount.value >= goal) {
    setTimeout(launchConfetti, 200)
    say('🏆 Ты поймала всё! Ева — чемпион!')
  } else {
    say('Время вышло! Ты лопнула ' + popCount.value + ' шариков!')
  }
}

function resetGame() {
  balloons.value  = []
  particles.value = []
  combo.value     = 0
  phase.value     = 'idle'
}

// ── Balloon logic ─────────────────────────────────────────────────────────────
function spawnBalloon() {
  if (phase.value !== 'playing') return
  const id = balloonId++
  const b = reactive({
    id,
    x:       5 + Math.random() * 87,
    emoji:   EMOJIS[Math.floor(Math.random() * EMOJIS.length)],
    dur:     3 + Math.random() * 4,
    size:    1.6 + Math.random() * 1.2,
    rot:     (Math.random() - 0.5) * 20,
    popping: false,
    started: false,
  })
  balloons.value.push(b)
  // trigger CSS transition on next tick
  requestAnimationFrame(() => { b.started = true })
  setTimeout(() => {
    balloons.value = balloons.value.filter(x => x.id !== id)
  }, (b.dur + 0.5) * 1000)
}

function popBalloon(b, e) {
  if (b.popping || phase.value !== 'playing') return
  b.popping = true

  // position
  const cx = e.clientX ?? e.pageX
  const cy = e.clientY ?? e.pageY
  spawnSpark(cx, cy, 8)
  spawnParticles(cx, cy)

  popCount.value++
  combo.value++
  clearTimeout(comboTimer)
  comboTimer = setTimeout(() => { combo.value = 0 }, 1000)

  const msgs = ['💥 Хоп!','🌸 Пух!','✦ Пых!','🎀 Поп!','💖 Ура!','✨ Есть!']
  if (combo.value >= 5) say('🔥 COMBO ×' + combo.value + '!')
  else say(msgs[Math.floor(Math.random() * msgs.length)])

  setTimeout(() => {
    balloons.value = balloons.value.filter(x => x.id !== b.id)
  }, 320)

  if (popCount.value >= goal) endGame()
}

function spawnParticles(cx, cy) {
  for (let i = 0; i < 10; i++) {
    const id = particleId++
    const a = Math.random() * Math.PI * 2
    const d = 25 + Math.random() * 55
    particles.value.push({
      id,
      x: cx, y: cy,
      tx: Math.cos(a) * d,
      ty: Math.sin(a) * d,
      c: COLORS[Math.floor(Math.random() * COLORS.length)],
    })
    setTimeout(() => {
      particles.value = particles.value.filter(p => p.id !== id)
    }, 600)
  }
}

function missClick() {
  if (phase.value !== 'playing') return
  combo.value = 0
}

onUnmounted(() => {
  clearInterval(spawnTimer)
  clearInterval(countdown)
  clearTimeout(comboTimer)
})
</script>

<style scoped>
.game-page {
  min-height: 100svh;
  background: linear-gradient(180deg, #1a0010, #3d0028, #200015);
  display: flex;
  flex-direction: column;
  align-items: center;
  overflow: hidden;
}

/* ─── Score bar ─── */
.score-bar {
  width: 100%;
  display: flex;
  justify-content: space-around;
  padding: 1.2rem 1rem 0.8rem;
  position: relative;
  z-index: 10;
}
.score-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.15rem;
}
.score-label {
  font-family: var(--font-label);
  font-size: 0.44rem;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: rgba(255, 174, 207, 0.5);
}
.score-num {
  font-family: var(--font-label);
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--rose2);
  transition: color 0.3s;
}
.score-num.urgent { color: #ff4444; animation: urgentPulse 0.5s ease-in-out infinite; }
@keyframes urgentPulse { 0%,100%{opacity:1} 50%{opacity:0.5} }

/* ─── Arena ─── */
.arena {
  flex: 1;
  width: 100%;
  max-width: 480px;
  position: relative;
  overflow: hidden;
  min-height: 65svh;
  cursor: crosshair;
}

/* ─── Balloons ─── */
.balloon {
  position: absolute;
  cursor: pointer;
  -webkit-tap-highlight-color: transparent;
  user-select: none;
  will-change: transform, bottom;
  transform: rotate(var(--rot));
  transition: transform 0.2s;
  z-index: 5;
  filter: drop-shadow(0 4px 12px rgba(0,0,0,0.3));
}
.balloon:active { transform: rotate(var(--rot)) scale(1.2); }
.balloon.popping {
  animation: popAnim 0.32s ease forwards !important;
  pointer-events: none;
}
@keyframes popAnim {
  0%   { transform: rotate(var(--rot)) scale(1);   opacity: 1; }
  40%  { transform: rotate(var(--rot)) scale(1.6); opacity: 0.8; }
  100% { transform: rotate(var(--rot)) scale(0);   opacity: 0; }
}

/* ─── Particles ─── */
.particle {
  position: fixed;
  width: 8px; height: 8px;
  border-radius: 50%;
  background: var(--c);
  pointer-events: none;
  z-index: 20;
  animation: partFly 0.6s ease forwards;
}
@keyframes partFly {
  0%   { transform: translate(0,0) scale(1); opacity: 1; }
  100% { transform: translate(var(--tx), var(--ty)) scale(0); opacity: 0; }
}

/* ─── Overlays ─── */
.overlay {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.8rem;
  padding: 2rem;
  background: rgba(26, 0, 16, 0.88);
  backdrop-filter: blur(12px);
  z-index: 50;
  text-align: center;
}
.overlay--end { background: rgba(26, 0, 16, 0.92); }

.overlay-eyebrow {
  font-family: var(--font-label);
  font-size: 0.5rem;
  letter-spacing: 0.35em;
  text-transform: uppercase;
  color: var(--rose3);
  opacity: 0.7;
}
.overlay-title {
  font-family: var(--font-display);
  font-style: italic;
  font-weight: 900;
  font-size: clamp(2rem, 8vw, 3rem);
  color: var(--rose);
}
.overlay-sub {
  font-family: var(--font-body);
  font-style: italic;
  font-size: 0.9rem;
  color: rgba(255, 214, 231, 0.65);
}
.result-emoji { font-size: 3.5rem; }
.result-msg {
  font-family: var(--font-display);
  font-style: italic;
  font-size: 1rem;
  color: var(--rose2);
  max-width: 280px;
}

.overlay-btn {
  margin-top: 0.5rem;
  font-family: var(--font-label);
  font-size: 0.65rem;
  font-weight: 700;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: #fff;
  background: linear-gradient(135deg, var(--rose3), var(--rose4));
  border: none;
  border-radius: 50px;
  padding: 0.9rem 2.4rem;
  cursor: pointer;
  box-shadow: 0 8px 28px rgba(232, 64, 122, 0.35);
  transition: transform 0.2s;
  -webkit-tap-highlight-color: transparent;
}
.overlay-btn:active { transform: scale(0.95); }

/* overlay transitions */
.overlay-fade-enter-active, .overlay-fade-leave-active { transition: opacity 0.4s ease; }
.overlay-fade-enter-from, .overlay-fade-leave-to { opacity: 0; }

/* ─── Combo badge ─── */
.combo-badge {
  position: fixed;
  top: 6rem;
  left: 50%;
  transform: translateX(-50%);
  z-index: 100;
  font-family: var(--font-label);
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.1em;
  color: #fff;
  background: linear-gradient(135deg, var(--rose4), #c23265);
  border-radius: 50px;
  padding: 0.5rem 1.4rem;
  box-shadow: 0 6px 20px rgba(232, 64, 122, 0.5);
  white-space: nowrap;
}
.combo-anim-enter-active { transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1); }
.combo-anim-leave-active  { transition: all 0.25s ease; }
.combo-anim-enter-from { transform: translateX(-50%) scale(0.7); opacity: 0; }
.combo-anim-leave-to   { transform: translateX(-50%) scale(0.7); opacity: 0; }

/* ─── Footer nav ─── */
.page-footer {
  padding: 1.2rem 1.5rem 1.5rem;
  text-align: center;
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
