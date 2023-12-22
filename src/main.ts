import { createApp } from "vue";
import 'element-plus/dist/index.css'
import 'element-plus/theme-chalk/base.css'
import "@/assets/style.css";
import "@/assets/animate.min.css";
import "@/assets/animation.css";
import "@/assets/element.css";

import App from "@/App.vue";
import lzyIcon from "@/components/lzyIcon.vue";
import router from "@/router";
import ElementPlus from 'element-plus'
import { createPinia } from 'pinia'
const pinia = createPinia()


const app = createApp(App);
app.component("LzyIcon", lzyIcon);
app.use(ElementPlus)
  .use(router)
  .use(pinia)

app.mount("#app");
