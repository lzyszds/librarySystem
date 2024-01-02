<script setup lang="ts">
import { ElButton } from "element-plus";
import LzyIcon from "./lzyIcon.vue";
import { useStore } from "@/store";
import { useDark, useToggle } from "@vueuse/core";

const isDark = useDark();
const toggleDark = useToggle(isDark);
const store = useStore();
</script>

<template>
  <section class="content">
    <div class="navtop">
      <div @click="store.changeBar()" v-if="!store.isMobile">
        <LzyIcon name="typcn:th-list-outline"></LzyIcon>
      </div>
      <ElButton @click="store.changeMobileBar()" v-else>
        <LzyIcon name="typcn:th-list-outline"></LzyIcon>
      </ElButton>
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      </el-breadcrumb>
      <div class="tool">
        <div
          class="regulate"
          :style="isDark ? 'color:#fff' : 'color:#000'"
          @click="toggleDark()"
        >
          <LzyIcon
            height="25px"
            :name="
              isDark
                ? 'line-md:moon-filled-alt-loop'
                : 'line-md:moon-filled-to-sunny-filled-loop-transition'
            "
          ></LzyIcon>
        </div>
        <div class="user" :style="isDark ? 'color:#fff' : 'color:#000'">
          <span>admin</span>
          <img width="45" src="@/assets/images/user.png" alt="" />
        </div>
      </div>
    </div>
    <div class="background"></div>
    <slot name="main"></slot>
  </section>
</template>

<style lang="scss" scoped>
.reducebar .content {
  margin-left: 80px;
}

.content {
  margin-left: 230px;
  height: calc(100vh - 60px);
  display: grid;
  grid-template-rows: 55px 2px 1fr;
  gap: 5px;
  background-color: var(--bgTheme);
  backdrop-filter: blur(10px);
  padding: 9px 10px;
  font-family: "dindin";
  flex: 1;
  transition: margin-left 0.28s linear;

  .navtop {
    display: grid;
    grid-template-columns: 30px 1fr 200px;
    gap: 20px;
    justify-content: flex-end;
    align-items: center;

    & > div:nth-child(1):hover {
      transition: 0.28s;
      cursor: pointer;
      color: var(--hoverTheme) !important;
    }

    .tool {
      display: flex;
      justify-content: flex-end;
      align-items: center;
      gap: 10px;
      user-select: none;
      .user {
        display: flex;
        align-items: center;
        gap: 10px;
        font-weight: 600;

        img {
          border-radius: 5px;
          box-shadow: 0 0 5px rgba(0, 0, 0, 0.2);
        }
      }

      .regulate {
        cursor: pointer;
        transition: 0.28s;
        &:hover {
          color: var(--hoverTheme) !important;
        }
      }
    }
  }

  .background {
    // background-image: linear-gradient(to right, var(--theme) 0%, #FFEDBC 51%, #ED4264 100%);
    // background: linear-gradient(to right, #ff7e5f, #feb47b, #ff7e5f, #feb47b);
    position: relative;
    width: 100%;
    color: #000000;
    font-weight: bold;
    border-radius: 30px;
    background-size: 300%;
    background-image: linear-gradient(90deg, #03a9f4, #f441a5, #ffeb3b, #03a9f4);
    text-transform: uppercase;
    z-index: 1;
    animation: sun 20s infinite linear;
  }
}

@keyframes sun {
  to {
    background-position: -200% 0;
  }
}
</style>
