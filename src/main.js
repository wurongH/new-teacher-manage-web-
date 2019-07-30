import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'
import './axios/api'
import './axios';
import './axios/fetch'
import filter from './filter/index';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';

Vue.use(ElementUI);

Vue.config.productionTip = false

//注册通用的过滤器 11
for (var filteritem in filter) {
  Vue.filter(filteritem, filter[filteritem])
}

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  data: {
    app: new Vue()
  },
  render: h => h(App)
}).$mount("#app")
