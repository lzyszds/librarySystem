import { createApp } from "vue";
import "@/assets/font/font.css"
import 'element-plus/dist/index.css'
import 'element-plus/theme-chalk/base.css'
import "@/assets/css/style.css";
import "@/assets/css/animate.min.css";
import "@/assets/css/animation.css";
import "@/assets/css/element.css";
import "@/assets/css/loading.css";


import App from "@/App.vue";
import lzyIcon from "@/components/lzyIcon.vue";
import router from "@/router";
import ElementPlus from 'element-plus'
import zyloading from '@/utils/loading'

import { createPinia } from 'pinia'
const pinia = createPinia()


const app = createApp(App);
app.directive('zyloading', zyloading)
app.component("LzyIcon", lzyIcon);
app.use(ElementPlus)
  .use(router)
  .use(pinia)

app.mount("#app");
