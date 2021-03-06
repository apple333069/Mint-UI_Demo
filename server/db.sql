SET NAMES UTF8;
DROP DATABASE IF EXISTS test;
CREATE DATABASE test CHARSET=UTF8;

-- 用戶登錄表
USE test;
CREATE TABLE test_login(
  id INT PRIMARY KEY AUTO_INCREMENT,
  uname VARCHAR(50),
  upwd  VARCHAR(32)
);
-- 用戶資料
INSERT INTO test_login VALUES(null,'apple',md5('123'));
INSERT INTO test_login VALUES(null,'tom',md5('123'));
INSERT INTO test_login VALUES(null,'jack',md5('123'));

-- 商品列表 
USE test;
CREATE TABLE test_product(
  lid INT PRIMARY KEY AUTO_INCREMENT,
  lname VARCHAR(128) UNIQUE,
  price DECIMAL(7,2) DEFAULT 3000
);
-- 商品添加
INSERT INTO test_product VALUES(1,'舒適百搭基本款-1',248);
INSERT INTO test_product VALUES(2,'萬用後背包水藍款-2',399);
INSERT INTO test_product VALUES(3,'輕便百搭商品-3',250);
INSERT INTO test_product VALUES(4,'男款黑色連帽T-4',350);
INSERT INTO test_product VALUES(5,'黑色網格長版外套-5',599);
INSERT INTO test_product VALUES(6,'桃紅色基本款背心-6',399);
INSERT INTO test_product VALUES(7,'米色套裝商品-7',250);
INSERT INTO test_product VALUES(8,'隨性百搭迷彩外套-8',350);
INSERT INTO test_product VALUES(9,'FILA運動長褲-9',599);
INSERT INTO test_product VALUES(10,'狗骨頭圖案粉色長褲-10',399);
INSERT INTO test_product VALUES(11,'寬鬆款格子襯衫-11',250);
INSERT INTO test_product VALUES(12,'黑色率性穿搭時裝-12',350);
INSERT INTO test_product VALUES(13,'百搭牛仔單品-13',289);
INSERT INTO test_product VALUES(14,'女款渲染長版上衣-14',188);

-- 向商品列表中添加一列 img_url
USE test;
ALTER TABLE test_product ADD img_url VARCHAR(255);
-- #更新商品表图片 
UPDATE test_product SET img_url='01.jpg'
WHERE lid = 1;
UPDATE test_product SET img_url='02.jpg'
WHERE lid = 2;
UPDATE test_product SET img_url='03.jpg'
WHERE lid = 3;
UPDATE test_product SET img_url='04.jpg'
WHERE lid = 4;
UPDATE test_product SET img_url='05.jpg'
WHERE lid = 5;
UPDATE test_product SET img_url='06.jpg'
WHERE lid = 6;
UPDATE test_product SET img_url='07.jpg'
WHERE lid = 7;
UPDATE test_product SET img_url='08.jpg'
WHERE lid = 8;
UPDATE test_product SET img_url='09.jpg'
WHERE lid = 9;
UPDATE test_product SET img_url='10.jpg'
WHERE lid = 10;
UPDATE test_product SET img_url='11.jpg'
WHERE lid = 11;
UPDATE test_product SET img_url='12.jpg'
WHERE lid = 12;
UPDATE test_product SET img_url='13.jpg'
WHERE lid = 13;
UPDATE test_product SET img_url='14.jpg'
WHERE lid = 14;

-- 購物車當前商品列表
USE test;
CREATE TABLE test_cart(
  id      INT PRIMARY KEY AUTO_INCREMENT, -- 排序
  lid     INT,  -- 商品編號
  img_url VARCHAR(255),
  price   DECIMAL(10,2),
  count   INT,  -- 商品數量
  lname   VARCHAR(255),
  uid     INT  -- 用戶編號
);




