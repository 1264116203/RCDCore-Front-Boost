/**
 * 全站http配置
 *
 * axios参数说明
 * isSerialize是否开启form表单提交
 * needToken是否需要token
 */

import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import Vue from 'vue'
import axios from 'axios'
import store from '@/store'
import router from '@/router'
import { serialize } from '@/util/util'
import { getToken } from '@/util/auth'
import { baseUrl } from '@/config/env'

axios.defaults.timeout = 10000
// 返回其他状态码
axios.defaults.validateStatus = function (status) {
  return status >= 200 && status < 400
}
// 跨域请求，允许保存cookie
axios.defaults.withCredentials = true
axios.defaults.baseURL = baseUrl
// NProgress Configuration
NProgress.configure({
  showSpinner: false
})

// HTTP request拦截
axios.interceptors.request.use(config => {
  NProgress.start() // start progress bar
  const meta = (config.meta || {})
  const isToken = meta.isToken === false

  if (getToken() && !isToken) {
    config.headers['Authorization'] = 'Bearer ' + getToken() // 让每个请求携带token--['Authorization']为自定义key 请根据实际情况自行修改
  }

  // headers中配置serialize为true开启序列化
  if (config.method === 'post' && meta.isSerialize === true) {
    config.data = serialize(config.data)
  }
  return config
}, error => {
  return Promise.reject(error)
})

// HTTP response拦截
axios.interceptors.response.use(res => {
  NProgress.done()
  return res
}, error => {
  NProgress.done()

  console.log(error)

  const res = error.response
  const { status } = res
  let message = res.headers['x-error-message']

  // 如果是401则跳转到登录页面
  if (status === 401) {
    store.dispatch('user/clearAllAuthInfos')
      .then(() => router.push({ path: '/login' }))
  }

  if (!message) {
    switch (status) {
      case 400:
        message = '请求参数有误。'
        break
      case 401:
        message = '令牌已失效，请重新登录。'
        break
      case 403:
        message = '请求被拒绝，请检查用户权限。'
        break
      case 404:
        message = '要访问的记录不存在或服务器变更了请求路径。'
        break
      case 405:
        message = '请求方法不正确。'
        break
      case 500:
        message = '服务器内部错误。'
        break
      default:
        message = '请求异常，但服务器未给出错误信息。'
    }
  }
  // 如果请求为非200则默认统一处理
  if (status !== 200) {
    Vue.prototype.$message.error(message)
    return Promise.reject(new Error(message))
  }
  return Promise.reject(new Error(error))
})

export default axios
