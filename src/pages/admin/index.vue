<script setup lang='ts'>
import Sidebar from '@/components/Sidebar.vue'
import Content from '@/components/Content.vue'
import { useStore } from '@/store';
const store = useStore()
</script>

<template>
    <main id="main" :class="{ reducebar: store.sidebar }">
        <Sidebar />
        <Content />
    </main>
</template>

<style lang='scss' scoped>
#main {
    width: calc(100vw - 40px);
    height: calc(100vh - 40px);
    overflow: hidden;
    display: grid;
    grid-template-columns: 200px 1fr;
    gap: 10px;
    border-radius: 10px;
    margin: 10px;
    // padding: 10px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
    background-color: #f0f0f0;
    transition: .2s;

    &.reducebar {
        grid-template-columns: 60px 1fr;

        :deep(.logo) {
            display: block;
            padding: 10px 0;

            img {
                width: 40px;
                height: 40px;
            }

            span {
                display: none;
            }
        }

        :deep(.bar) {
            width: 30px;
            padding: 10px 5px;
            justify-content: center;

            span {
                display: none;
            }
        }

        :deep(.footer) {
            button {
                width: 40px;
            }

            span.title {
                display: none;
            }
        }
    }
}
</style>

