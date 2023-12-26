import { defineStore } from 'pinia'
// import { dayjs } from 'element-plus';
import { useWindowSize } from '@vueuse/core'
const { width, height } = useWindowSize()
import { User } from '@/type/UserList'
import { Book } from '@/type/BookList'

export const useStore = defineStore('main', {
  state: () => {
    return {
      sidebar: false as boolean, //侧边栏是否展开
      mobileSidebar: false as boolean, //手机端侧边栏是否展开
      page: 2 as number, //当前页面
      //需要添加的用户信息
      userInfo: {} as User,
      //需要添加的图书书籍信息
      bookInfo: {} as Book,

      tableLoading: false as boolean,
    }
  },
  /**
     * 类似组件的 computed, 用来封装计算属性, 具有缓存特性
     */
  getters: {
    //时间格式化处理
    // setTime: (state) => dayjs.unix(state.time).format('YYYY-MM-DD') as string
    //当前设备是否为手机端
    isMobile() {
      return width.value <= 768
    }
  },
  /**
   * 类似组件的 methods, 封装业务逻辑, 修改state
   * 注意: 里面的函数不能定义成箭头函数(函数体中会用到this)
   */
  actions: {
    changeBar: function () {
      this.sidebar = !this.sidebar
    },
    changeMobileBar: function () {
      this.mobileSidebar = !this.mobileSidebar
    },
    resetUserInfo: function () {
      this.userInfo = {
        username: "",
        password: null,
        role: 1,
        email: "",
        phone: "",
        address: "",
        name: "",
        id: 0,
        created_at: "",
        token: null,
        sex: "男",
      }
    },
    resetBookInfo: function () {
      this.bookInfo = {
        book_name: "",
        author: "",
        cover: "" || "/src/assets/images/coverUndefined.png",
        introduction: "",
        publisher: "",
        publish_date: "",
        category_name: "",
        isbn: "",
        status: "",
      }
    }
  },

})
