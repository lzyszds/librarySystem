<script setup lang="ts">
import { useStore } from "@/store";
import { useWindowSize } from "@vueuse/core";
const { width } = useWindowSize();
const store = useStore();
watch(
  () => width.value,
  (val) => {
    if (val < 1024) {
      console.log("小于1024");
      if (store.sidebar === false) {
        store.changeBar();
      }
      console.log(store.sidebar);
    }
  }
);
</script>

<template>
  <Suspense>
    <router-view> </router-view>
  </Suspense>
</template>
