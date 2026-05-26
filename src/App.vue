<template>
  <!-- Global glitter canvas -->
  <canvas id="confetti-canvas" />

  <!-- Scroll progress bar -->
  <div class="progress-bar" :style="{ width: progress + '%' }" />

  <!-- Sparks layer -->
  <div
    v-for="s in sparks"
    :key="s.id"
    class="spark"
    :style="{ left: s.x + 'px', top: s.y + 'px', '--tx': s.tx + 'px', '--ty': s.ty + 'px' }"
  >{{ s.e }}</div>

  <!-- Toast -->
  <div class="toast-wrap" :class="{ show: toast.show }">{{ toast.msg }}</div>

  <!-- Bottom Navigation -->
  <nav class="bottom-nav">
    <router-link v-for="item in navItems" :key="item.to" :to="item.to" class="nav-item">
      <span class="nav-icon">{{ item.icon }}</span>
      <span class="nav-label">{{ item.label }}</span>
    </router-link>
  </nav>

  <!-- Page content -->
  <main class="app-main" @touchmove="onTouchMove">
    <router-view v-slot="{ Component }">
      <transition name="page" mode="out-in">
        <component :is="Component" />
      </transition>
    </router-view>
  </main>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { sparks, toast, useTouchTrail } from './composables/useEffects.js'

const { onTouchMove } = useTouchTrail()

const progress = ref(0)
const onScroll = () => {
  const h = document.documentElement.scrollHeight - window.innerHeight
  progress.value = h > 0 ? (window.scrollY / h) * 100 : 0
}

onMounted(() => window.addEventListener('scroll', onScroll, { passive: true }))
onUnmounted(() => window.removeEventListener('scroll', onScroll))

const navItems = [
  { to: '/',        icon: '🌸', label: 'Главная'  },
  { to: '/gallery', icon: '✨', label: 'Галерея'  },
  { to: '/letters', icon: '💌', label: 'Письма'   },
  { to: '/mosaic',  icon: '🖼',  label: 'Фото'     },
  { to: '/wishes',  icon: '⭐', label: 'Желания'  },
  { to: '/game',    icon: '🎈', label: 'Игра'     },
  { to: '/finale',  icon: '❤️', label: 'Финал'    },
]
</script>

<style scoped>
.app-main {
  padding-bottom: 5rem; /* space for bottom nav */
}

/* ─── Bottom Nav ─── */
.bottom-nav {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 500;
  display: flex;
  justify-content: space-around;
  align-items: center;
  background: rgba(255, 245, 249, 0.92);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border-top: 1px solid rgba(255, 174, 207, 0.35);
  padding: 0.5rem 0.3rem;
  padding-bottom: max(0.5rem, env(safe-area-inset-bottom));
}

.nav-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.18rem;
  text-decoration: none;
  padding: 0.3rem 0.5rem;
  border-radius: 12px;
  transition: background 0.25s, transform 0.25s;
  min-width: 42px;
  -webkit-tap-highlight-color: transparent;
}
.nav-item:active {
  transform: scale(0.9);
}
.nav-item.router-link-active {
  background: rgba(255, 126, 182, 0.15);
}

.nav-icon {
  font-size: 1.25rem;
  line-height: 1;
  transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}
.nav-item.router-link-active .nav-icon {
  transform: scale(1.2) translateY(-2px);
}

.nav-label {
  font-family: var(--font-label);
  font-size: 0.42rem;
  letter-spacing: 0.08em;
  color: rgba(80, 20, 40, 0.5);
  text-transform: uppercase;
  transition: color 0.25s;
}
.nav-item.router-link-active .nav-label {
  color: var(--rose4);
  font-weight: 700;
}
</style>
