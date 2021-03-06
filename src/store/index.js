// Vuex 存放總數量及總金額
import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'

Vue.use(Vuex)

const state = {
  count:0,
  totalprice:0,
}

const getters = {
  getCount(state){
    return state.count
  },
  getPrice(state){
    return state.totalprice
  }
}

const actions = {
  updateCount(context){
    var url = "carts"
    axios.get(url).then(res=>{
      var rows = res.data.data
      var count = 0
      for(var item of rows){
        if(item.count > 0){
          count += item.count
        }
      }
      context.commit('set_count',count)
    })    
  },
  updatePrice(context){
    var url="carts"
    axios.get(url).then(res=>{
      var rows = res.data.data
      var totalprice = 0
      for(var item of rows){
        if(item.count > 0){
          totalprice += item.count * item.price
        }
      }
      context.commit('set_totalprice',totalprice)
    })
  }
}


const mutations = {
  set_count(state,count){
    state.count = count
  },
  set_totalprice(state,price){
    state.totalprice = price
  }
}

export default new Vuex.Store({
  state,
  getters,
  actions,
  mutations
})