import type { RouteRecordRaw } from 'vue-router'
import { createRouter, createWebHistory } from 'vue-router'

export const router = createRouter({
  history: createWebHistory(),
  routes: <RouteRecordRaw[]>[
    {
      // 首页
      path: '/',
      name: 'index',
      children: [
        // 数据源
        {
          path: '/data-source',
          name: 'data-source',
          component: () => import('@/views/data-source/Index.vue')
        },
        // 组件管理
        {
          path: '/component-manager',
          name: 'component-manager',
          component: () => import('@/views/component-manager/Index.vue')
        },
      ],
    },
  ],
})

export default router
