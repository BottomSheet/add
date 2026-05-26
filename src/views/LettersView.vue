<template>
  <div class="letters-page">
    <header class="letters-header">
      <p class="eyebrow">✦ слова для тебя ✦</p>
      <h2 class="title" :class="{ visible: titleVisible }" ref="titleRef">
        Дорогая Ева
      </h2>
      <div class="header-deco" />
    </header>

    <!-- Letter cards -->
    <div class="cards-list">
      <article
        v-for="(letter, i) in letters"
        :key="i"
        class="letter-card"
        :class="[i % 2 === 0 ? 'reveal-left' : 'reveal-right', { visible: letter.visible }]"
        :ref="el => cardRefs[i] = el"
      >
        <div class="card-number">0{{ i + 1 }}</div>
        <h3 class="card-heading">{{ letter.heading }}</h3>
        <div class="card-divider" />
        <p class="card-body">{{ letter.body }}</p>
        <div class="card-flowers">{{ letter.flower }}</div>
      </article>
    </div>

    <!-- Photo break -->
    <div class="photo-break">
      <div class="photo-break__img-wrap" :class="{ visible: photoBreakVisible }" ref="photoBreakRef">
        <img :src="photo('p2.jpg')" alt="Ева смотрит вверх" />
        <div class="photo-break__overlay">
          <span>{{ photoCaption }}</span>
        </div>
      </div>
    </div>

    <!-- Final letter -->
    <div class="final-letter" :class="{ visible: finalVisible }" ref="finalRef">
      <p class="final-text">
        Это не конец — это первая страница самой лучшей книги.
        Той, где главная героиня — ты.
      </p>
      <div class="final-signature">с любовью ✦</div>
    </div>

    <div class="page-footer">
      <router-link to="/mosaic" class="next-btn">Смотреть фото ✦</router-link>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useReveal, photo } from '../composables/useEffects.js'

const letters = ref([
  {
    heading: 'Ты сделала это',
    body: 'Одиннадцать лет. Каждое утро с рюкзаком, каждая контрольная в ночь, каждый страх перед доской — всё это была ты, идущая вперёд. И ты дошла.',
    flower: '🌸',
    visible: false,
  },
  {
    heading: 'Ты красивее, чем думаешь',
    body: 'Я смотрю на тебя — и вижу не просто девушку. Вижу целую вселенную: тёплую, настоящую, бесконечную. Ты такая.',
    flower: '✦',
    visible: false,
  },
  {
    heading: 'Весь мир впереди',
    body: 'Теперь начинается та самая жизнь — без расписания, без звонков. Только ты и всё, что ты выберешь сама. Это страшно и прекрасно одновременно.',
    flower: '🦋',
    visible: false,
  },
  {
    heading: 'Я люблю тебя',
    body: 'Не за пятёрки, не за аттестат. Просто за то, что ты — Ева. И это самое лучшее, что есть в моей жизни.',
    flower: '❤️',
    visible: false,
  },
  {
    heading: 'Ты — мой любимый человек',
    body: 'В любой день, в любое время — когда ты рядом, мир становится светлее. Ты именно такая, какой и должна быть.',
    flower: '💖',
    visible: false,
  },
])

const photoCaption = '«смотришь ввысь — и там всё твоё»'

const titleRef       = ref(null)
const titleVisible   = ref(false)
const cardRefs       = ref({})
const photoBreakRef  = ref(null)
const photoBreakVisible = ref(false)
const finalRef       = ref(null)
const finalVisible   = ref(false)

const { observe, cleanup } = useReveal(0.25)

onMounted(() => {
  observe(titleRef.value, () => { titleVisible.value = true })
  letters.value.forEach((_, i) => {
    observe(cardRefs.value[i], () => {
      setTimeout(() => { letters.value[i].visible = true }, i * 100)
    })
  })
  observe(photoBreakRef.value,  () => { photoBreakVisible.value = true })
  observe(finalRef.value,        () => { finalVisible.value = true })
})
onUnmounted(cleanup)
</script>

<style scoped>
.letters-page {
  min-height: 100svh;
  background: linear-gradient(160deg, var(--cream) 0%, #ffe4f0 50%, #ffd0e8 100%);
  padding: 3rem 0 2rem;
}

/* ─── Header ─── */
.letters-header {
  text-align: center;
  padding: 0 1.5rem 3rem;
}
.eyebrow {
  font-family: var(--font-label);
  font-size: 0.5rem;
  letter-spacing: 0.35em;
  text-transform: uppercase;
  color: var(--rose3);
  opacity: 0.7;
  margin-bottom: 0.8rem;
}
.title {
  font-family: var(--font-display);
  font-style: italic;
  font-weight: 900;
  font-size: clamp(2.2rem, 9vw, 3.5rem);
  color: var(--rose4);
  opacity: 0;
  transform: translateY(20px);
  transition: opacity 0.7s ease, transform 0.7s cubic-bezier(0.22, 1, 0.36, 1);
}
.title.visible { opacity: 1; transform: translateY(0); }
.header-deco {
  width: 50px; height: 2px;
  margin: 1.2rem auto 0;
  background: linear-gradient(90deg, transparent, var(--rose3), transparent);
  border-radius: 1px;
}

/* ─── Cards ─── */
.cards-list {
  padding: 0 1.2rem;
  display: flex;
  flex-direction: column;
  gap: 1.2rem;
  max-width: 480px;
  margin: 0 auto;
}

.letter-card {
  background: rgba(255, 255, 255, 0.82);
  backdrop-filter: blur(20px);
  border-radius: 20px;
  padding: 1.8rem 1.5rem;
  border: 1px solid rgba(255, 174, 207, 0.3);
  box-shadow: 0 6px 28px rgba(232, 64, 122, 0.08);
  position: relative;
  overflow: hidden;
}
.letter-card::before {
  content: '';
  position: absolute;
  top: 0; left: 0; right: 0;
  height: 3px;
  background: linear-gradient(90deg, var(--rose3), var(--gold), var(--rose3));
  background-size: 200%;
  border-radius: 20px 20px 0 0;
}

.card-number {
  font-family: var(--font-label);
  font-size: 0.48rem;
  letter-spacing: 0.3em;
  color: var(--rose3);
  margin-bottom: 0.7rem;
  opacity: 0.7;
}
.card-heading {
  font-family: var(--font-display);
  font-style: italic;
  font-weight: 700;
  font-size: clamp(1.2rem, 5vw, 1.6rem);
  color: var(--rose4);
  line-height: 1.2;
  margin-bottom: 0.7rem;
}
.card-divider {
  width: 32px; height: 2px;
  background: linear-gradient(90deg, var(--rose3), transparent);
  border-radius: 1px;
  margin-bottom: 0.9rem;
}
.card-body {
  font-family: var(--font-body);
  font-style: italic;
  font-size: 0.9rem;
  line-height: 1.85;
  color: var(--ink-soft);
}
.card-flowers {
  position: absolute;
  bottom: 1.2rem;
  right: 1.4rem;
  font-size: 1.2rem;
  opacity: 0.5;
}

/* ─── Reveal states ─── */
.reveal-left {
  opacity: 0;
  transform: translateX(-30px);
  transition: opacity 0.7s ease, transform 0.7s cubic-bezier(0.22, 1, 0.36, 1);
}
.reveal-right {
  opacity: 0;
  transform: translateX(30px);
  transition: opacity 0.7s ease, transform 0.7s cubic-bezier(0.22, 1, 0.36, 1);
}
.reveal-left.visible,
.reveal-right.visible {
  opacity: 1;
  transform: translateX(0);
}

/* ─── Photo break ─── */
.photo-break {
  padding: 3rem 1.2rem;
}
.photo-break__img-wrap {
  position: relative;
  max-width: 380px;
  margin: 0 auto;
  border-radius: 20px;
  overflow: hidden;
  opacity: 0;
  transform: scale(0.9);
  transition: opacity 0.8s ease, transform 0.8s cubic-bezier(0.22, 1, 0.36, 1);
  box-shadow: 0 20px 60px rgba(232, 64, 122, 0.2);
}
.photo-break__img-wrap.visible { opacity: 1; transform: scale(1); }
.photo-break__img-wrap img {
  width: 100%; display: block;
  filter: saturate(1.1);
}
.photo-break__overlay {
  position: absolute;
  bottom: 0; left: 0; right: 0;
  padding: 1.5rem 1.2rem 1rem;
  background: linear-gradient(180deg, transparent, rgba(26, 0, 16, 0.7));
  font-family: var(--font-display);
  font-style: italic;
  font-size: 0.85rem;
  color: rgba(255, 214, 231, 0.85);
  text-align: center;
}

/* ─── Final letter ─── */
.final-letter {
  text-align: center;
  padding: 1rem 2rem 2rem;
  max-width: 380px;
  margin: 0 auto;
  opacity: 0;
  transform: translateY(20px);
  transition: opacity 0.9s ease, transform 0.9s cubic-bezier(0.22, 1, 0.36, 1);
}
.final-letter.visible { opacity: 1; transform: translateY(0); }
.final-text {
  font-family: var(--font-display);
  font-style: italic;
  font-size: clamp(1rem, 4.2vw, 1.3rem);
  line-height: 1.7;
  color: var(--rose4);
  opacity: 0.8;
}
.final-signature {
  margin-top: 1.2rem;
  font-family: var(--font-label);
  font-size: 0.55rem;
  letter-spacing: 0.2em;
  color: var(--rose3);
  opacity: 0.6;
}

/* ─── Footer nav ─── */
.page-footer {
  text-align: center;
  padding: 1rem 1.5rem 2rem;
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
