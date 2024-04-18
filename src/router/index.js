import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import HomeView from '@/views/HomeView.vue'
import LoginView from '@/views/LoginView.vue'
import RegisterView from '@/views/RegisterView.vue'
import GameLobbyView from '@/views/GameLobbyView.vue'
import CreditsView from '@/views/CreditsView.vue'
import ScriptEditorView from '@/views/ScriptEditorView.vue'
import HowToPlayView from '@/views/HowToPlayView.vue'
import CanvasView from '@/views/CanvasView.vue'
import TestCarouselView from '@/views/CarouselView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/login',
      name: 'login',
      component: LoginView,
      meta: { transition: 'slide-left' }
    },
    {
      path: '/',
      name: 'Home',
      component: HomeView
    },
    {
      path: '/register',
      name: 'register',
      component: RegisterView,
      meta: {
        transition: 'slide-right'
      }
    },
    {
      path: '/lobby',
      name: 'lobby',
      component: GameLobbyView,
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/credits',
      name: 'credits',
      component: CreditsView
    },
    {
      path: '/script-editor',
      name: 'script-editor',
      component: ScriptEditorView,
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/how-to-play',
      name: 'how-to-play',
      component: HowToPlayView
    },
    {
      path: '/carousel',
      name: 'carousel',
      component: TestCarouselView
    },
    {
      path: '/canvas',
      name: 'canvas',
      component: CanvasView
    }
  ]
})

router.beforeEach(async (to) => {
  // Check if the route requires authentication
  const requiresAuth = to.matched.some((record) => record.meta.requiresAuth)

  if (requiresAuth) {
    const authStore = useAuthStore()
    await authStore.loadFromLocalStorage()

    if (requiresAuth && !authStore.$state.user.accessToken) {
      // Redirect to the login page if the user is not authenticated
      return { name: 'login' }
    }
  }
})

export default router
