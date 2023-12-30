<script setup lang="ts">
import http from "@/http";
import { dayjs } from "element-plus";
import { useStore } from "@/store";
import { LyNotification } from "@/utils/utils";
import { AjaxResponse } from "@/type/AjaxResponse";
import { Book, BookCountData } from "@/type/BookList";

const store = useStore();
const toolInfo = reactive({
  search: "",
  selected: [] as any,
  limit: 14,
  page: 1,
  total: 0,
});

const multipleTableRef = ref<any>();

watch(
  () => store.isMobile,
  (val) => {
    toolInfo.limit = val ? 17 : 15;
    initTableData();
  },
  { immediate: true }
);

const data = ref<Book[]>([]);

//重置搜索
const handleResetSearch = () => {
  toolInfo.search = "";
  initTableData();
};

//切换页码
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
        return LyNotification("error", res.message);
      }
      data.value = res.data.data;
      const newDate = dayjs();
      toolInfo.total = res.data.count;
      // 判断当前请求是否小于1秒，如果小于1秒则延迟1秒关闭loading，否则直接关闭
      if (newDate.diff(oldDate) < 1000) {
        setTimeout(() => {
          store.tableLoading = false;
        }, 1000);
      } else {
        store.tableLoading = false;
      }
    })
    .catch((err) => {
      LyNotification("error", err.message);
      store.tableLoading = false;
    });
}

function initTableData() {
  //搜索内容不能包含 无效字符 比如：{ } [ ] ( ) ' " `
  toolInfo.search = toolInfo.search.replace(/[\{\}\[\]\(\)\'\"\`]/g, "");
  renderData(
    `/admin/Api/bookLoan/getList?limit=${toolInfo.limit}&page=${toolInfo.page}&search=${toolInfo.search}`
  );
}
</script>

<template>
  <div class="tableMain">
    <div class="tool">
      <ElInput
        v-model="toolInfo.search"
        placeholder="输入账号、名称或者邮箱手机号"
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
    </div>
    <el-table
      ref="multipleTableRef"
      :data="data"
      v-zyloading="store.tableLoading"
      row-class-name="tableLzy"
      stripe
      :size="store.isMobile ? 'small' : 'large'"
      style="width: 100%; height: 750px"
    >
      <el-table-column prop="loanId" label="借阅id" width="80px" />
      <el-table-column
        prop="bookName"
        label="图书名称"
        :show-overflow-tooltip="{ placement: 'bottom' }"
      />
      <el-table-column prop="bookIsbn" label="图书isbn" width="150" />
      <el-table-column prop="name" label="借出用户" width="130" />
      <el-table-column label="借出日期" width="120">
        <template #default="{ row }">
          <span>{{ dayjs(row.loanDate).format("YYYY-MM-DD") }}</span>
        </template>
      </el-table-column>
      <el-table-column label="到期时间" width="120">
        <template #default="{ row }">
          <span>{{ dayjs(row.dueDate).format("YYYY-MM-DD") }}</span>
        </template>
      </el-table-column>
      <el-table-column label="实际还书日期" width="120">
        <template #default="{ row }">
          <el-tag v-if="row.returnDate" type="success">已归还</el-tag>
          <el-tag v-else type="danger">未归还</el-tag>
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
    grid-template-columns: 20% repeat(4, 70px) 100px;
    gap: 10px;

    .el-button {
      font-size: 14px;

      svg {
        margin-right: 2px;
      }
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

    .el-tag {
      background-color: var(--theme);
      color: #fff;
      cursor: pointer;
      user-select: none;

      &.el-tag--danger {
        background-color: #f56c6c;
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
</style>
