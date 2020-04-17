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
import { getCsrfToken, getToken } from '@/util/auth'
import { baseUrl } from '@/config/env'
import { getMessageFromHttpStatusCode } from '@/util/http-status-message'

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

const rcdAxios = axios.create()

// HTTP request拦截
rcdAxios.interceptors.request.use(config => {
  NProgress.start() // start progress bar
  const meta = (config.meta || {})
  const isToken = meta.isToken === false

  if (getToken() && !isToken) {
    config.headers['Authorization'] = 'Bearer ' + getToken() // 让每个请求携带token--['Authorization']为自定义key 请根据实际情况自行修改
  }
  if (config.method !== 'get' && config.method !== 'option' && getCsrfToken()) {
    config.headers['XSRF-TOKEN'] = getCsrfToken()
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
rcdAxios.interceptors.response.use(res => {
  NProgress.done()
  return res
}, error => {
  NProgress.done()

  const res = error.response
  const { status } = res
  let message = res.headers['x-error-message']
  if (message) {
    message = decodeURIComponent(message)
  }

  // 如果是401则跳转到登录页面
  if (status === 401) {
    // 只有在token换取机制也失效后，再跳到登录页
    if (res.data && res.data.refreshToken === 'invalid refresh token') {
      return store.dispatch('user/logout')
        .then(() => router.push({ path: '/login' }))
    } else {
      return store.dispatch('user/refreshToken').then(() => {
        return rcdAxios.request(res.config)
      })
    }
  }

  if (!message) {
    message = getMessageFromHttpStatusCode(status)
  }
  // 如果请求为非200则默认统一处理
  if (status !== 200) {
    Vue.prototype.$message.error({ content: message, key: 'error_message' })
    return Promise.reject(new Error(message))
  }
  return Promise.reject(new Error(error))
})

export default rcdAxios
