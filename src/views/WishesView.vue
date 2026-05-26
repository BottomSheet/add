<template>
  <div class="wishes-page">
    <header class="wishes-header">
      <p class="eyebrow">✦ интерактивно ✦</p>
      <h2 class="title">Загадай желания</h2>
      <p class="subtitle">нажми на каждое — и оно исполнится</p>
    </header>

    <!-- Wishes grid -->
    <div class="wishes-grid">
      <button
        v-for="(w, i) in wishes"
        :key="i"
        class="wish"
        :class="{ lit: w.lit }"
        @click="wishTap(i, $event)"
      >
        <span class="wish-emoji">{{ w.emoji }}</span>
        <span class="wish-label">{{ w.label }}</span>
        <div v-if="w.lit" class="wish-glow" />
      </button>
    </div>

    <!-- Counter -->
    <div class="counter">
      <div class="counter-bar">
        <div class="counter-fill" :style="{ width: (litCount / wishes.length * 100) + '%' }" />
      </div>
      <p class="counter-text">
        <span class="counter-num">{{ litCount }}</span>
        &thinsp;/&thinsp;{{ wishes.length }} желаний зажглись
      </p>
    </div>

    <!-- All lit celebration -->
    <transition name="fade">
      <div v-if="allLit" class="all-lit">
        <div class="all-lit__text">🎉 Все желания зажглись! 🎉</div>
        <p class="all-lit__sub">Пусть всё сбудется, Ева ✦</p>
      </div>
    </transition>

    <div class="page-footer">
      <router-link to="/game" class="next-btn">Поиграть ✦</router-link>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { spawnSpark, say, launchConfetti } from '../composables/useEffects.js'

const wishes = ref([
  { emoji: '🎓', label: 'Лучший вуз',     lit: false },
  { emoji: '💖', label: 'Большая любовь', lit: false },
  { emoji: '✈️', label: 'Весь мир',       lit: false },
  { emoji: '💫', label: 'Удача',          lit: false },
  { emoji: '🌸', label: 'Счастье',        lit: false },
  { emoji: '🎨', label: 'Творчество',     lit: false },
  { emoji: '🏆', label: 'Успех',          lit: false },
  { emoji: '🌙', label: 'Покой',          lit: false },
])

const litCount = computed(() => wishes.value.filter(w => w.lit).length)
const allLit   = computed(() => litCount.value === wishes.value.length)

function wishTap(i, e) {
  wishes.value[i].lit = !wishes.value[i].lit
  spawnSpark(e.clientX, e.clientY, 5)

  if (allLit.value) {
    say('✨ Все желания зажглись — пусть сбудутся!')
    setTimeout(launchConfetti, 200)
  } else if (wishes.value[i].lit) {
    say('✦ Желание зажглось!')
  } else {
    say('·· погасло...')
  }
}
</script>

<style scoped>
.wishes-page {
  min-height: 100svh;
  background: linear-gradient(160deg, #fff5f9, #ffe4f0, #ffd0e8);
  padding: 3rem 1.5rem 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
}

/* ─── Header ─── */
.wishes-header {
  text-align: center;
  margin-bottom: 2.5rem;
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
  font-size: clamp(2rem, 8vw, 3rem);
  color: var(--rose4);
  margin-bottom: 0.5rem;
}
.subtitle {
  font-family: var(--font-body);
  font-style: italic;
  font-size: 0.85rem;
  color: var(--rose3);
  opacity: 0.7;
}

/* ─── Wishes grid ─── */
.wishes-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.9rem;
  width: 100%;
  max-width: 380px;
}

.wish {
  background: rgba(255, 255, 255, 0.72);
  backdrop-filter: blur(16px);
  border: 2px solid rgba(255, 174, 207, 0.3);
  border-radius: 18px;
  padding: 1.3rem 0.8rem;
  cursor: pointer;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  position: relative;
  overflow: hidden;
  transition: all 0.35s cubic-bezier(0.34, 1.56, 0.64, 1);
  -webkit-tap-highlight-color: transparent;
}
.wish:active { transform: scale(0.93); }
.wish.lit {
  background: linear-gradient(135deg, rgba(255, 174, 207, 0.55), rgba(255, 126, 182, 0.25));
  border-color: var(--rose3);
  box-shadow: 0 6px 24px rgba(232, 64, 122, 0.22), inset 0 1px 0 rgba(255,255,255,0.5);
  transform: scale(1.04);
}

.wish-emoji {
  font-size: 1.9rem;
  display: block;
  line-height: 1;
  transition: transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
}
.wish.lit .wish-emoji { transform: scale(1.28) rotate(-5deg); }

.wish-label {
  font-family: var(--font-label);
  font-size: 0.6rem;
  letter-spacing: 0.08em;
  color: var(--rose4);
  text-transform: uppercase;
  font-weight: 400;
}

.wish-glow {
  position: absolute;
  inset: 0;
  background: radial-gradient(circle at center, rgba(255, 126, 182, 0.2) 0%, transparent 70%);
  border-radius: 16px;
  animation: wishPulse 1.8s ease-in-out infinite;
}
@keyframes wishPulse {
  0%, 100% { opacity: 0.5; }
  50%       { opacity: 1; }
}

/* ─── Counter ─── */
.counter {
  margin-top: 2rem;
  width: 100%;
  max-width: 380px;
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
}
.counter-bar {
  width: 100%;
  height: 4px;
  background: rgba(255, 174, 207, 0.2);
  border-radius: 2px;
  overflow: hidden;
}
.counter-fill {
  height: 100%;
  background: linear-gradient(90deg, var(--rose3), var(--gold));
  border-radius: 2px;
  transition: width 0.4s cubic-bezier(0.22, 1, 0.36, 1);
}
.counter-text {
  font-family: var(--font-display);
  font-style: italic;
  font-size: 0.85rem;
  color: var(--rose4);
  text-align: center;
  opacity: 0.8;
}
.counter-num {
  font-size: 1.2rem;
  font-weight: 700;
}

/* ─── All lit ─── */
.all-lit {
  margin-top: 2rem;
  text-align: center;
  padding: 1.5rem;
  background: rgba(255, 255, 255, 0.85);
  border-radius: 20px;
  border: 1px solid rgba(255, 126, 182, 0.3);
  box-shadow: 0 8px 30px rgba(232, 64, 122, 0.15);
  max-width: 320px;
}
.all-lit__text {
  font-family: var(--font-display);
  font-style: italic;
  font-size: 1.1rem;
  color: var(--rose4);
  margin-bottom: 0.4rem;
}
.all-lit__sub {
  font-family: var(--font-label);
  font-size: 0.55rem;
  letter-spacing: 0.15em;
  color: var(--rose3);
  text-transform: uppercase;
}

/* transitions */
.fade-enter-active, .fade-leave-active { transition: opacity 0.5s, transform 0.5s; }
.fade-enter-from, .fade-leave-to { opacity: 0; transform: scale(0.9); }

/* ─── Footer nav ─── */
.page-footer {
  margin-top: 2rem;
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
  color: var(--rose4);
  border: 1px solid rgba(255, 126, 182, 0.35);
  border-radius: 50px;
  padding: 0.8rem 2rem;
}
.next-btn:active { background: rgba(255, 126, 182, 0.12); }
</style>
