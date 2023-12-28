<script setup lang='ts'>
import LzyIcon from '@/components/lzyIcon.vue';
import { useRouter } from 'vue-router';
import http from '@/http/index'
import { ElMessage } from 'element-plus'
import { setCookie } from 'lzyutils'

const router = useRouter()
const info = reactive({
    username: '',
    password: '',
    yzm: '',
    isRemember: false
})
const login = () => {
    http<string>("post", "/admin/Api/User/login", {
        username: info.username,
        password: info.password,
        captcha: info.yzm,
    }).then(res => {
        console.log(res);
        if (res.code == 200) {
            setCookie('token', res.data, info.isRemember ? 7 : 1)
            router.push('/')
            ElMessage.success("欢迎使用图书管理系统");
        } else {
            ElMessage.error(res.data);
        }
    })
}
const handleCaptcha = (event) => {
    event.target.setAttribute("src", "/admin/Api/util/captcha?time=" + new Date().getTime())
    info.yzm = ''
}
</script>

<template>
    <div class="login">
        <div class="content">
            <img src="@/assets/images/reading.png" alt="">
            <div class="form">
                <h4>欢迎登陆图书管理系统</h4>
                <el-input v-model="info.username" placeholder="账号" clearable>
                    <template #prefix>
                        <LzyIcon style="padding: 0px 3px 3px;color:#999" name="typcn:user-outline"></LzyIcon>
                    </template>
                </el-input>
                <el-input v-model="info.password" type="password" placeholder="密码" clearable show-password>
                    <template #prefix>
                        <LzyIcon style="padding: 0px 3px 3px;color:#999" name="typcn:lock-closed-outline"></LzyIcon>
                    </template>
                </el-input>
                <div class="yzm">
                    <el-input class="" v-model="info.yzm" type="password" placeholder="验证码" clearable>
                        <template #prefix>
                            <LzyIcon style="padding: 0px 3px 3px;color:#999" name="typcn:key-outline"></LzyIcon>
                        </template>
                    </el-input>
                    <img @click="handleCaptcha" src="/admin/Api/util/captcha" alt="">
                </div>
                <div class="reserve">
                    <el-checkbox v-model="info.isRemember" label="记住密码" />
                </div>
                <el-button type="primary" @click="login">登录</el-button>
            </div>
        </div>
    </div>
</template>

<style lang='scss' scoped>
.login {
    width: 100vw;
    height: 100vh;
    overflow: hidden;
    background-image: url('@/assets/images/login.jpg');
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

            h4 {
                margin: 0;
            }

            .el-input {
                width: 70%;
                margin: 10px 0;
                height: 35px;

                :deep(.el-input__wrapper) {
                    padding: 0 10px;

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
