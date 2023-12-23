import { defineStore } from 'pinia'
// import { dayjs } from 'element-plus';


export const useStore = defineStore('main', {
  state: () => {
    return {
      sidebar: false as boolean, //侧边栏是否展开
      page: 4 as number, //当前页面
      userInfo: {
        username: "" as string,
        role: 1 as number,
        sex: "男" as string,
        email: "" as string,
        phone: "" as string,
        address: "" as string,
        name: "" as string,
      },
      tableLoading: false as boolean,
    }
  },
  /**
     * 类似组件的 computed, 用来封装计算属性, 具有缓存特性
     */
  getters: {
    //时间格式化处理
    // setTime: (state) => dayjs.unix(state.time).format('YYYY-MM-DD') as string
  },
  /**
   * 类似组件的 methods, 封装业务逻辑, 修改state
   * 注意: 里面的函数不能定义成箭头函数(函数体中会用到this)
   */
  actions: {
    changeBar: function () {
      this.sidebar = !this.sidebar
    },
    resetUserInfo: function () {
      this.userInfo = {
        username: "",
        role: 1,
        sex: "男",
        email: "",
        phone: "",
        address: "",
        name: "",
      }
    }
  },

})
