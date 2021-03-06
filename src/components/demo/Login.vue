<template>
  <div>
    <!-- header -->
    <mt-header>
      <router-link to="/" slot="left">
        <mt-button icon="back"></mt-button>
      </router-link>
      <mt-button icon="more" slot="right"></mt-button>
    </mt-header> 
    <img src="../../assets/paw.png" class="clogo">   
    <h3 class="clogin">會員登入</h3>
    <!-- 用戶名輸入框 -->
    <div>
      <img class="name_img" src="../../assets/user.png">
      <input id="cname" type="text" placeholder="請輸入用戶名" v-model="uname"> 
    </div>   
    <!-- 用戶密碼輸入框 --> 
    <div>  
      <img class="pwd_img" src="../../assets/padlock.png">
      <input id="cpwd" type="password" placeholder="請輸入密碼" v-model="upwd">
    </div>
    <div class="form-check">
        <input class="form-check-input" type="checkbox"/>保持登入狀態
        <a href="javascript:;" class="form-forget" @click="forget_pwd">忘記密碼?</a>
    </div>
    <!-- 登入按鈕 -->
    <mt-button size="large" type="primary" @click="login">登入</mt-button>    
  </div>
</template>
<script>
export default {
   data(){
     return {
      uname:"", 
      upwd:""   
    }
    },
   methods:{
    //  完成用戶登入操作
     login(){
       var u = this.uname;
       var p = this.upwd;
       // 正規表達式  
       var reg = /^[a-z0-9]{3,12}$/i;
       if(!reg.test(u)){
          this.$toast("用戶名格式不正確");
          return;
       }
       if(!reg.test(p)){
         this.$toast("密碼格式不正確");         
         return;
       }
       // 發送ajax
       var url = "login";
       var obj = {uname:u,upwd:p};
       this.axios.get(url,{params:obj}).then(res=>{
        var code = res.data.code;
        if(code==-1){
        this.$messagebox("消息","用戶名或密碼有誤");
        }else{
         this.$router.push("/product")
        }
       })
     },
     forget_pwd(){
       this.$toast({         
         message: '尚未建立頁面',
         iconClass: 'mintui mintui-cry'
       });
     }
   }
}
</script>
<style scoped>
/* header */
  .mint-header{
    background-color: #fff;
    color:#000;
    margin-top:10px;
  }
  .clogo{
    width:38px;
    display: block;
    margin:0 auto;
  }
  .clogin{
    text-align: center;
    margin-bottom: 30px;
  }
  /* 輸入框排版 */
  .name_img,.pwd_img{ 
    padding-top: 7px;
    padding-left: 30px;
  }
  #cname,#cpwd{
    text-align: center;
    font-size:15px;
    border: none;
    outline: medium;
    width:65%;
    padding: 15px;
  }
  /* form排版 */
  .form-check{
    margin-left:35px;
    margin-top: 30px;
    font-size: 14px;
    color:rgb(136, 136, 136);
    
  }
  .form-check-input{ 
    height: 15px;  
    width:20px;
    vertical-align: middle;
    margin-top:-2px;
    margin-bottom: 1px;
  }
  .form-forget{
    float:right;
    padding-right: 20px;
    color:rgb(177, 177, 177);
    text-decoration: none;
  }
  /* 登入按鈕 */
  .mint-button{
    background: #000;
    width: 60%;
    margin:45px auto;
  }

</style>

