<template>
  <div>
    <!-- header -->
    <mt-header>     
      <mt-button icon="menu" slot="left"></mt-button>
      <mt-button icon="search" slot="right"></mt-button>
    </mt-header>
    <router-link to="/Product" slot="left" class="back">
      <mt-button icon="back"></mt-button>     
    </router-link> 
    <h3>我的購物車</h3> 
    <hr style="width:90%">
    <div class="cart">    
      <!-- 頂部 全選 -->
      <div class="selectall">
      全選 <input type="checkbox" @change="selectAll"/>
      </div>
      <!-- 商品資訊 -->
      <div class="cart-item" v-for="(item,index) of list" :key="index">
        <div class="left-item">
          <input type="checkbox" v-model="item.cb"/>
          <img :src="'http://127.0.0.1:8080/'+item.img_url" />
          <div  class="med-info">
            <div class="lname">{{item.lname}}</div>
            <div class="price">$ {{item.price}}</div>
            <div class="count">
              <span>數量</span>
              <select v-model="item.count" @change="selectCount" :data-id="item.id">
                <option :value="count" v-for="count of 8" :key="count">{{count}}</option>
              </select>
            </div>  
          </div>         
        </div>
        <mt-button @click="deleteItem" 
        :data-id="item.id" icon="trash"></mt-button>
      </div>
      <!-- total -->
      <mt-button class="bottom-deleteAll" @click="deleteItems">刪除選中商品</mt-button>
      <div  class="bottom-info">
        <p>總金額 <span class="total-1">$ {{getPrice}}</span></p>
        <p>總數量 <span class="total-2">{{getCount}} 件</span></p>
      </div>
      <!-- footer -->
      <div class="continue">
        <mt-button icon="present" size="large" class="shopping">繼續購物</mt-button>
        <mt-button icon="Bagofmoney" size="large" class="pay" @click="pay">前往結帳</mt-button>
      </div>
    </div>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
export default {
  data(){
    return { 
      list:[]
    }
  },
  created() {
    this.loadMore();
    this.$store.dispatch('updateCount')
    this.$store.dispatch('updatePrice')
  },
  methods:{
    // 功能:選擇數量
    selectCount(event){
      var id = event.target.dataset.id;
      var count =event.target.value;
      for(var item of this.list){
        item.count = count;
        item.id = id;
      }
      var url = "selCount";
      var obj = {id:id,count:count};
      this.axios.get(url,{params:obj}).then(res=>{
        this.loadMore();
        this.$store.dispatch('updateCount')
        this.$store.dispatch('updatePrice')
      })
    },
    // 功能:全選
    selectAll(event){
      var cb = event.target.checked;
      // 創建循環讓所有商品狀態一致全選
      for(var item of this.list){
        item.cb = cb;
      }
    },
    // 功能: 刪除選中商品
    deleteItems(){
      this.$messagebox.confirm("是否刪除指定商品?").then(res=>{
       // 創建變量保存選中的id
        var id = "";  //1,2,3
        for(var item of this.list){       
          if(item.cb){
          // 拼接id   2,3,4,
          id+=item.id+",";
          }
        }
        // 去除字串中最後一個逗號
        id = id.slice(0,-1);
        //(7)判断用戶是否選中商品
        if(id==""){
          this.$toast("請選擇需要刪除的商品");
          return;
        }
        // 發送ajax請求
        var url = "delItems";
        var obj = {id:id};
        this.axios.get(url,{params:obj}).then(res=>{
          if(res.data.code==-1){
            this.$toast("刪除失敗");
          }else{
            this.$toast("刪除成功");
            this.loadMore();
            this.$store.dispatch('updateCount')
            this.$store.dispatch('updatePrice')
          }
        })
      })
    },
    // 功能:點擊刪除按鈕完成商品刪除
    deleteItem(event){
      this.$messagebox.confirm("是否刪除指定商品?").then(res=>{
        var id = event.target.dataset.id;
        // 發送ajax請求
        var url="delItem";
        var obj={id:id};
        this.axios.get(url,{params:obj}).then(res=>{
          if(res.data.code==1){
            this.$toast("刪除成功");
            this.loadMore();
            this.$store.dispatch('updateCount')
            this.$store.dispatch('updatePrice')
          }else{
            this.$toast("刪除失敗"); 
          }
        }) 
      }).catch(err=>{
      })
    },
    // 功能:獲取用戶的當前購物車列表
    loadMore(){
      var url = "carts";
      // 發送ajax請求
      this.axios.get(url).then(res=>{
        console.log(res.data.data);
        // 判斷用戶是否已登入
        if(res.data.code == -1){        
          this.$messagebox("消息","請登入").then(res=>{
            this.$router.push("/Login")
          })
        }else{
          //添加一個新功能:為數據添加屬性cb
          var rows = res.data.data;
          for(var item of rows){      
            item.cb = false;
          }
          this.list = rows;         
        }
      })
    },
    pay(){
      this.$toast({         
        message: '尚未建立頁面',
        iconClass: 'mintui mintui-cry'
      });
    }
  },
  // 功能:計算總數量及總金額
  computed:{
    ...mapGetters([
      'getCount',
      'getPrice',
    ])
    // total(){
    //   var totalPrice=0;
    //   var count=0;
    //   for(var item of this.list){
    //     if(item.count>0){
    //       totalPrice+=item.price*item.count;
    //       count+=item.count*1;
    //     }        
    //   }
    //   return ({totalPrice,count});
    // }
  }
}
</script>
<style scoped>
/* header */
.mint-header{
  background:#fff url(../../assets/paw.png) no-repeat 50%;
  background-size: contain;
  color:#000;
  margin-top:10px;
  padding-right: 18px; 
  padding-left: 18px;   
}
.mint-header>>>.mintui{
  font-size: 20px;
} 
/* 返回鍵 */
.back .mint-button--default{
  float:left;
  background: #fff;
  color: #000;
  margin-top:8px;
  box-shadow: 0 0 1px #fff;
}
h3{
  margin-left:38%;
}
/* 當前用戶名 */
.userName{
  margin-top:26px;
  margin-right:17px;
  float:right;
  font-size: 14px;
}
/* 全選 */
.selectall{
  font-size:14px;
  padding-top:5px;
  padding-left:20px;
}
/* 商品排版 */
.cart-item{
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #ccc;
  padding:12px 20px;
}
/* 左側文字 複選  價格 圖片 */
.cart-item .left-item{
  display: flex;
  align-items: center;
}
.cart-item  img{
  width:22%;
  padding-left:9px;
}
/* 商品名稱 */
.med-info .lname{
  font-size:14px;
  font-weight: bold;
  margin-left:18px;
  margin-bottom:3px;
}
/* 商品價格 */
.med-info .price{
  margin-left:20px;
  margin-bottom:3px;
  color:rgb(223, 119, 0);
}
/* 商品數量選擇 */
.count span{
  font-size:13px;
  color:rgb(124, 124, 124);
   margin:5px 7px 0 20px;
}
.count select{
  font-size:13px;
  color:rgb(124, 124, 124);
  border:none;
  outline: none;
  width:35px;
}
/* 垃圾桶 */
.cart-item .mint-button--default{
  background: #fff;
  color:rgb(190, 189, 189);
  box-shadow: 0 0 1px #fff;
}
.cart-item>>>.mintui{
  font-size: 23px;
} 
/* total */
.bottom-deleteAll{
  margin-top:8px;
  margin-left:20px;
  background:#fff;
  border:1px solid rgb(92, 92, 92);
  color:#000;
  font-size:14px;
  border-radius: 4px; 
  box-shadow: 0 0 1px #fff;
}
.bottom-info{
  text-align: right;
  margin-top:30px;
  margin-right:30px;
  color:rgb(59, 59, 59);
  font-size:14px;
}
.bottom-info .total-1{
  font-weight: bold;
  color:rgb(253, 80, 0);
}
.bottom-info .total-2{
  font-weight: bold;
}
/* footer */
.continue{
  padding:7px 20px;
}
.continue>>>.mint-button-icon {
    padding-bottom: 4px;
}
.continue .shopping{
  background: rgb(228, 228, 228);
  color:rgb(117, 117, 117);
  font-size:15px;
  border-radius: 5px; 
}
.continue .pay{
  margin-top:10px;
  background: #ff6855;
  color:#fff;
  font-size:15px;
  border-radius: 4px; 
}
</style>

