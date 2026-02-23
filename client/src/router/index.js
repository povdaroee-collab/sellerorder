import { createRouter, createWebHashHistory } from 'vue-router'
import PosView from '../views/PosView.vue'
import LoginView from '../views/LoginView.vue'

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'pos',
      component: PosView,
      meta: { requiresAuth: true }
    },
    {
      path: '/login',
      name: 'login',
      component: LoginView
    }
  ]
})

// Route Guard to check session (Updated for Vue Router 4)
router.beforeEach((to, from) => {
  const isAuthenticated = !!localStorage.getItem('dpos_session')
  
  // If trying to access POS without being logged in -> send to login
  if (to.meta.requiresAuth && !isAuthenticated) {
    return { name: 'login' }
  } 
  
  // If trying to access Login while already logged in -> send to POS
  if (to.name === 'login' && isAuthenticated) {
    return { name: 'pos' }
  }

  // Returning undefined (doing nothing) allows the navigation to proceed normally
})

export default router