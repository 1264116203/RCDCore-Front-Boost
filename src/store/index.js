import Vue from 'vue'
import Vuex from 'vuex'
import common from './modules/common'
import dict from './modules/dict'
import logs from './modules/logs'
import sidemenu from './modules/sidemenu'
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
    dict,
    logs,
    sidemenu,
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
