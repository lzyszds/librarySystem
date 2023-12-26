<script lang="ts" setup>
import LzyIcon from './lzyIcon.vue';
import { ElImage, ElInput } from 'element-plus';
import { useStore } from '@/store'
import { LyNotification } from '@/utils/utils';
const store = useStore()
store.bookInfo.cover = store.bookInfo.cover || "/src/assets/images/coverUndefined.png"
const loading = ref(false)
const list = ref()
onMounted(() => {
  list.value = states.map((item, index) => {
    return { value: index + 1, label: item }
  })
})
const remoteMethod = (query: string) => {
  loading.value = true
  setTimeout(() => {
    loading.value = false
    options.value = list.value.filter((item) => {
      return item.label.toLowerCase().includes(query.toLowerCase())
    })
  }, 200)
}


const states = [
  "神魔小说",
  'Alabama',
  'Alaska',
  'Arizona',
  'Arkansas',
  'California',
  'Colorado',
  'Connecticut',
  'Delaware',
  'Florida',
  'Georgia',
  'Hawaii',
  'Idaho',

]
const options = ref<any>([])

const handleAvatarSuccess = (res: any,) => {
  store.bookInfo.cover = "/admin" + res.data
}
const beforeAvatarUpload = (file) => {
  const isLt2M = file.size / 1024 / 1024 < 2;
  if (!isLt2M) {
    LyNotification(
      "error",
      "上传图片大小不能超过 2MB!",
    );
  }
  return isLt2M;
}
</script>
<template>
  <el-form :model="store.bookInfo" label-width="100px" style="padding:10px 20px;" label-position="right">
    <div class="coverSherContent">
      <el-form-item label="书名">
        <ElInput v-model="store.bookInfo.book_name" placeholder="西游记" />
      </el-form-item>
      <el-form-item label="作者">
        <ElInput v-model="store.bookInfo.author" placeholder="吴承恩" />
      </el-form-item>
      <el-form-item class="cover">
        <!-- 图片 -->
        <el-upload class="avatar-uploader" action="/admin/Api/Book/uploadBookCover" :on-success="handleAvatarSuccess"
          :before-upload="beforeAvatarUpload" :show-file-list="false" accept="image/*" drag>
          <ElImage :src="store.bookInfo.cover" class="avatar">
            <template #error>
              <div class="image-slot">
                <img src="/src/assets/images/coverUndefined.png" alt="">
              </div>
            </template>

          </ElImage>

        </el-upload>
      </el-form-item>
      <el-form-item label="出版社">
        <ElInput v-model="store.bookInfo.publisher" placeholder="清华大学出版社" type="text" />
      </el-form-item>
      <el-form-item label="出版时间">
        <el-date-picker v-model="store.bookInfo.publish_date" type="date" />
      </el-form-item>
      <el-form-item label="书籍类型">
        <el-select v-model="store.bookInfo.category_id" filterable remote reserve-keyword placeholder="请选择"
          remote-show-suffix :remote-method="remoteMethod" :loading="loading">

          <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
      </el-form-item>
      <el-form-item label="ISBN编号">
        <ElInput v-model="store.bookInfo.isbn" placeholder="9787302521426"></ElInput>
      </el-form-item>
    </div>


    <el-form-item label="简介">
      <ElInput v-model="store.bookInfo.introduction" maxlength="200" :rows="4"
        placeholder="请在此处倾注您的文墨，细致描绘书籍的独特魅力，让每一位翻阅者都能在您的字里行间，窥见作者的智慧瑰宝，感受故事的深沉魅力。如孔子所言，'书犹草剪，快意其中'，请您的介绍成为引导读者走入书的世界的一把金钥匙，让他们在阅读的过程中收获知识，感悟人生。"
        show-word-limit type="textarea" />
    </el-form-item>
  </el-form>
</template>



<style lang="scss" scoped>
.coverSherContent {
  display: grid;
  grid-template-areas:
    'sher cover'
    'date cover'
    'select cover'
    'select cover'
    'select cover'
    'select cover'
  ;

  :deep(.el-form-item) {
    align-self: center;
  }

  :deep(.el-upload-dragger) {
    padding: 0;
    padding-top: 20px;
  }

  .cover {
    grid-area: cover;
    position: relative;

    text-align: center;

    :deep(img) {
      width: 180px;
      height: 279px;
      border-radius: 10px;
      filter: drop-shadow(1px 3px 5px);
      object-fit: cover;
    }

    :deep(.el-form-item__label) {
      align-self: center;
    }

    :deep(.el-form-item__content) {
      margin-left: 40px !important;

    }

  }

  :deep(.el-form-item__content) {
    &>div {
      width: 100%;
    }
  }
}
</style>
