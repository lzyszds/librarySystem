import { createRouter, createWebHashHistory } from "vue-router";
import undefind404 from '@/pages/Undefind404.vue'
import { getCookie } from 'lzyutils'
const routes = [
  { path: '/', redirect: '/admin' },
  {
    path: "/admin",
    name: "admin",
    component: () => import("@/pages/admin/index.vue"),
  },
  {
    path: "/login",
    name: "login",
    component: () => import("@/pages/Login.vue"),
  },
  {
    path: "/:catchAll(.*)",
    name: 'undefind404',
    component: undefind404 // 注意，没有重定向就会出现两个一模一样的home页面
  },
];
const router = createRouter({
  history: createWebHashHistory(),
  routes,
});
// 前置钩子
router.beforeEach(async (to: any) => {
  /* 拦截 如果当前页面不为login页面,就需要token */
  if (to.path !== '/login') {
    if (!getCookie("token")) {
      return '/login'
    }
  }
});

export default router;
