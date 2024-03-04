<script setup lang="ts">
import AddBookInfo from "@/components/AddBookInfo.vue";
import http from "@/http";
import { dayjs } from "element-plus";
import { useStore } from "@/store";
import { LyNotification, LyConfirm } from "@/utils/utils";
import { AjaxResponse, AjaxResponseMessage } from "@/type/AjaxResponse";
import { Book, BookCountData } from "@/type/BookList";

const store = useStore();
const toolInfo = reactive({
  search: "",
  selected: [] as any,
  dialogAddVis: false,
  dialogReviseVis: false,
  dialogReviseData: {} as any,
  limit: 14,
  page: 1,
  total: 0,
  activeBookData: {} as Book,
});

const excelFile = ref<any>();

const multipleTableRef = ref<any>();

watch(
  () => store.isMobile,
  (val) => {
    toolInfo.limit = val ? 17 : 6;
    initTableData();
  },
  { immediate: true }
);

const data = ref<Book[]>([]);

//指定行修改
const handleEdit = (item) => {
  toolInfo.dialogReviseVis = true;
  store.resetReviseBookInfo({ ...item });
  toolInfo.activeBookData = { ...item };
};
//提交修改
const submitEvent = () => {
  LyConfirm("warning", "是否确定修改当前图书", "修改后不可恢复", () => {
    const url = `/admin/Api/Book/saveBookInfo`;
    console.log(store.reviseBookInfo);
    http("post", url, store.reviseBookInfo).then((res: AjaxResponseMessage) => {
      if (res.code === 200) {
        toolInfo.dialogReviseVis = false;
        LyNotification({ type: "success", message: res.message });
        initTableData();
      } else {
        LyNotification({ type: "error", message: res.message });
        store.tableLoading = false;
      }
    });
  });
};

const resetReviseBookInfo = () => {
  store.resetReviseBookInfo(toolInfo.activeBookData);
};

//多选
const handleSelectionChange = (val) => {
  toolInfo.selected = val;
};

//重置搜索
const handleResetSearch = () => {
  toolInfo.search = "";
  initTableData();
};
//添加图书事件
const addBookPost = () => {
  store.addBookInfo.cover =
    store.addBookInfo.cover && store.addBookInfo.cover.replace(/\/admin/g, "");

  http("post", "/admin/Api/Book/saveBookInfo", store.addBookInfo).then(
    (res: AjaxResponseMessage) => {
      if (res.code === 200) {
        toolInfo.dialogAddVis = false;
        LyNotification({ type: "success", message: res.message });
        initTableData();
        store.resetAddBookInfo();
      } else {
        LyNotification({ type: "error", message: res.message });
        store.tableLoading = false;
      }
    }
  );
};
//文件上传添加图书（批量添加）
const excelUpdate = (res) => {
  LyNotification({ type: "success", message: res.message });
  initTableData();
};

//文件上传超出限制
const excelUpdateExceed = () => {
  LyNotification({ type: "warning", message: "只能上传一个文件" });
};

//删除选中
const handleDeleteAll = () => {
  if (toolInfo.selected.length === 0) {
    return LyNotification({ type: "warning", message: "请选择要删除的图书" });
  }
  //获取要删除的图书id 整合
  let str = toolInfo.selected.map((res: any) => res.book_id);
  //进行删除
  devastateBook(str.join(","));
};

const handleCurrentChange = (val) => {
  toolInfo.page = val;
  initTableData();
};

//获取数据并渲染
function renderData(url) {
  store.tableLoading = true;
  const oldDate = dayjs();
  http("get", url)
    .then((res: AjaxResponse<BookCountData>) => {
      if (res.code !== 200) {
        return LyNotification({ type: "error", message: res.message });
      }
      const dataResult = res.data.data;
      const newDate = dayjs();
      data.value = dataResult.map((item) => {
        if (item.cover === null) item.cover = "/static/images/coverUndefined.png";
        return item;
      });
      toolInfo.total = res.data.count;
      // 判断当前请求是否小于1秒，如果小于1秒则延迟1秒关闭loading，否则直接关闭
      if (newDate.diff(oldDate) < 500) {
        setTimeout(() => {
          store.tableLoading = false;
        }, 500);
      } else {
        store.tableLoading = false;
      }
    })
    .catch((err) => {
      LyNotification({ type: "error", message: err.message });
      store.tableLoading = false;
    });
}

function devastateBook(str: string) {
  LyConfirm("warning", "是否删除选中图书", "删除后不可恢复", () => {
    const url = `/admin/Api/Book/devastateBook`;
    http("post", url, { id: str }).then((res: AjaxResponseMessage) => {
      if (res.code === 200) {
        LyNotification({ type: "success", message: res.message });
        initTableData();
      } else {
        LyNotification({ type: "error", message: res.message });
        store.tableLoading = false;
      }
    });
  });
}

function initTableData() {
  //搜索内容不能包含 无效字符 比如：{ } [ ] ( ) ' " `
  toolInfo.search = toolInfo.search.replace(/[\{\}\[\]\(\)\'\"\`]/g, "");
  renderData(
    `/admin/Api/Book/getBookList?limit=${toolInfo.limit}&page=${toolInfo.page}&search=${toolInfo.search}`
  );
}

const deterSelectOn = (row) => {
  if (row.id === 1) {
    return false;
  } else {
    return true;
  }
};
const previewSrcList = () => {
  return data.value.map((item) => {
    return "/admin" + item.cover;
  });
};
</script>

<template>
  <div class="tableMain">
    <div class="tool">
      <ElInput
        v-model="toolInfo.search"
        placeholder="输入书名、出版社或者作者分类等"
        @keydown.enter="initTableData"
      ></ElInput>
      <ElButton @click="initTableData">
        <LzyIcon name="gg:search" height="15px"></LzyIcon>
        <span>搜索</span>
      </ElButton>
      <ElButton @click="handleResetSearch">
        <LzyIcon name="gg:redo" height="16px"></LzyIcon>
        <span>重置</span>
      </ElButton>
      <ElButton @click="toolInfo.dialogAddVis = true">
        <LzyIcon name="gg:add-r" height="15px"></LzyIcon>
        <span>添加</span>
      </ElButton>
      <el-upload
        v-model:file-list="excelFile"
        class="upload-demo"
        action="/admin/Api/Book/addBooksExcel"
        :limit="1"
        show-file-list="false"
        accept=".xlsx"
        :on-exceed="excelUpdateExceed"
        :on-success="excelUpdate"
      >
        <ElButton>
          <LzyIcon name="gg:add-r" height="15px"></LzyIcon>
          <span>Excel添加</span>
        </ElButton>
      </el-upload>
      <ElButton @click="handleDeleteAll">
        <LzyIcon name="gg:arrow-down-r" height="15px"></LzyIcon>
        <span>导出</span>
      </ElButton>
      <ElButton @click="handleDeleteAll">
        <LzyIcon name="gg:trash-empty" height="15px"></LzyIcon>
        <span>删除</span>
      </ElButton>
    </div>
    <el-table
      ref="multipleTableRef"
      :data="data"
      @selection-change="handleSelectionChange"
      v-zyloading="store.tableLoading"
      row-class-name="tableLzy"
      stripe
      :size="store.isMobile ? 'small' : 'large'"
      style="width: 100%; height: 750px; transform: scale(1)"
    >
      <el-table-column type="selection" :selectable="deterSelectOn" width="30" />
      <el-table-column prop="book_id" label="id" width="80px" />
      <el-table-column label="封面" width="100px">
        <template #default="scope">
          <div class="cover">
            <el-image
              :src="'/admin' + scope.row.cover"
              :zoom-rate="1.2"
              :max-scale="7"
              :min-scale="0.2"
              :initial-index="scope.$index"
              hide-on-click-modal
              preview-teleported
              fit="cover"
              :preview-src-list="previewSrcList()"
              lazy
            >
              <template #error>
                <img src="/admin/static/images/coverUndefined.png" alt="" />
              </template>
            </el-image>
          </div>
        </template>
      </el-table-column>
      <el-table-column
        prop="book_name"
        label="图书名称"
        width="180"
        :show-overflow-tooltip="true"
      />
      <el-table-column
        prop="author"
        label="作者"
        width="130"
        :show-overflow-tooltip="{ placement: 'bottom' }"
      />
      <el-table-column
        prop="introduction"
        label="简介"
        :show-overflow-tooltip="{ placement: 'bottom', popperClass: 'tipsLzy' }"
      />
      <el-table-column
        prop="publisher"
        label="出版社"
        width="120"
        :show-overflow-tooltip="{ placement: 'bottom', popperClass: 'tipsLzy' }"
      />
      <el-table-column label="状态" width="60">
        <template #default="scope">
          <el-tag v-if="scope.row.is_borrowable == 0">外借</el-tag>
          <el-tag type="danger" v-else-if="scope.row.is_borrowable == 1">内阅</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="publish_date" label="出版日期" width="120" />
      <el-table-column prop="isbn" label="ISBN号" width="150"> </el-table-column>
      <el-table-column prop="category_name" label="图书类别" width="100" />

      <el-table-column label="操作" width="135">
        <template #default="scope">
          <div class="operations">
            <el-button size="small" @click="handleEdit(scope.row)">修改</el-button>
            <el-button
              style="margin-left: 5px"
              size="small"
              type="danger"
              @click="devastateBook(scope.row.book_id)"
              >删除
            </el-button>
          </div>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      v-model:current-page="toolInfo.page"
      :page-size="toolInfo.limit"
      background
      layout="  slot, prev, pager, next,total "
      :total="toolInfo.total"
      @current-change="handleCurrentChange"
    >
      <span>已展示{{ data.length }}条 </span>
    </el-pagination>
    <!-- 用于添加图书信息 -->
    <el-dialog
      v-model="toolInfo.dialogAddVis"
      :class="{ ismobile: store.isMobile }"
      :fullscreen="store.isMobile"
      title="添加图书详情"
      align-center
      v-if="toolInfo.dialogAddVis"
      :append-to-body="true"
    >
      <template #default>
        <AddBookInfo type="add"></AddBookInfo>
      </template>
      <template #footer>
        <div class="submit">
          <ElButton @click="toolInfo.dialogAddVis = false">取消添加</ElButton>
          <ElButton @click="store.resetAddBookInfo()">重置输入</ElButton>
          <ElButton @click="addBookPost">添加图书</ElButton>
        </div>
      </template>
    </el-dialog>
    <el-dialog
      v-model="toolInfo.dialogReviseVis"
      :class="{ ismobile: store.isMobile }"
      :fullscreen="store.isMobile"
      title="修改图书信息"
      align-center
      v-if="toolInfo.dialogReviseVis"
      :append-to-body="true"
    >
      <template #default>
        <AddBookInfo type="revise"></AddBookInfo>
      </template>
      <template #footer>
        <div class="submit">
          <ElButton @click="toolInfo.dialogReviseVis = false">取消添加</ElButton>
          <ElButton @click="resetReviseBookInfo">恢复重置</ElButton>
          <ElButton @click="submitEvent">修改图书</ElButton>
        </div>
      </template>
    </el-dialog>
  </div>
</template>
<style lang="scss" scoped>
.tableMain {
  display: grid;
  grid-template-rows: 30px 1fr;
  gap: 20px;

  :deep(.el-textarea .el-input__count) {
    bottom: -20px;
    right: 0;
  }

  .tool {
    display: grid;
    grid-template-columns: 20% repeat(3, 70px) 110px repeat(2, 70px);
    gap: 10px;

    .el-button {
      font-size: 14px;

      svg {
        margin-right: 2px;
      }
    }
    .upload-demo {
      z-index: 99;
    }
  }

  .el-table {
    font-family: "dindin";

    :deep(.el-table__cell) {
      padding: 5px 0;
    }

    .expand {
      margin: 0 5%;
    }

    .cover {
      transition: 0.1s filter;
      cursor: pointer;
      height: 100px;
      width: 70px;
      display: flex;
      place-items: center;

      :deep(img) {
        object-fit: cover;
        width: 60px;
        height: 90px;
        border-radius: 10px;
        border: 2px solid var(--theme);
      }

      &:hover {
        :deep(img) {
          filter: hue-rotate(45deg);
        }
      }
    }

    .el-tag {
      background-color: var(--theme);
      color: var(--bgTheme);
      cursor: pointer;
      user-select: none;

      &.el-tag--danger {
        background-color: #f56c6c;
      }
    }

    :deep(.el-table__inner-wrapper)::before {
      content: "";
      display: none;
    }

    :deep(.tableLzy) {
      animation-duration: 1s;

      &.animate__headShake {
        color: #f56c6c !important;
      }
    }
  }

  :deep(.ismobile) {
    border-radius: 0;
  }

  .el-pagination.is-background {
    justify-content: center;
  }
}

:deep(.tipsLzy) {
  max-width: 300px;
  word-break: break-all;
}

.submit {
  display: flex;
  gap: 10px;
  justify-content: end;
}
</style>
