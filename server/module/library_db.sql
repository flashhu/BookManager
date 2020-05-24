/*
Navicat MySQL Data Transfer

Source Server         : rds_library
Source Server Version : 80016
Source Host           : rm-bp1booh30eg441m31fo.mysql.rds.aliyuncs.com:3306
Source Database       : library_db

Target Server Type    : MYSQL
Target Server Version : 80016
File Encoding         : 65001

Date: 2020-05-24 19:20:06
*/

SET FOREIGN_KEY_CHECKS=0;

-- ----------------------------
-- Table structure for `book`
-- ----------------------------
DROP TABLE IF EXISTS `book`;
CREATE TABLE `book` (
  `book_number` char(10) NOT NULL COMMENT '书号',
  `category` varchar(12) DEFAULT NULL COMMENT '类别',
  `book_name` varchar(30) NOT NULL COMMENT '书名',
  `publisher` char(30) NOT NULL COMMENT '出版社',
  `author` char(10) DEFAULT NULL COMMENT '作者',
  `price` decimal(5,2) DEFAULT NULL COMMENT '价格',
  `book_total` int(11) NOT NULL COMMENT '总藏书量',
  `inventory` int(11) NOT NULL COMMENT '库存',
  PRIMARY KEY (`book_number`),
  KEY `book_number` (`book_number`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of book
-- ----------------------------
INSERT INTO `book` VALUES ('1001', '计算机', '深入浅出密码学', '清华大学出版社', 'Jan Pelzl', '59.00', '6', '6');
INSERT INTO `book` VALUES ('1002', '教育', '大学生心理健康八讲', '华东师范大学出版社', '马伟娜', '36.00', '2', '2');
INSERT INTO `book` VALUES ('1003', '经济', '经济学原理', '北京大学出版社', '曼昆', '89.00', '2', '2');
INSERT INTO `book` VALUES ('1004', '计算机', '大话数据结构', '清华大学出版社', '程杰', '59.00', '2', '2');
INSERT INTO `book` VALUES ('1005', '计算机', '计算机组成与结构', '清华大学出版社', '王爱英', '35.00', '3', '3');
INSERT INTO `book` VALUES ('1006', '哲学', '毛泽东思想和中国特色社会主义理论体系概论', '高等教育出版社', '', '25.00', '4', '4');
INSERT INTO `book` VALUES ('1007', '计算机', '数字电子技术基础', '高等教育出版社', '闫石', '54.40', '2', '2');
INSERT INTO `book` VALUES ('1008', '教育', '教育学原理', '高等教育出版社', '', '65.50', '3', '3');
INSERT INTO `book` VALUES ('1009', '文学', '朝花夕拾', '人民教育出版社', '鲁迅', '35.00', '3', '3');

-- ----------------------------
-- Table structure for `borrow_book`
-- ----------------------------
DROP TABLE IF EXISTS `borrow_book`;
CREATE TABLE `borrow_book` (
  `reader_number` char(10) NOT NULL COMMENT '读者编号',
  `book_number` char(10) NOT NULL COMMENT '书号',
  `borrow_time` datetime NOT NULL COMMENT '借书时间',
  PRIMARY KEY (`reader_number`,`book_number`),
  KEY `b_number_b` (`book_number`),
  CONSTRAINT `b_number_b` FOREIGN KEY (`book_number`) REFERENCES `book` (`book_number`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `r_number_b` FOREIGN KEY (`reader_number`) REFERENCES `reader` (`reader_number`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of borrow_book
-- ----------------------------
INSERT INTO `borrow_book` VALUES ('2020202', '1001', '2020-05-24 19:19:14');

-- ----------------------------
-- Table structure for `manager`
-- ----------------------------
DROP TABLE IF EXISTS `manager`;
CREATE TABLE `manager` (
  `manager_id` varchar(10) NOT NULL COMMENT '管理员编号',
  `name` varchar(20) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '管理员姓名',
  `telephone` varchar(15) NOT NULL COMMENT '管理员电话',
  `password` varchar(35) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '加密密码',
  PRIMARY KEY (`manager_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of manager
-- ----------------------------
INSERT INTO `manager` VALUES ('2020101', '管理员', '16787654321', 'a806c378971cbf7c0aff6b9edb883275');
INSERT INTO `manager` VALUES ('2020102', '李四', '13545564311', '5039fd43108535afcf70c81d3dad2879');
INSERT INTO `manager` VALUES ('2020103', '张三', '19867876545', '5039fd43108535afcf70c81d3dad2879');
INSERT INTO `manager` VALUES ('2020104', '赵六', '19767876567', '5039fd43108535afcf70c81d3dad2879');
INSERT INTO `manager` VALUES ('2020105', '陈七', '15889090921', '5039fd43108535afcf70c81d3dad2879');
INSERT INTO `manager` VALUES ('2020106', '汪久', '16712214332', '5039fd43108535afcf70c81d3dad2879');
INSERT INTO `manager` VALUES ('2020107', '胡三', '17865120909', '5039fd43108535afcf70c81d3dad2879');
INSERT INTO `manager` VALUES ('2020108', '薛五', '16734342121', '5039fd43108535afcf70c81d3dad2879');

-- ----------------------------
-- Table structure for `reader`
-- ----------------------------
DROP TABLE IF EXISTS `reader`;
CREATE TABLE `reader` (
  `reader_number` char(10) NOT NULL COMMENT '读者编号',
  `name` varchar(8) NOT NULL COMMENT '姓名',
  `department` char(20) DEFAULT NULL COMMENT '单位',
  `gender` char(2) NOT NULL COMMENT '性别',
  `telephone` char(15) DEFAULT NULL COMMENT '电话',
  PRIMARY KEY (`reader_number`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of reader
-- ----------------------------
INSERT INTO `reader` VALUES ('2020201', '赵菁菁', '人文学院', '男', '17898765678');
INSERT INTO `reader` VALUES ('2020202', '李永', '外国语学院', '男', '19809873456');
INSERT INTO `reader` VALUES ('2020203', '张力', '教育学院', '女', '16789765434');
INSERT INTO `reader` VALUES ('2020204', '张衡', '医学院', '男', '16545674567');
INSERT INTO `reader` VALUES ('2020205', '张向东', '理学院', '女', '14567890987');
INSERT INTO `reader` VALUES ('2020207', '张丽', '美术学院', '女', '19878354532');
INSERT INTO `reader` VALUES ('2020208', '王芳', '信息科学与工程学院', '女', '19867765445');
INSERT INTO `reader` VALUES ('2020209', '王小民', '医学院', '男', '13356453212');

-- ----------------------------
-- Table structure for `return_book`
-- ----------------------------
DROP TABLE IF EXISTS `return_book`;
CREATE TABLE `return_book` (
  `reader_number` char(10) NOT NULL COMMENT '读者编号',
  `book_number` char(10) NOT NULL COMMENT '书号',
  `return_time` datetime NOT NULL COMMENT '还书时间',
  PRIMARY KEY (`reader_number`,`book_number`),
  KEY `b_number_r` (`book_number`),
  CONSTRAINT `b_number_r` FOREIGN KEY (`book_number`) REFERENCES `book` (`book_number`),
  CONSTRAINT `r_number_r` FOREIGN KEY (`reader_number`) REFERENCES `reader` (`reader_number`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of return_book
-- ----------------------------
INSERT INTO `return_book` VALUES ('2020202', '1001', '2020-05-24 19:19:21');
