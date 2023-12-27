<script lang="ts" setup>
import { ElButton, ElImage, ElInput } from 'element-plus';
import { useStore } from '@/store'
import { LyNotification } from '@/utils/utils';
import http, { HttpResonse } from '@/http';
import { Book } from '@/type/BookList';
const store = useStore()
const { type } = defineProps<{ type: string }>()

const bookInfo = computed(() => type == "add" ? store.addBookInfo : store.reviseBookInfo)


const loading = ref(false)
const list = ref()

const remoteMethod = (query: string) => {
  loading.value = true
  setTimeout(async () => {
    loading.value = false
    const res = await http("get", "/admin/Api/Book/getBookCategoryList?search=" + query)
    list.value = res.data
  }, 50)
}

http("get", "/admin/Api/Book/getBookCategoryList")
  .then((res: HttpResonse<Book[]>) => {
    list.value = res.data
    if (type != "revise") return
    const catIdArr = res.data.filter((item: Book) => item.category_name == bookInfo.value.category_name)
    bookInfo.value.category_id = catIdArr[0].category_id
  })


const handleAvatarSuccess = (res: any,) => {
  bookInfo.value.cover = "/admin" + res.data
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

const isAdding = ref(false)
const categoryName = ref("")
const onAddOption = () => {
  isAdding.value = true
}
const onConfirm = () => {
  if (categoryName.value == "") {
    LyNotification(
      "error",
      "分类名称不能为空",
    );
    return
  }
  http("post", "/admin/Api/Book/addBookCategory", {
    categoryName: categoryName.value
  }).then((res: any) => {
    if (res.code == 200) {
      LyNotification(
        "success",
        "添加成功",
      );
      isAdding.value = false
      list.value.push({
        category_id: res.data,
        category_name: categoryName.value
      })
      bookInfo.value.category_id = res.data
    } else {
      LyNotification("error", res.message);
    }
  })
}
const clear = () => {
  isAdding.value = false
}
</script>
<template>
  <el-form label-width="100px" style="padding:10px 20px;" label-position="right">
    <div class="coverSherContent">
      <el-form-item label="书名">
        <ElInput v-model="bookInfo.book_name" placeholder="西游记" />
      </el-form-item>
      <el-form-item label="作者">
        <ElInput v-model="bookInfo.author" placeholder="吴承恩" />
      </el-form-item>
      <el-form-item class="cover">
        <!-- 图片 -->
        <el-upload class="avatar-uploader" action="/admin/Api/Book/uploadBookCover" :on-success="handleAvatarSuccess"
          :before-upload="beforeAvatarUpload" :show-file-list="false" accept="image/*" drag>
          <ElImage :src="bookInfo.cover" class="avatar">
            <template #error>
              <div class="image-slot">
                <img src="/admin/static/images/coverUndefined.png" alt="">
              </div>
            </template>
          </ElImage>

        </el-upload>
      </el-form-item>
      <el-form-item label="出版社">
        <ElInput v-model="bookInfo.publisher" placeholder="清华大学出版社" type="text" />
      </el-form-item>
      <el-form-item label="出版时间">
        <el-date-picker v-model="bookInfo.publish_date" type="date" />
      </el-form-item>
      <el-form-item label="书籍类型">
        <el-select v-model="bookInfo.category_id" filterable remote reserve-keyword placeholder="请选择" remote-show-suffix
          :remote-method="remoteMethod" :loading="loading">

          <el-option v-for="item in list" :key="item.category_id" :label="item.category_name" :value="item.category_id" />
          <template #footer>
            <ElButton v-if="!isAdding" text bg size="small" @click="onAddOption">
              添加分类
            </ElButton>
            <template v-else>
              <ElInput v-model="categoryName" class="option-input" placeholder="输入要添加的分类" size="small" />
              <ElButton style="margin-right: 10px;" type="primary" size="small" @click="onConfirm">
                添加
              </ElButton>
              <ElButton type="danger" size="small" @click="clear">取消</ElButton>
            </template>
          </template>
        </el-select>
      </el-form-item>
      <el-form-item label="ISBN编号">
        <ElInput v-model="bookInfo.isbn" placeholder="9787302521426"></ElInput>
      </el-form-item>
    </div>


    <el-form-item label="简介">
      <ElInput v-model="bookInfo.introduction" maxlength="200" :rows="4"
        placeholder="请在此处倾注您的文墨，细致描绘书籍的独特魅力，让每一位翻阅者都能在您的字里行间，窥见作者的智慧瑰宝，感受故事的深沉魅力。如孔子所言，'书犹草剪，快意其中'，请您的介绍成为引导读者走入书的世界的一把金钥匙，让他们在阅读的过程中收获知识，感悟人生。"
        show-word-limit type="textarea" />
    </el-form-item>
  </el-form>
</template>



<style lang="scss" scoped>
.coverSherContent {
  display: grid;
  grid-template-columns: 380px 1fr;
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

  :deep(.ElButton) {

    &:not(.is-disabled).is-has-bg:focus,
    &:not(.is-disabled).is-has-bg:hover {
      background-color: var(--theme)
    }
  }
}

.option-input {
  width: 100%;
  margin-bottom: 8px;
}
</style>
