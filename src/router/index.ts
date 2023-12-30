import { createRouter, createWebHashHistory } from "vue-router";
import undefind404 from '@/pages/Undefind404.vue'
import { getCookie, setCookie } from 'lzyutils'
import { ElMessageBox } from "element-plus";

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
router.beforeEach(async (to: any, form: any) => {
  /* 拦截 如果当前页面不为login页面,就需要token */
  if (to.path !== '/login') {
    if (!getCookie("token")) {
      if (form.path === '/login' || form.path === '/') {
        return "/login"
      }

      let timer: any = setTimeout(() => {
        router.push('/login')
        ElMessageBox.close()
      }, 1000 * 3)
      //销毁token cookie
      setCookie('token', '', -1)
      ElMessageBox.alert('登陆验证失败，请重新登陆！！(3秒后自动退出)', '提示', {
        // 弹出提示框，告知用户登录验证失败
        // 如果要禁用其自动对焦
        // autofocus: false,
        confirmButtonText: '确定',
        callback: () => {
          router.push('/login')
          clearTimeout(timer)
          ElMessageBox.close()
        },
      })
      return '/login'
    }
  }
});

export default router;
