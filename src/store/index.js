import Vue from 'vue'
import Vuex from 'vuex'
import common from './modules/common'
import sidemenu from './modules/side-menu'
import topmenu from './modules/top-menu'
import tabs from './modules/tabs'
import user from './modules/user'
import dept from './modules/dept'
import role from './modules/role'
import resource from './modules/resource'
import websocket from './modules/websocket'
import notification from './modules/notification'
import getters from '../store/getters'

Vue.use(Vuex)
const store = new Vuex.Store({
  modules: {
    common,
    sidemenu,
    topmenu,
    tabs,
    user,
    dept,
    role,
    resource,
    websocket,
    notification
  },
  getters
})

export default store
