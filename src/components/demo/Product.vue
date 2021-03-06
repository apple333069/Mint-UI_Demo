<template>
  <div>
    <!-- header -->
    <mt-header>
      <mt-button icon="menu" slot="left" class="nav-menu"></mt-button>
      <!-- 購物車數量 -->
      <mt-button icon="shoppingcart" slot="right" @click="jumpCart" class="nav-cart"><span class="nav-count" v-show="getCount>0">{{getCount}}</span></mt-button>
      <mt-button icon="user" slot="right" @click="jumpLogin" class="nav-login"></mt-button>
      <mt-button icon="search" slot="right" class="nav-search"></mt-button>
    </mt-header>
    <h3>{{ selected }}商品(10)</h3>
    <hr style="width: 90%" />
    <i class="mintui mintui-filter"></i>
    <mt-navbar v-model="selected">
      <mt-tab-item id="最新">最新</mt-tab-item>
      <mt-tab-item id="熱門">熱門</mt-tab-item>
      <mt-tab-item id="暢銷">暢銷</mt-tab-item>
    </mt-navbar>
    <!-- product -->
    <!-- 最新頁面 -->
    <mt-tab-container v-model="selected">
      <mt-tab-container-item id="最新">
        <div class="product-app">
          <!--此div表示一個商品 循環-->
          <div class="goods-item" v-for="(item, index) of list" :key="index">
            <img :src="'http://127.0.0.1:8080/' + item.img_url" />
            <h5>{{ item.lname }}</h5>
            <div class="info">${{ item.price }}</div>
            <mt-button
              @click="addcart"
              :data-lid="item.lid"
              :data-img_url="item.img_url"
              :data-price="item.price"
              :data-lname="item.lname"
              icon="iconshoppingcart"
              >加入購物車</mt-button
            >
          </div>
          <!--商品結束-->
          <!-- footer -->
          <mt-button class="morebtn" size="large" @click="loadMore">加載更多...</mt-button>
          <mt-button class="checkbtn" @click="jumpCart">查看購物車</mt-button>
        </div>
      </mt-tab-container-item>
      <!-- 熱門頁面 -->
      <mt-tab-container-item id="熱門">
        <div class="product-app">
          <!--此div表示一個商品 循環-->
          <div class="goods-item" v-for="(item, index) of list" :key="index">
            <!--1:商品圖片-->
            <img :src="'http://127.0.0.1:8080/' + item.img_url" />
            <!--2:商品名稱-->
            <h5>{{ item.lname }}</h5>
            <!--3:商品價格-->
            <div class="info">${{ item.price }}</div>
            <!--4:加入購物車-->
            <mt-button
              @click="addcart"
              :data-lid="item.lid"
              :data-price="item.price"
              :data-lname="item.lname"
              icon="iconshoppingcart"
              >加入購物車</mt-button
            >
          </div>
          <!--商品結束-->
          <mt-button class="morebtn" size="large" @click="loadMore">加載更多...</mt-button>
          <mt-button class="checkbtn" @click="jumpCart">查看購物車</mt-button>
        </div>
      </mt-tab-container-item>
      <!-- 暢銷頁面 -->
      <mt-tab-container-item id="暢銷">
        <div class="product-app">
          <!--此div表示一個商品 循環-->
          <div class="goods-item" v-for="(item, index) of list" :key="index">
            <!--1:商品圖片-->
            <img :src="'http://127.0.0.1:8080/' + item.img_url" />
            <!--2:商品名稱-->
            <h5>{{ item.lname }}</h5>
            <!--3:商品價格-->
            <div class="info">${{ item.price }}</div>
            <!--4:加入購物車-->
            <mt-button
              @click="addcart"
              :data-lid="item.lid"
              :data-price="item.price"
              :data-lname="item.lname"
              icon="iconshoppingcart"
              >加入購物車</mt-button
            >
          </div>
          <!--商品結束-->
          <mt-button class="morebtn" size="large" @click="loadMore">加載更多...</mt-button>
          <mt-button class="checkbtn" @click="jumpCart">查看購物車</mt-button>
        </div>
      </mt-tab-container-item>
    </mt-tab-container>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
export default {
  data() {
    return {
      selected: "最新",
      list: [],
      pno: 0,
    };
  },
  created() {
    this.loadMore();
    this.$store.dispatch('updateCount')
  },
  methods: {
    jumpLogin() {
      this.$router.push("/Login");
    },
    jumpCart() {
      this.$router.push("/Cart");
    },
    //功能:添加商品至購物車
    addcart(event) {
      var lid = event.target.dataset.lid;
      var img_url = event.target.dataset.img_url;
      var lname = event.target.dataset.lname;
      var price = event.target.dataset.price;

      var url = "addcart";
      var obj = { lid: lid, img_url: img_url, lname: lname, price: price };
      //發送ajax
      this.axios.get(url, { params: obj }).then((res) => {
        if (res.data.code == -1) {
          this.$messagebox("消息", "請登入").then((res) => {
            this.$router.push("/Login");
          });
        } else if (res.data.code == -2) {
          this.$toast({
            message: "添加失敗",
            iconClass: "mintui mintui-cry",
          });
        } else {
          this.$toast({
            message: "添加成功",
            iconClass: "iconfont icon-shopping_cart_ok",
          });
          this.$store.dispatch('updateCount')
        }
      });
    },
    //功能:加載第一頁數據
    loadMore() {
      var url = "product";
      this.pno++;
      var obj = { pno: this.pno };
      //發送ajax請求獲取第一頁數據
      this.axios.get(url, { params: obj }).then((res) => {
        console.log(res.data.data);
        var rows = this.list.concat(res.data.data);
        //赋值
        this.list = rows;
      });
    }
  },
  // 取得數量
  computed:{
    ...mapGetters([
      'getCount',
    ])
  }
};
</script>
<style scoped>
/* header */
.mint-header {
  background: #fff url(../../assets/paw.png) no-repeat 50%;
  background-size: contain;
  color: #000;
  margin-top: 10px;
  padding-right: 18px;
  padding-left: 18px;
}
.mint-header >>> .mintui {
  font-size: 20px;
}
.mint-header .mint-button+.mint-button {
  padding-left: 6px;
}
.mint-header .nav-count {
  background-color: #f00;
  border-radius: 50%;
  color: #fff;
  float: right;
  height: 16px;
  width: 17px;
}
h3 {
  text-align: center;
}
/* 最新 熱門 暢銷 */
.mint-navbar {
  margin-left: 20px;
}
.mint-navbar .mint-tab-item {
  color: rgb(150, 150, 150);
  flex: 0.15;
  padding: 10px 0 10px 0px;
}
.mint-navbar >>> .mint-tab-item-label {
  font-size: 15px;
}
.mintui-filter {
  float: right;
  margin-right: 27px;
  margin-top: 7px;
}
/* 商品列表最外層父元素 */
.product-app {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  padding: 10px;
  background-color: rgb(238, 238, 238);
}
/* 當前商品排版 */
.goods-item {
  width: 49%;
  margin: 2px 0;
  padding: 5px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  min-height: 249px;
  background-color: #fff;
}
/* 當前商品圖片 */
.goods-item img {
  width: 100%;
  height: 67%;
}
.goods-item h5 {
  padding-left: 3px;
}
/* 當前商品價格 */
.goods-item .info {
  color: red;
  font-size: 20px;
  font-weight: bold;
  margin-right: 12px;
  margin-bottom: 7px;
  text-align: right;
}
/* 購物車按鈕 */
.goods-item .mint-button {
  background: #000;
  color: #fff;
  font-size: 16px;
}
/* 加載更多按鈕 */
.morebtn {
  margin-top: 10px;
  background: #fff;
  color: rgb(43, 42, 42);
  border: 1px solid rgb(160, 160, 160);
  font-size: 15px;
  border-radius: 20px;
}
/* 查看購物車 */
.checkbtn {
  margin-top: 10px;
  background: rgb(255, 60, 60);
  color: #fff;
  font-size: 15px;
  border-radius: 5px;
  margin: 20px 0 10px 10px;
}
</style>

