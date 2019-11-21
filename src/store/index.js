import Vue from 'vue'
import Vuex from 'vuex'
import common from './modules/common'
import dict from './modules/dict'
import logs from './modules/logs'
import tags from './modules/tags'
import user from './modules/user'

Vue.use(Vuex)
const store = new Vuex.Store({
  modules: {
    common,
    dict,
    logs,
    tags,
    user
  }
})

export default store
