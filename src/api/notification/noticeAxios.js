import store from '@/store'
import axios from 'axios'
import website from '@/config/website'
import NProgress from 'nprogress'
import * as qs from 'qs'

const noticeAxios = axios.create({
  baseURL: 'http://' + website.notificationGatewayHost + '/message',
  timeout: 10000
})

// HTTP request拦截
noticeAxios.interceptors.request.use(config => {
  NProgress.start() // start progress bar

  if (store && store.getters && store.getters.token) {
    config.headers['Authorization'] = 'Bearer ' + store.getters.token // 让每个请求携带token--['Authorization']为自定义key 请根据实际情况自行修改
  }

  if (config.method === 'get') {
    config.paramsSerializer = function(params) {
      return qs.stringify(params, { arrayFormat: 'repeat' })
    }
  }

  return config
}, error => {
  return Promise.reject(error)
})

// HTTP response拦截
noticeAxios.interceptors.response.use(res => {
  NProgress.done()
  return res
}, () => {
  NProgress.done()
})

export default noticeAxios
