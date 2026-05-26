import { createRouter, createWebHashHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'Hero',
    component: () => import('../views/HeroView.vue'),
    meta: { title: 'Ева ✦ 2026' }
  },
  {
    path: '/gallery',
    name: 'Gallery',
    component: () => import('../views/GalleryView.vue'),
    meta: { title: 'Галерея ✦ Ева' }
  },
  {
    path: '/letters',
    name: 'Letters',
    component: () => import('../views/LettersView.vue'),
    meta: { title: 'Слова ✦ Ева' }
  },
  {
    path: '/mosaic',
    name: 'Mosaic',
    component: () => import('../views/MosaicView.vue'),
    meta: { title: 'Фото ✦ Ева' }
  },
  {
    path: '/wishes',
    name: 'Wishes',
    component: () => import('../views/WishesView.vue'),
    meta: { title: 'Желания ✦ Ева' }
  },
  {
    path: '/game',
    name: 'Game',
    component: () => import('../views/GameView.vue'),
    meta: { title: 'Игра ✦ Ева' }
  },
  {
    path: '/finale',
    name: 'Finale',
    component: () => import('../views/FinaleView.vue'),
    meta: { title: '❤️ Ева' }
  },
]

const router = createRouter({
  history: createWebHashHistory(),
  routes,
  scrollBehavior() {
    return { top: 0, behavior: 'smooth' }
  }
})

router.afterEach(to => {
  document.title = to.meta.title || 'Ева ✦ 2026'
})

export default router
