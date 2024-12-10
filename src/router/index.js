import { createRouter, createWebHistory } from 'vue-router'
// import { useUserStore } from '@/stores/user'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/login',
      component: () => import('@/views/Login/LoginPage.vue')
    },
    {
      path: '/',
      component: () => import('@/views/layout/LayoutContainer.vue'),
      //重定向
      redirect: '/questions',
      children: [
        {
          path: '/questions',
          component: () => import('@/views/questions/AiQuestions.vue')
        }
      ]
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
