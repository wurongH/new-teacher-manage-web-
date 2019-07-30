import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from 'vuex-persistedstate'

import menu from './menu'
import userInfo from './userInfo'
import detailsInfo from './detailsInfo'
import error from './error'

Vue.use(Vuex);

export default new Vuex.Store({
  plugins: [createPersistedState()],
  modules: {
    menu,
    userInfo,
    detailsInfo,
    error
  }
})
