import type { RouteRecordRaw } from 'vue-router'
import { createRouter, createWebHistory } from 'vue-router'

export const router = createRouter({
  history: createWebHistory(),
  routes: <RouteRecordRaw[]>[
    {
      path: '/',
      name: 'index',
      children: [
        {
          path: '/data-source',
          name: 'data-source',
          component: () => import('@/views/data-source/Index.vue')
        },
      ],
    },
  ],
})

export default router
