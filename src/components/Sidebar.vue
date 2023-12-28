

<script lang="ts" setup>
import { ref } from 'vue'
import LzyIcon from './lzyIcon.vue';
import { useRouter } from 'vue-router';
import { setCookie } from 'lzyutils'
import { useStore } from '@/store';
const store = useStore()
const router = useRouter()
const items = ref([
  { id: 1, name: '统计记录', link: 'Home', icon: 'typcn:chart-area-outline' },
  { id: 2, name: '图书管理', link: 'BookGain', icon: 'typcn:document-text' },
  { id: 3, name: '借阅管理', link: 'BookQuery', icon: 'typcn:zoom-outline' },
  { id: 4, name: '用户管理', link: 'UserGain', icon: 'typcn:group-outline' },
  { id: 5, name: '图书查询', link: "", icon: 'typcn:zoom-outline' },
])
const handlePage = (id) => {
  store.page = id
}
const closeUser = () => {
  router.push('/login')
  setCookie('token', '', -1)
}
const toHome = () => {
  if (store.isMobile) {
    store.changeMobileBar()
  } else {
    router.push('/admin')
  }
}
</script>
<template>
  <section class="barlist">
    <div class="logo" @click="toHome">
      <img width="44" height="44" src="@/assets/vue.svg" alt="" />
      <span v-if="!store.sidebar">图书管理系统</span>
    </div>
    <div class="barItems">
      <div class="bar" :class="{ active: item.id === store.page }" v-for="item in items" :key="item.id"
        @click="handlePage(item.id)">
        <el-tooltip class="box-item" effect="dark" :content="item.name" placement="right" :enterable="false" :offset="20">
          <LzyIcon :name="item.icon" height="26"></LzyIcon>
        </el-tooltip>
        <span v-if="!store.sidebar">{{ item.name }}</span>
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
  width: 200px;
  height: calc(100vh - 40px);
  display: grid;
  grid-template-rows: 60px 1fr 40px;
  gap: 20px;
  background-color: #fff;
  padding: 0 10px;
  text-wrap: nowrap;
  font-family: 'almama';
  user-select: none;
  position: fixed;
  border-radius: 10px 0 0 10px;
  transition: width .28s linear;

  .logo {
    gap: 10px;
    font-size: 20px;
    font-weight: 600;
    padding: 10px 0;
    cursor: pointer;
    transition: .28s linear;
    text-align: left;
    overflow: hidden;

    img {
      vertical-align: bottom;
      padding-left: 2px;
    }

    span {
      margin-left: 10px;
    }
  }

  .barItems {
    overflow: hidden;

    .bar {
      width: 150px;
      max-height: 28px;
      border-radius: 5px;
      cursor: pointer;
      padding: 10px 20px;
      transition: .28s linear;
      text-align: left;
      margin-top: 10px;

      svg {
        vertical-align: bottom;
        margin-right: 10px;
      }

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
      transition: .5s;
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
