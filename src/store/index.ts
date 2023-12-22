import { defineStore } from 'pinia'
// import { dayjs } from 'element-plus';


export const useStore = defineStore('main', {
  state: () => {
    return {
      sidebar: false as boolean
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
    }
  },

})
