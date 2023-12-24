<script setup lang='ts'>
import AddUserInfo from '@/components/AddUserInfo.vue';
import http from '@/http';
import { dayjs } from 'element-plus';
import { useStore } from '@/store';
import { LyNotification, checkboxTableRowAddClass, LyConfirm } from '@/utils/utils'
const store = useStore()
const toolInfo = reactive({
    searchTable: '',
    selected: [] as any,
    dialogUserVis: false,
    userInfoAdd: {},
    limit: 17,
    page: 1,
    total: 0,
})
const multipleTableRef = ref<any>()

watch(() => store.isMobile, (val) => {
    toolInfo.limit = val ? 10 : 15
    initTableData()
})

const data = ref<any>([])
//表格数据初始化
initTableData()

//指定行修改
const handleEdit = (item) => {

}
//多选
const handleSelectionChange = (val) => {
    toolInfo.selected = val
}

//模糊查询
const fuzzyquery = () => {
    const url = `/admin/Api/querySearchUsers?limit=${toolInfo.limit}&page=${toolInfo.page}&search=${toolInfo.searchTable}`
    renderData(url)
}
//重置搜索
const handleResetSearch = () => {
    toolInfo.searchTable = ''
    const url = `/admin/Api/querySearchUsers?limit=${toolInfo.limit}&page=${toolInfo.page}&search=`
    renderData(url)
}
//添加用户事件
const addUserPost = () => {
    http('post', '/admin/Api/register', store.userInfo).then(res => {
        if (res.code === 200) {
            toolInfo.dialogUserVis = false
            store.resetUserInfo()
            LyNotification('success', res.message)
            initTableData()
        } else {
            LyNotification('error', res.message)
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
//重置密码
const handleResetPassword = async () => {
    if (toolInfo.selected.length !== 1) {
        checkboxTableRowAddClass(multipleTableRef.value, 'animate__headShake', '请选择一个用户进行(单一用户)')
        return
    }

    LyConfirm('warning', '是否重置选中用户密码', '重置后密码跟账号相同', () => {
        const url = `/admin/Api/resetPassword`
        http('post', url, { id: toolInfo.selected[0].id }).then(res => {
            if (res.code === 200) {
                LyNotification('success', res.message)
                initTableData()
            } else {
                LyNotification('error', res.message)
            }
        })
    })
}

const handleCurrentChange = (val) => {
    toolInfo.page = val
    const url = `/admin/Api/querySearchUsers?limit=${toolInfo.limit}&page=${toolInfo.page}&search=${toolInfo.searchTable}`
    renderData(url)
}


function renderData(url) {
    store.tableLoading = true
    const oldDate = dayjs()
    http('get', url).then((res: any) => {
        const newDate = dayjs()
        data.value = res.data.data
        toolInfo.total = res.data.count
        if (newDate.diff(oldDate) < 1000) {
            setTimeout(() => {
                store.tableLoading = false
            }, 1000)
        } else {
            store.tableLoading = false
        }
    }).catch(err => {
        LyNotification(err, 'error')
    })
}

function devastateUser(str: string) {
    LyConfirm('warning', '是否删除选中用户', '删除后不可恢复', () => {
        const url = `/admin/Api/devastateUser`
        http('post', url, { id: str }).then(res => {
            if (res.code === 200) {
                LyNotification('success', res.message)
                initTableData()
            } else {
                LyNotification('error', res.message)
            }
        })
    })
}

function initTableData() {
    renderData(`/admin/Api/queryUserList?limit=${toolInfo.limit}&page=${toolInfo.page}`)
}
const deterSelectOn = (row) => {
    if (row.id === 1) {
        return false
    } else {
        return true
    }
}
</script>

<template>
    <div class="tableMain">
        <div class="tool">
            <ElInput v-model="toolInfo.searchTable" placeholder="输入账号、名称或者邮箱手机号" @keydown.enter="fuzzyquery"></ElInput>
            <ElButton @click="fuzzyquery">
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
            <ElButton @click="handleResetPassword">
                <LzyIcon name="gg:lock-unlock" height="15px"></LzyIcon>
                <span>重置密码</span>
            </ElButton>
        </div>
        <el-table ref="multipleTableRef" :data="data" @selection-change="handleSelectionChange"
            v-zyloading="store.tableLoading" row-class-name="tableLzy" style="width: 100%;height:750px">
            <el-table-column type="selection" :selectable="deterSelectOn" width="55" />
            <el-table-column type="expand">
                <template #default="props">
                    <div class="expand">
                        <el-descriptions title="User Info" border>
                            <el-descriptions-item label="名称">{{ props.row.name }}</el-descriptions-item>
                            <el-descriptions-item label="手机号">{{ props.row.phone }}</el-descriptions-item>
                            <el-descriptions-item label="邮箱">{{ props.row.email }}</el-descriptions-item>
                            <el-descriptions-item label="级别">
                                <el-tag size="small">{{ props.row.role == 0 ? '管理员' : '普通用户' }}</el-tag>
                            </el-descriptions-item>
                            <el-descriptions-item label="性别">
                                <el-tag size="small">{{ props.row.sex }}</el-tag>
                            </el-descriptions-item>
                            <el-descriptions-item label="地址">{{ props.row.address }}</el-descriptions-item>
                        </el-descriptions>
                    </div>
                </template>
            </el-table-column>
            <el-table-column prop="id" label="id" width="80px" />
            <el-table-column prop="name" label="名称" width="100px" :show-overflow-tooltip="{ placement: 'left' }" />
            <el-table-column prop="username" label="账号" />
            <el-table-column prop="sex" label="性别" width="60px" />
            <el-table-column prop="phone" label="手机号" width="120" />
            <el-table-column prop="email" label="邮箱" :show-overflow-tooltip="{ placement: 'left' }" />
            <el-table-column label="级别" width="80">
                <template #default="scope">
                    <el-tag v-if="scope.row.role === 0">管理员</el-tag>
                    <el-tag v-else>普通用户</el-tag>
                </template>
            </el-table-column>
            <el-table-column label="地址" prop="address" :show-overflow-tooltip="{ placement: 'left' }" />
            <el-table-column prop="created_at" label="创建时间" width="120" />
            <el-table-column label="操作" width="130">
                <template #default="scope">
                    <el-button size="small" @click="handleEdit(scope.row)">修改</el-button>
                    <el-button style="margin-left: 5px;" size="small" type="danger"
                        @click="devastateUser(scope.row.id)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
        <el-pagination v-model:current-page="toolInfo.page" :page-size="toolInfo.limit" background
            layout="  slot, prev, pager, next,total " :total="toolInfo.total" @current-change="handleCurrentChange">
            <span>已展示{{ data.length }}条 </span>

        </el-pagination>
        <!-- 用于添加用户信息 -->
        <el-dialog v-model="toolInfo.dialogUserVis" title="添加用户详情" align-center>
            <template #default>
                <AddUserInfo></AddUserInfo>
            </template>
            <template #footer>
                <div class="submit">
                    <ElButton @click="toolInfo.dialogUserVis = false">取消添加</ElButton>
                    <ElButton @click="store.resetUserInfo()">重置输入</ElButton>
                    <ElButton @click="addUserPost">添加用户</ElButton>
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

        .expand {
            margin: 0 5%;
        }

        .el-tag {
            background-color: var(--theme);
            color: #fff;
            cursor: pointer;
            user-select: none;
        }

        :deep(.el-table__body-wrapper) {
            tbody {
                .cell {
                    max-height: 28px;
                    /* 设置行的最小高度为40px，根据实际需求调整 */
                    /* 超出范围显示省略号 */
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                }
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

    .el-pagination.is-background {
        justify-content: center;
    }

}


.submit {
    display: flex;
    gap: 10px;
    justify-content: end;
}
</style>
