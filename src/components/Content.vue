<script setup lang='ts'>
import { ElButton } from 'element-plus';
import LzyIcon from './lzyIcon.vue';
import { useStore } from '@/store';
const store = useStore()

</script>

<template>
  <section class="content">
    <div class="navtop">
      <ElButton @click="store.changeBar()">
        <LzyIcon name="typcn:th-list-outline"></LzyIcon>
      </ElButton>
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      </el-breadcrumb>
      <div class="tool">
        <span>admin</span>
        <img width="45" src="@/assets/images/user.png" alt="">
      </div>
    </div>
    <div class="background"></div>
    <slot name="main"></slot>
  </section>
</template>

<style lang='scss' scoped>
.content {
  display: grid;
  grid-template-rows: 55px 2px 1fr;
  gap: 5px;
  background-color: #fff;
  padding: 9px 10px;
  font-family: 'dindin';

  .navtop {
    display: grid;
    grid-template-columns: 30px 1fr 200px;
    gap: 20px;
    justify-content: flex-end;
    align-items: center;

    .tool {
      img {
        border-radius: 5px;
        box-shadow: 0 0 5px rgba(0, 0, 0, 0.2);
      }

      justify-content: flex-end;
      align-items: center;
      display: flex;
      gap: 10px;
      font-weight: 600;
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
