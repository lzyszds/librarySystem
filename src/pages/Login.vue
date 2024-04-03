<script setup lang="ts">
import LzyIcon from "@/components/lzyIcon.vue";
import { useRouter } from "vue-router";
import http from "@/http/index";
import type { ElInput } from "element-plus";
import { setCookie } from "lzyutils";
import { LyNotification, delaySync } from "@/utils/utils";

// 获取路由实例
const router = useRouter();

// 响应式对象，包含登录表单的信息
const info = reactive({
  username: "",
  password: "",
  yzm: "",
  isRemember: false,
});

// 使用 ref 创建变量来引用用户名、密码和验证码的 DOM 元素
const username = ref();
const password = ref();
const yzm = ref();

// 计时器，防止登录按钮被频繁点击
let timer: any = null;

// 登录函数
const login = () => {
  // 防止短时间内多次点击登录按钮
  if (timer) return;
  timer = setTimeout(() => {
    clearTimeout(timer);
    timer = null;
  }, 1000);

  function setAnimation(val) {
    val.classList.add("animate__headShake");
    delaySync(1000, () => {
      // 去除抖动动画类名
      val.classList.remove("animate__headShake");
    });
  }

  // 验证用户名是否为空
  if (info.username == "") {
    LyNotification({ type: "error", message: "请输入账号" });
    // 在输入框上应用抖动动画类名
    return setAnimation(username.value);
  } else if (info.password == "") {
    // 验证密码是否为空
    LyNotification({ type: "error", message: "请输入密码" });
    return setAnimation(password.value);
  } else if (info.yzm == "") {
    // 验证验证码是否为空
    LyNotification({ type: "error", message: "请输入验证码" });
    return setAnimation(yzm.value);
  }

  // 发送登录请求
  http<string>("post", "/admin/Api/User/login", {
    username: info.username,
    password: info.password,
    captcha: info.yzm,
  }).then((res) => {
    console.log(res);
    if (res.code == 200) {
      // 登录成功，设置 token，并跳转到首页
      setCookie("token", res.data, info.isRemember ? 7 : 1);
      router.push("/");
      LyNotification({ type: "success", message: "登录成功" });
    } else {
      // 登录失败，显示错误通知
      LyNotification({ type: "error", message: res.message });
    }
  });
};

// 刷新验证码函数
const handleCaptcha = (event) => {
  // 刷新验证码的同时清空验证码输入框的值
  event.target.setAttribute(
    "src",
    "/admin/Api/util/captcha?time=" + new Date().getTime()
  );
  info.yzm = "";
};
</script>

<template>
  <div class="login">
    <div class="content">
      <img src="@/assets/images/reading.png" alt="" />
      <div class="form">
        <h4>欢迎登陆图书管理系统</h4>
        <div ref="username">
          <el-input v-model="info.username" placeholder="账号" clearable>
            <template #prefix>
              <LzyIcon style="padding: 0px 3px 3px; color: #999" name="typcn:user-outline"></LzyIcon>
            </template>
          </el-input>
        </div>
        <div ref="password">
          <el-input v-model="info.password" type="password" placeholder="密码" clearable show-password
            @keydown.enter="login">
            <template #prefix>
              <LzyIcon style="padding: 0px 3px 3px; color: #999" name="typcn:lock-closed-outline"></LzyIcon>
            </template>
          </el-input>
        </div>
        <div class="yzm" ref="yzm">
          <el-input v-model="info.yzm" placeholder="验证码" @keydown.enter="login">
            <template #prefix>
              <LzyIcon style="padding: 0px 3px 3px; color: #999" name="typcn:key-outline"></LzyIcon>
            </template>
          </el-input>
          <img @click="handleCaptcha" src="/admin/Api/util/captcha" alt="" />
        </div>
        <div class="reserve">
          <el-checkbox v-model="info.isRemember" label="记住密码" />
        </div>
        <el-button type="primary" @click="login">登录</el-button>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.login {
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  background-image: url("@/assets/images/login.jpg");
  background-size: cover;
  position: relative;

  .content {
    background-color: #ffffff90;
    backdrop-filter: blur(5px) saturate(320%);
    height: 350px;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    border-radius: 10px;
    display: grid;
    grid-template-columns: 350px 400px;
    overflow: hidden;

    img {
      width: 340px;
      height: 100%;
    }

    .form {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;

      &>div {
        width: 100%;
        animation-duration: 0.5s;

        &.animate__headShake {
          :deep(.el-input) {
            .el-input__wrapper {
              border: 1px solid #f56c6c;

              ::placeholder {
                color: #f56c6c;
                /* 将占位符文本的字体颜色设置为灰色 */
              }

              svg {
                color: #f56c6c !important;
              }
            }
          }
        }
      }

      h4 {
        margin: 0;
      }

      .el-input {
        width: 70%;
        margin: 10px 0;
        height: 35px;

        :deep(.el-input__wrapper) {
          padding: 0 10px;
          border-radius: 10px;
          border: 1px solid transparent;

          .el-input__inner {
            height: 100%;
          }
        }
      }

      .yzm {
        width: 70%;
        display: grid;
        gap: 10px;
        grid-template-columns: 1.5fr 1fr;
        justify-content: center;
        align-items: center;

        .el-input {
          width: 100%;
        }

        img {
          width: 100%;
          height: 35px;
          border-radius: 5px;
        }
      }

      .reserve {
        width: 70%;
        display: flex;
        justify-content: flex-start;
        align-items: center;
      }

      button {
        width: 70%;
        margin-top: 10px;
        border: none;
      }
    }
  }
}
</style>
