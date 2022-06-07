create table tb_phone_pfft(
  id int(11) NOT NULL auto_increment,
  phone varchar(100) DEFAULT NULL,
  vcode varchar(100) DEFAULT NULL,
  vsource varchar(100) DEFAULT NULL,
  status int(4) DEFAULT 1,
  createtime datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
);