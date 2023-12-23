

//监听请求时间，如果时间过短，就让结果延迟1s返回
export const delay = (time: number) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(true)
    }, time)
  })
}
