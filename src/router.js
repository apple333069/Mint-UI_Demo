import Vue from 'vue'
import Router from 'vue-router'

//登入
import Login from "./components/demo/Login.vue"
//商品列表
import Product from "./components/demo/Product.vue"
//購物車
import Cart from "./components/demo/Cart.vue"

Vue.use(Router)
export default new Router({
  routes: [
   {path:'/Cart',component:Cart},
   {path:'/Product',component:Product},
   {path:'/Login',component:Login},
    {path:'/',component:Product},
  ]
})
