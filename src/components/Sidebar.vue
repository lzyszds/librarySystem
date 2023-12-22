

<script lang="ts" setup>
import { ref } from 'vue'
import LzyIcon from './lzyIcon.vue';
import { useRouter } from 'vue-router';
import { setCookie } from 'lzyutils'

const router = useRouter()
const sideBarActive = ref(1)
const items = ref([
  { id: 1, name: '统计记录', icon: 'typcn:chart-area-outline' },
  { id: 2, name: '图书管理', icon: 'typcn:document-text' },
  { id: 3, name: '图书查询', icon: 'typcn:zoom-outline' },
  { id: 4, name: '用户管理', icon: 'typcn:group-outline' },
  { id: 5, name: '图书查询', icon: 'typcn:zoom-outline' },
])
const handlePage = (id) => {
  sideBarActive.value = id
}
const closeUser = () => {
  router.push('/login')
  setCookie('token', '', -1)
}
</script>
<template>
  <section class="barlist">
    <div class="logo">
      <img width="30" height="30" src="@/assets/vue.svg" alt="" />
      <span>图书管理系统</span>
    </div>
    <div class="barItems">
      <div class="bar" :class="{ active: item.id === sideBarActive }" v-for="item in items" :key="item.id"
        @click="handlePage(item.id)">
        <LzyIcon :name="item.icon"></LzyIcon>
        <span>{{ item.name }}</span>
      </div>
    </div>
    <div class="footer">
      <ElButton class="lzy" @click="closeUser">
        <LzyIcon name="typcn:power"></LzyIcon>
        <span class="title">退出登陆</span>
      </ElButton>
    </div>
  </section>
</template>
<style lang="scss" scoped>
.barlist {
  display: grid;
  grid-template-rows: 60px 1fr 40px;
  gap: 20px;
  background-color: #fff;
  padding: 0 10px;
  text-wrap: nowrap;

  .logo {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    font-size: 20px;
    font-weight: 600;
    padding: 10px 10px;
  }

  .barItems {
    .bar {
      display: flex;
      gap: 10px;
      justify-content: left;
      align-items: center;
      border-radius: 5px;
      cursor: pointer;
      padding: 10px 20px;
      margin-top: 10px;
      transition: .3s;

      &.active span {
        animation: jello-horizontal .5s;
      }

      &:hover,
      &.active {
        background-color: var(--theme);
        color: #fff;
      }
    }
  }

  .footer {
    display: grid;
    justify-content: center;
    gap: 10px;

    button {
      width: 120px;
      margin: 0;
    }
  }
}

@keyframes jello-horizontal {
  0% {
    -webkit-transform: scale3d(1, 1, 1);
    transform: scale3d(1, 1, 1);
  }

  30% {
    -webkit-transform: scale3d(0.75, 1.15, 1);
    transform: scale3d(0.75, 1.15, 1);
  }

  40% {
    -webkit-transform: scale3d(1.15, 0.72, 1);
    transform: scale3d(1.15, 0.72, 1);
  }

  50% {
    -webkit-transform: scale3d(1.05, 0.75, 1);
    transform: scale3d(1.05, 0.75, 1);
  }

  65% {
    -webkit-transform: scale3d(0.95, 1.05, 1);
    transform: scale3d(0.95, 1.05, 1);
  }

  75% {
    -webkit-transform: scale3d(1.05, 0.95, 1);
    transform: scale3d(1.05, 0.95, 1);
  }

  100% {
    -webkit-transform: scale3d(1, 1, 1);
    transform: scale3d(1, 1, 1);
  }
}
</style>
