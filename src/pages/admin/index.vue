<script setup lang='ts'>
import Sidebar from '@/components/Sidebar.vue'
import Content from '@/components/Content.vue'
import Home from '@/pages/admin/Home.vue'
import BookGain from '@/pages/admin/BookGain.vue'
import BookQuery from '@/pages/admin/BookQuery.vue'
import UserGain from '@/pages/admin/UserGain.vue'

import { useStore } from '@/store';
const store = useStore()
const component = [
    Home,
    BookGain,
    BookQuery,
    UserGain
]
</script>

<template>
    <main id="main" :class="{
        reducebar: store.sidebar,
        moblieReducebar: !store.mobileSidebar
    }">
        <Sidebar />
        <Content>
            <template v-slot:main>
                <component :is="component[store.page-1]"></component>
            </template>
        </Content>
    </main>
</template>

<style lang='scss' scoped>
#main {
    width: calc(100vw - 40px);
    height: calc(100vh - 40px);
    overflow: hidden;
    gap: 10px;
    border-radius: 10px;
    margin: 10px;
    // padding: 10px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
    background-color: #f0f0f0;

    &.reducebar {
        grid-template-columns: 60px 1fr;

        .barlist {
            width: 50px;
        }

        :deep(.logo) {
            font-size: 0;
            padding: 10px 0;

            img {
                width: 44px;
                height: 44px;
            }

            span {
                line-height: 0;
            }
        }

        :deep(.bar) {
            width: 30px;
            height: 24px;
            padding: 10px 5px;
            padding-left: 15px;

            span {
                font-size: 0;
                line-height: 0;
            }
        }

        :deep(.footer) {
            button {
                width: 44px;
                margin-bottom: 20px;
                font-size: 0;
            }

            span.title {
                font-size: 0;
            }
        }
    }
}

@media screen and (max-width: 768px) {
    #main {
        grid-template-columns: 1fr;
        grid-template-rows: 60px 1fr 60px;
        gap: 0;
        border-radius: 0;
        margin: 0;
        padding: 0;
        box-shadow: none;
        background-color: #fff;
        overflow: hidden;
        overflow-y: auto;
        width: 100vw;
        height: 100vh;

        :deep(.logo) {
            display: flex;
            padding: 10px 0;
            width: calc(100vw - 20px);
            justify-content: center;
            align-items: center;

            img {
                width: 40px;
                height: 40px;
            }

            span {
                display: block;
            }
        }


        .barlist {
            top: 0;
            z-index: 99999;
            position: absolute;
            width: calc(100vw - 20px);
            height: 60vh;
            justify-content: center;
            box-shadow: 0px 3px 10px #999;
            border-radius: 0;
        }

        :deep(.bar) {
            justify-content: center;
            padding: 10px 5px;
            width: 97.5%;
            display: flex;

            span {
                display: block;
            }
        }

        :deep(.footer) {
            button {
                width: calc(100vw - 20px);
            }
        }

        .content {
            margin-left: 0;
        }

        :deep(.tableMain) {
            grid-template-rows: 80px 1fr;
            gap: 0px;

            .tool {
                grid-template-columns: repeat(4, 1fr);
                grid-template-rows: 30px 30px;
                font-size: 12px;

                & .el-input {
                    grid-column: 1/4;
                }
            }

            .el-table--fit {
                height: 670px !important;
            }
        }

        &.moblieReducebar {
            transition: .3s;

            .barlist {
                top: -1000px;
            }

            :deep(.el-pagination) {
                padding: 10px 0;
            }
        }
    }

}
</style>

