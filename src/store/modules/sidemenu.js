export default {
  namespaced: true,
  state: {
    selectedKeys: ['/main/home']
  },
  mutations: {
    UPDATE_MENU_PATH: (state, path) => {
      state.selectedKeys = [path]
    },
    UPDATE_SELECTED_KEYS: (state, keys) => {
      state.selectedKeys = keys
    }
  }
}
