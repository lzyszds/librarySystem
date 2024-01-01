import { ElNotification, ElMessageBox } from 'element-plus'

//监听请求时间，如果时间过短，就让结果延迟1s返回
export const delay = (time: number) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(true)
    }, time)
  })
}

//element plus ElNotification封装
export const LyNotification = (options: {
  type: 'success' | 'warning' | 'info' | 'error',
  message: string,
  duration?: number,
  title?: string,
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left'
}) => {
  ElNotification(options.title ? options : { ...options, title: '温馨提醒' })
}

//element确认框 封装
export const LyConfirm = (type: 'warning' | 'info' | 'error' = 'warning', message: string, title: string = '温馨提醒', fn) => {
  ElMessageBox.confirm(message, title, {
    type,
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    confirmButtonClass: 'el-button--danger',
  })
    .then(() => {
      fn.apply(this)
    })
    .catch(() => {
      LyNotification({ type: 'info', message: '已取消操作' })
    })
}


//同步延时器
export const delaySync = async (time: number, fn) => {

  return setTimeout(() => {
    fn.apply(this)
  }, time);;

}

/**
 * @description: checkbox选中表格行添加类名 
 * @param {refVm} refVm 表格ref
 * @param {classname} classname 类名
 * @param {message} message 提示信息
 * @return {*}
*/
export const checkboxTableRowAddClass = async (refVm, classname, message) => {
  //获取dom元素
  const trNodeVMList = refVm.$el.querySelectorAll('.tableLzy')
  for (const item of trNodeVMList) {
    //检查是否选中
    const isSelect = item.children[0].querySelector('.el-checkbox').classList.contains('is-checked')
    if (isSelect) {
      item.classList.add(classname)
      await delaySync(1000, () => {
        item.classList.remove(classname);
      })
    }
  }

  return LyNotification('warning', message)
};


