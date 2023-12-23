<script setup lang='ts'>
import { useStore } from '@/store';
const store = useStore()

</script>

<template>
  <el-form ref="store.userInfoRef" :model="store.userInfo" class="addUserInfo" label-width="60px" status-icon>
    <div style="display:flex;gap:10px">
      <el-form-item label="级别" prop="role">
        <el-radio-group v-model="store.userInfo.role">
          <el-radio-button :label="1">普通读者</el-radio-button>
          <el-radio-button :label="0">管理员</el-radio-button>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="性别" prop="sex">
        <el-radio-group v-model="store.userInfo.sex">
          <el-radio-button label="男">男</el-radio-button>
          <el-radio-button label="女">女</el-radio-button>
        </el-radio-group>
      </el-form-item>
    </div>
    <el-form-item label="账号" prop="username">
      <el-input v-model="store.userInfo.username" placeholder="请输入账号"></el-input>
    </el-form-item>
    <el-form-item label="名称" prop="name">
      <el-input v-model="store.userInfo.name" placeholder="请输入名称"></el-input>
    </el-form-item>
    <el-form-item label="邮箱" prop="email">
      <el-input v-model="store.userInfo.email" placeholder="请输入邮箱"></el-input>
    </el-form-item>
    <el-form-item label="手机号" prop="phone">
      <el-input v-model="store.userInfo.phone" placeholder="请输入手机号"></el-input>
    </el-form-item>
    <el-form-item label="地址" prop="address">
      <el-input v-model="store.userInfo.address" placeholder="请输入地址"></el-input>
    </el-form-item>
  </el-form>
</template>

<style lang='scss' scoped>
.addUserInfo {
  padding: 0 10%;
}
</style>
