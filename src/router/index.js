import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/status/machine',
      name: 'StatusMachine',
      component: () => import('../views/StatusMachine.vue')
    },
    {
      path: '/status/order',
      name: 'StatusOrder',
      component: () => import('../views/StatusOrder.vue')
    },
    // {
    //   path: '/login',
    //   name: 'Login',
    //   component: () => import('../views/Login.vue')
    // },
    // {
    //   path: '/member/machine',
    //   name: 'MemberMachine',
    //   component: ()=> import('../views/MemberMachine.vue')
    // },
    // {
    //   path: '/member/order',
    //   name: 'MemberOrder',
    //   component: ()=> import('../views/MemberOrder.vue')
    // },
  ]
})

export default router
