<script setup lang='ts'>
import AddBookInfo from '@/components/AddBookInfo.vue';
import http from '@/http';
import { dayjs } from 'element-plus';
import { useStore } from '@/store';
import { LyNotification, checkboxTableRowAddClass, LyConfirm } from '@/utils/utils'
import { AjaxResponse, AjaxResponseMessage } from '@/type/AjaxResponse'
import { UserCountData, User, SoonReviseUserData } from '@/type/UserList'
import { Book, BookCountData } from '@/type/BookList';

const store = useStore()
const toolInfo = reactive({
    search: '',
    selected: [] as any,
    dialogUserVis: false,
    userInfoAdd: {},
    limit: 14,
    page: 1,
    total: 0,
})

let soonReviseUserData = ref<SoonReviseUserData[]>([])
const multipleTableRef = ref<any>()

watch(() => store.isMobile, (val) => {
    toolInfo.limit = val ? 17 : 6
    initTableData()
}, { immediate: true })

const data = ref<Book[]>([])

//指定行修改
const handleEdit = (item) => {
    multipleTableRef.value.toggleRowExpansion(item)
}
//提交修改
const submitEvent = (index) => {
    const data = soonReviseUserData.value[index]
    LyConfirm('warning', '是否确定修改当前用户', '修改后不可恢复', () => {
        const url = `/admin/Api/Book/updateUserListInfoAdmin`
        http('post', url, data).then((res: AjaxResponseMessage) => {
            if (res.code === 200) {
                LyNotification('success', res.message)
                initTableData()
            } else {
                LyNotification('error', res.message)
                store.tableLoading = false
            }
        })
    })

}

//重置修改框中的内容
const resetEvent = (item, index) => {
    setSoonReviseUserData(item, index)
}
//多选
const handleSelectionChange = (val) => {
    toolInfo.selected = val
}

//重置搜索
const handleResetSearch = () => {
    toolInfo.search = ''
    initTableData()
}
//添加用户事件
const addUserPost = () => {
    store.bookInfo.cover = store.bookInfo.cover.replace(/\/admin/g, '')

    http('post', '/admin/Api/Book/addBook', store.bookInfo)
        .then((res: AjaxResponseMessage) => {
            if (res.code === 200) {
                toolInfo.dialogUserVis = false
                store.resetUserInfo()
                LyNotification('success', res.message)
                initTableData()
            } else {
                LyNotification('error', res.message)
                store.tableLoading = false
            }
        })
}
//删除选中
const handleDeleteAll = () => {
    if (toolInfo.selected.length === 0) {
        return LyNotification('warning', '请选择要删除的用户',)

    }
    //获取要删除的用户id 整合
    let str = toolInfo.selected.map((res: any) => res.id)
    //进行删除
    devastateUser(str.join(','))
}

const handleCurrentChange = (val) => {
    toolInfo.page = val
    initTableData()
}


function renderData(url) {
    store.tableLoading = true
    const oldDate = dayjs()
    http('get', url).then((res: AjaxResponse<BookCountData>) => {
        if (res.code !== 200) {
            return LyNotification('error', res.message)
        }
        const dataResult = res.data.data
        const newDate = dayjs()
        data.value = dataResult
        dataResult.forEach((item, index) => {
            setSoonReviseUserData(item, index)
        })
        toolInfo.total = res.data.count
        if (newDate.diff(oldDate) < 1000) {
            setTimeout(() => {
                store.tableLoading = false
            }, 1000)
        } else {
            store.tableLoading = false
        }
    }).catch(err => {
        LyNotification("error", err.message)
        store.tableLoading = false
    })
}

function devastateUser(str: string) {
    LyConfirm('warning', '是否删除选中用户', '删除后不可恢复', () => {
        const url = `/admin/Api/Book/devastateUser`
        http('post', url, { id: str }).then((res: AjaxResponseMessage) => {
            if (res.code === 200) {
                LyNotification('success', res.message)
                initTableData()
            } else {
                LyNotification('error', res.message)
                store.tableLoading = false
            }
        })
    })
}

function initTableData() {
    //搜索内容不能包含 无效字符 比如：{ } [ ] ( ) ' " ` 
    toolInfo.search = toolInfo.search.replace(/[\{\}\[\]\(\)\'\"\`]/g, '')
    renderData(`/admin/Api/Book/queryBookList?limit=${toolInfo.limit}&page=${toolInfo.page}&search=${toolInfo.search}`)
}
function setSoonReviseUserData(item, index) {
    soonReviseUserData.value[index] = {
        id: item.id,
        name: item.name,
        phone: item.phone,
        email: item.email,
        role: item.role,
        sex: item.sex,
        address: item.address
    }
}
const deterSelectOn = (row) => {
    if (row.id === 1) {
        return false
    } else {
        return true
    }
}
const previewSrcList = () => {
    return data.value.map((item) => {
        return "/admin" + item.cover
    })
}
</script>

<template>
    <div class="tableMain">
        <div class="tool">
            <ElInput v-model="toolInfo.search" placeholder="输入账号、名称或者邮箱手机号" @keydown.enter="initTableData"></ElInput>
            <ElButton @click="initTableData">
                <LzyIcon name="gg:search" height="15px"></LzyIcon>
                <span>搜索</span>
            </ElButton>
            <ElButton @click="handleResetSearch">
                <LzyIcon name="gg:redo" height="16px"></LzyIcon>
                <span>重置</span>
            </ElButton>
            <ElButton @click="toolInfo.dialogUserVis = true">
                <LzyIcon name="gg:add-r" height="15px"></LzyIcon>
                <span>添加</span>
            </ElButton>
            <ElButton @click="handleDeleteAll">
                <LzyIcon name="gg:trash-empty" height="15px"></LzyIcon>
                <span>删除</span>
            </ElButton>
        </div>
        <el-table ref="multipleTableRef" :data="data" @selection-change="handleSelectionChange"
            v-zyloading="store.tableLoading" row-class-name="tableLzy" stripe :size="store.isMobile ? 'small' : 'large'"
            style="width: 100%;height:750px">
            <el-table-column type="selection" :selectable="deterSelectOn" width="30" />
            <!-- <el-table-column type="expand">
                <template #default="props">
                    <div class="expand"></div>
                </template>
            </el-table-column> -->
            <el-table-column prop="book_id" label="id" width="80px" />
            <el-table-column label="封面" width="100px">
                <template #default="scope">
                    <div class="cover">
                        <el-image :src="'/admin' + scope.row.cover" :zoom-rate="1.2" :max-scale="7" :min-scale="0.2"
                            :initial-index="scope.$index" hide-on-click-modal preview-teleported fit="cover"
                            :preview-src-list="previewSrcList()" lazy>
                            <template #error>
                                <img src="@/assets/images/coverUndefined.png" alt="">
                            </template>
                        </el-image>
                    </div>
                </template>
            </el-table-column>
            <el-table-column prop="book_name" label="图书名称" width="180" :show-overflow-tooltip="{ placement: 'left' }" />
            <el-table-column prop="author" label="作者" width="130" />
            <el-table-column prop="introduction" label="简介"
                :show-overflow-tooltip="{ placement: 'bottom', popperClass: 'tipsLzy' }" />
            <el-table-column prop="publisher" label="出版社" width="120"
                :show-overflow-tooltip="{ placement: 'bottom', popperClass: 'tipsLzy' }" />
            <el-table-column label="状态" width="60">
                <template #default="scope">
                    <el-tag v-if="scope.row.status == 0">在馆</el-tag>
                    <el-tag type="danger" v-else-if="scope.row.status == 1">借出</el-tag>
                </template>
            </el-table-column>
            <el-table-column prop="publish_date" label="出版日期" width="120" />
            <el-table-column prop="isbn" label="ISBN号" width="140"> </el-table-column>
            <el-table-column prop="category_name" label="图书类别" width="100" />

            <el-table-column label="操作" width="135">
                <template #default="scope">
                    <div class="operations">
                        <el-button size="small" @click="handleEdit(scope.row)">修改</el-button>
                        <el-button style="margin-left: 5px;" size="small" type="danger"
                            @click="devastateUser(scope.row.id)">删除</el-button>
                    </div>
                </template>
            </el-table-column>
        </el-table>
        <el-pagination v-model:current-page="toolInfo.page" :page-size="toolInfo.limit" background
            layout="  slot, prev, pager, next,total " :total="toolInfo.total" @current-change="handleCurrentChange">
            <span>已展示{{ data.length }}条 </span>

        </el-pagination>
        <!-- 用于添加用户信息 -->
        <el-dialog v-model="toolInfo.dialogUserVis" :class="{ ismobile: store.isMobile }" :fullscreen="store.isMobile"
            title="添加用户详情" align-center>
            <template #default>
                <AddBookInfo></AddBookInfo>
            </template>
            <template #footer>
                <div class="submit">
                    <ElButton @click="toolInfo.dialogUserVis = false">取消添加</ElButton>
                    <ElButton @click="store.resetUserInfo()">重置输入</ElButton>
                    <ElButton @click="addUserPost">添加图书</ElButton>
                </div>
            </template>
        </el-dialog>
    </div>
</template>
<style lang='scss' scoped>
.tableMain {
    display: grid;
    grid-template-rows: 30px 1fr;
    gap: 20px;

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
        font-family: 'dindin';

        :deep(.el-table__cell) {
            padding: 5px 0;
        }

        .expand {
            margin: 0 5%;
        }

        .cover {
            transition: .1s filter;
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
            color: #fff;
            cursor: pointer;
            user-select: none;

            &.el-tag--danger {
                background-color: #f56c6c;
            }
        }



        :deep(.el-table__inner-wrapper)::before {
            content: '';
            display: none;
        }

        :deep(.tableLzy) {
            animation-duration: 1s;

            &.animate__headShake {
                color: red !important;
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
