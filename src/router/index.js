import { createRouter, createWebHistory } from 'vue-router'
// import { useUserStore } from '@/stores/user'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      component: () => import('@/views/layout/LayoutContainer.vue'),
      redirect: '/article/channel',
      children: [
        {
          path: 'article/channel',
          component: () => import('@/views/Article/index.vue')
        },
        {
          path: 'article/search',
          component: () => import('@/views/Search/index.vue')
        },
        {
          path: 'article/question',
          component: () => import('@/views/Questions/index.vue')
        },
        {
          path: 'article/ai_chat',
          component: () => import('@/views/Questions/ai_index.vue')
        }
      ]
    },
    {
      path: '/login',
      component: () => import('@/views/Login/index.vue')
    },
    {
      path: '/search_prodetail/:id',
      name: 'prodetail',
      component: () => import('@/views/Prodetail/index.vue')
    }
  ]
})

//前置守卫
// router.beforeEach((to) => {
//   const userStore = useUserStore()
//   if (!userStore.token && to.path !== '/login') {
//     return '/login'
//   }
// })

export default router
