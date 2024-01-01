// 一、配置axios
import axios, { AxiosResponse } from 'axios'
import { ElMessageBox } from 'element-plus'
import { getCookie, setCookie } from 'lzyutils'

// 导入路由实例
import router from '@/router/index';

export interface HttpResonse<T> {
  code: number
  data: T,
  message: string,
  msg?: string,
  total?: number,
  err?: object
}

// 创建axios实例
const instance = axios.create({
  baseURL: window.location.origin,
  // 请求超时时间，单位毫秒
  // timeout: 5000,
  // 允许跨域请求时是否需要使用凭证
  withCredentials: true,
})

// 添加响应拦截器
instance.interceptors.response.use((response: AxiosResponse): any => {
  // 如果响应状态码是200，则返回响应数据
  if (response.status === 200) {
    // 如果响应数据中包含status字段，并且status字段的值是401，则表示登录过期
    if (response.data.status == '401' || response.data == "You don't have permission to access this resource") {
      // 弹出登录验证失败的提示框
      let timer = setTimeout(() => {
        router.push('/login')
        ElMessageBox.close()
      }, 1000 * 2)

      // 销毁token cookie
      setCookie('token', '', -1)

      ElMessageBox.alert('登陆验证失败，请重新登陆！！(2秒后自动退出)', '提示', {
        // 确认按钮的文本
        confirmButtonText: '确定',
        // 回调函数
        callback: () => {
          // 跳转到登录页面
          router.push('/login')
          // 清除定时器
          clearTimeout(timer)
          // 关闭提示框
          ElMessageBox.close()
        },
      })

      // 返回一个Promise，并reject一个错误对象
      return Promise.resolve({
        code: 401,
        data: '未登录',
      })
    } else {
      // 返回响应数据
      return Promise.resolve(response)
    }
  } else {
    // 如果响应状态码不是200，则返回一个错误对象
    return Promise.reject(identifyCode(response.status, response))
  }
})

// 将自定义的HttpResonse接口导出
export default async function http<T>(method = 'get', url = '', data = {}, headers = {}): Promise<HttpResonse<T>> {
  // 设置默认头部信息
  const defaultHeaders = {
    'access-control-allow-origin': '*',
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin-Type': '*',
    'Authorization': getCookie("token") || '',
  };

  // 合并默认头部与自定义头部
  headers = { ...defaultHeaders, ...headers };

  // 判断是否为多部分请求
  const isMultipart = headers['Content-Type'] === 'multipart/form-data';

  try {
    // 发送请求
    const response = await instance({ method, url, data, headers });

    // 返回响应数据
    return response.data as HttpResonse<T>; // 假设响应数据为getComType[]类型
  } catch (error: any) {
    // 处理错误
    unlistedValidate(error.response)
    return Promise.reject(error);
  }
}

// 识别错误代码
function identifyCode(code: number | string, err: any) {
  switch (code) {
    case 400:
      code = '请求错误'
      break;
    case 401:
      code = '未授权，请登录'
      break;
    case 403:
      code = '拒绝访问'
      break;
    case 404:
      code = `请求地址出错: ${err.response.config.url}`
      break;
    case 408:
      code = '请求超时'
      break;
    case 500:
      code = '服务器内部错误'
      break;
    case 501:
      code = '服务未实现'
      break;
    case 502:
      code = '网关错误'
      break;
    case 503:
      code = '服务不可用'
      break;
    case 504:
      code = '网关超时'
      break;
    case 505:
      code = 'HTTP版本不受支持'
      break;
    default:
      code = '未知错误'
      break;
  }

  return code
}

// 处理未列出的错误
function unlistedValidate(response: AxiosResponse) {
  // 如果响应数据中包含status字段，并且status字段的值是403，则表示没有权限访问该资源
  if (response.data.status == '403' || response.data == "You don't have permission to access this resource") {
    // 弹出登录验证失败的提示框
    let timer = setTimeout(() => {
      router.push('/login')
      ElMessageBox.close()
    }, 1000 * 3)

    // 销毁token cookie
    setCookie('token', '', -1)

    ElMessageBox.alert('登陆验证失败，请重新登陆！！(3秒后自动退出)', '提示', {
      // 确认按钮的文本
      confirmButtonText: '确定',
      // 回调函数
      callback: () => {
        // 跳转到登录页面
        router.push('/login')
        // 清除定时器
        clearTimeout(timer)
        // 关闭提示框
        ElMessageBox.close()
      },
    })

    // 返回一个Promise，并reject一个错误对象
    return Promise.resolve({
      code: 403,
      data: '未登录',
    })
  } else {
    // 返回响应数据
    return Promise.resolve(response)
  }
}
