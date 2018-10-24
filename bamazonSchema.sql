CREATE DATABASE bamazon;

USE bamazon;

CREATE TABLE products (
item_id int auto_increment not null,
product_name varchar(100) not null,
department_name varchar(100) not null,
price decimal(10, 2) not null,
stock_quantity int not null,
PRIMARY KEY(item_id)
);

ALTER TABLE products
ADD product_sales INT(10) AFTER price;

CREATE TABLE departments (
department_id INT auto_increment not null,
department_name varchar(100) not null,
over_head_costs decimal(10, 2) not null,
PRIMARY KEY(department_id)
);

INSERT INTO departments (department_name, over_head_costs)
values ("Home Decor", 1000),
("Fashion", 1200),
("Entertainment", 3000),
("Food", 2400);

INSERT INTO products (product_name, department_name, price, stock_quantity)
values ("Scented Candles", "Home Decor", 12, 100),
("Velour Jumpsuit", "Fashion", 120, 1 ),
("'Refurbished' Television", "Entertainment", 200, 12),
("Trail Mix", "Food", 12, 500),
("Delicious Sandwiches", "Food", 15, 30),
("Deathrace 2000: Miracle Mile", "Entertainment", 25, 15000),
("Vanilla Beans", "Food", 85, 15),
("Green Tracksuit", "Fashion", 55, 100),
("Red Tracksuit", "Fashion", 55, 100),
("Blue Tracksuit", "Fashion", 55, 100);

SELECT item_id, product_name, price FROM products;

SELECT departments.department_id, departments.department_name, products.product_name, products.price, products.product_sales 
FROM departments JOIN products 
ON departments.department_name = products.department_name
order by products.department_name;

SELECT * FROM departments;

select * from products;