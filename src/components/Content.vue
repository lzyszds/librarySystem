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
  </section>
</template>

<style lang='scss' scoped>
.content {
  display: grid;
  grid-template-rows: 40px 80px 1fr;
  background-color: #fff;
  padding: 9px 10px;

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
}
</style>
