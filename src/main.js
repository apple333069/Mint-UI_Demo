import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

// 引入第三方 mint-ui
import MintUI from "mint-ui" 
import "mint-ui/lib/style.css"

Vue.use(MintUI)
// 引入圖標
import "./font/iconfont.css"
// 配置axios
import axios from "axios"
// 配置請求時保存session
axios.defaults.withCredentials=true
// 配置請求基礎路徑
axios.defaults.baseURL="http://127.0.0.1:8080/"

Vue.prototype.axios = axios;


new Vue({
  router,
  store,  //加入store
  render: h => h(App),
}).$mount('#app')