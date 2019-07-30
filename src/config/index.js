import Vue from 'vue'
const env = process.env.VUE_APP_NODE_ENV;

const common = {
  appCode: 'BUSINESS_PC',
  imgHost: '' //阿里云图片服务器
},

//开发环境：npm run dev
development = {
  host: '',
  ...common
},

//测试环境打包：npm run testing
test = {
  host: 'http://10.0.0.52:9051',
  ...common
},

//正式环境打包( 准生产 )：npm run ready
ready = {
  host: 'http://10.0.0.25:9051',
  ...common
},

//正式环境打包：npm run build
production = {
  host: 'http://47.107.249.116:9051',
  ...common
},

config = {
  development,
  test,
  ready,
  production
};
Vue.prototype.$config = config[env];
export default config[env];
