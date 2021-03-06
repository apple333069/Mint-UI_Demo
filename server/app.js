// 第三方模块 
const express = require("express");
const session = require("express-session");
const cors = require("cors");
const mysql = require("mysql");
//數據庫連接池
var pool = mysql.createPool({
  host: "127.0.0.1",
  user: "root",
  password: "",
  port: 3306,
  connectionLimit: 20,
  database: "test"
})

// web伺服器監聽 8080 端口
var server = express();
server.listen(8080);
// 跨域 cors 
server.use(cors({
  origin: ["http://127.0.0.1:5050", "http://localhost:5050"],
  // 每請求是否驗證true
  credentials: true
}))
// 配置session
//#session配置一定要在所有请求之前
server.use(session({
  secret: "128位字符串",    //#安全字符串
  resave: true,            //#每次請求保存數據 
  saveUninitialized: true  //#保存初始化數據
}));
// 靜態目錄
server.use(express.static("public"));

// 功能:完成用戶登入
server.get("/login", (req, res) => {
  // 接收客戶端傳遞數據:uname、upwd
  var u = req.query.uname;
  var p = req.query.upwd;

  // 執行sql 並獲取返回結果
  var sql = "SELECT id FROM test_login WHERE uname = ? AND upwd = md5(?)";
  pool.query(sql, [u, p], (err, result) => {
    if (err) throw err;
    if (result.length == 0) {
      res.send({ code: -1, msg: "用戶名或密碼有誤" })
    } else {
      // 獲取當前登入用戶id result=[{id:2}]
      var id = result[0].id;
      //  將id保存到session uid:用戶憑證
      req.session.uid = id;
      res.send({ code: 1, msg: "登入成功" });
    }
  });
})

// 功能:商品分頁顯示
server.get("/product", (req, res) => {
  var pno = req.query.pno;  // 頁碼
  var ps = req.query.pageSize;  // 顯示數量
  //  設置默認數據  pno=1   pageSize=4
  if (!pno) {
    pno = 1;
  }
  if (!ps) {
    ps = 4;
  }
  // 執行sql 並獲取返回結果
  var sql = "SELECT lid,lname,price,img_url FROM test_product LIMIT ?,?";
  var offset = (pno - 1) * ps;
  ps = parseInt(ps);
  pool.query(sql, [offset, ps], (err, result) => {
    if (err) throw err;
    res.send({
      code: 1, msg: "查询成功",
      data: result
    });
  });
})

// 功能:將指定商品添加至購物車
server.get("/addcart", (req, res) => {
  // 判斷當前用戶是否登入成功
  var uid = req.session.uid;
  if (!uid) {
    res.send({ code: -1, msg: "請先登入" });
    return;
  }
  //  接收客戶端傳遞數據:lid、price、lname
  var lid = req.query.lid;
  var img_url = req.query.img_url;
  var price = req.query.price;
  var lname = req.query.lname;
  console.log(lid + ":" + img_url + ":" + price + ":" + lname)
  //res.send(lid+":"+price+":"+lname);
  // sql:查詢當前用戶是否購買此商品
  var sql = "SELECT id FROM test_cart WHERE uid = ? AND lid = ?";
  // 執行sql 並獲取返回結果
  pool.query(sql, [uid, lid], (err, result) => {
    if (err) throw err;
    if (result.length == 0) {
      // 沒購買此商品  添加
      var sql = `INSERT INTO test_cart VALUES(null,${lid},'${img_url}',${price},1,'${lname}',${uid})`;
    } else {
      // 已購買此商品  更新
      var sql = `UPDATE test_cart SET count=count+1 WHERE uid=${uid} AND lid=${lid}`;
    }
    pool.query(sql, (err, result) => {
      if (err) throw err;
      // 如果sql UPDATE INSERT DELETE
      // 判斷執行成功 result.affectedRows 影響行數
      if (result.affectedRows > 0) {
        res.send({ code: 1, msg: "商品添加成功" });
      } else {
        res.send({ code: -2, msg: "商品添加失敗" });
      }
    })
  })
})

// 功能:查詢當前用戶購物車的購物資料
server.get("/carts", (req, res) => {
  // 判斷當前用戶是否登入成功
  var uid = req.session.uid;
  if (!uid) {
    res.send({ code: -1, msg: "請登入" });
    return;
  }
  // 執行sql 並獲取返回結果
  var sql = "SELECT lid,id,img_url,lname,price,count FROM test_cart WHERE uid = ?";
  pool.query(sql, [uid], (err, result) => {
    if (err) throw err;
    res.send({ code: 1, msg: "查詢成功", data: result })
  })
});

// 功能:刪除購物車表中指定數據
server.get("/delItem", (req, res) => {
  // 判斷當前用戶是否登入成功
  var uid = req.session.uid;
  if (!uid) {
    res.send({ code: -2, msg: "請登入" });
    return;
  }
  // 接收客戶端傳遞數據:id
  var id = req.query.id;
  // 執行sql 並獲取返回結果
  var sql = "DELETE FROM test_cart WHERE id=?";
  pool.query(sql, [id], (err, result) => {
    if (err) throw err;
    if (result.affectedRows > 0) {
      res.send({ code: 1, msg: "刪除成功" });
    } else {
      res.send({ code: -1, msg: "刪除失敗" });
    }
  })
})

// 功能:刪除購物車表中多個商品
server.get("/delItems", (req, res) => {
  // 判斷當前用戶是否登入成功
  var uid = req.session.uid;
  if (!uid) {
    res.send({ code: -2, msg: "請登入" });
    return;
  }
  // 接收客戶端傳遞數據:id
  var id = req.query.id;
  // 執行sql 並獲取返回結果
  var sql = `DELETE FROM test_cart WHERE id IN (${id})`;
  pool.query(sql, (err, result) => {
    if (err) throw err;
    if (result.affectedRows > 0) {
      res.send({ code: 1, msg: "刪除成功" })
    } else {
      res.send({ code: -1, msg: "刪除失敗" })
    }
  })
})

// 功能:更新商品選擇數量
server.get("/selCount", (req, res) => {
  // 判斷當前用戶是否登入成功
  var uid = req.session.uid;
  if (!uid) {
    res.send({ code: -1, msg: "請登入" });
    return;
  }
  // 接收客戶端傳遞數據:id、count
  var id = req.query.id;
  var count = req.query.count;
  // 執行sql 並獲取返回結果
  var sql = `UPDATE test_cart SET count=${count} WHERE id=?`;
  pool.query(sql, [id], (err, result) => {
    if (err) throw err;
    if (result.affectedRows > 0) {
      res.send({ code: 1, msg: "更新成功" })
    } else {
      res.send({ code: -1, msg: "更新失败" })
    }
  })
})











