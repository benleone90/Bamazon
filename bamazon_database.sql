DROP DATABASE IF EXISTS `bamazon`;
CREATE DATABASE `bamazon`;
USE `bamazon`;

CREATE TABLE `products`(
    `item_id` INT(11) NOT NULL AUTO_INCREMENT,
    `product_name` VARCHAR(50) NOT NULL,
    `department_name` VARCHAR(50) NOT NULL,
    `price` FLOAT NOT NULL,
    `stock_quantity` INT(11) NOT NULL,
    PRIMARY KEY (`item_id`)
);

INSERT INTO
`products` (`product_name`,`department_name`,`price`,`stock_quantity`)
VALUES
('Playstation 4','Electronics',299.99,15),
('Xbox One','Electronics',229.99,10),
('Apples','Produce',0.99,48),
('Pears','Produce',1.49,27),
('Ballpoint Pens','Office Supplies',4.99,87),
('Printer Paper','Office Supplies',10.99,40),
('Lamps','Home Goods',14.99,18),
('Coffee Table','Home Goods',99.99,4),
('Frozen Pizza','Food',8.99,65),
('Ben & Jerry\'s Half-Baked','Food',5.49,42);
