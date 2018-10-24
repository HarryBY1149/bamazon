var mysql = require("mysql")
var inquirer = require("inquirer")

var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: 'Ulgo1149',
    database: "bamazon"
});

function bamazonManagerInit() {
    connection.connect(function (err) {
        if (err) throw err;
        console.log("Welcome to the Bamazon Manager Portal.");
        inquirer.prompt([{
            type: "list",
            name: "command",
            message: "What would you like to manage, you sexy middle management professional you?",
            choices: ["View Products", "View Low Inventory", "Add to Inventory", "Add New Product"]
        }]).then(function (answer) {
            switch (answer.command) {
                case "View Products":
                    viewProducts();
                    break;
                case "View Low Inventory":
                    lowInventory();
                    break;
                case "Add to Inventory":
                    addInventory();
                    break;
                case "Add New Product":
                    newProduct();
                    break;
            };
        });
    });
}


function viewProducts() {
    connection.query("SELECT item_id, product_name, price, stock_quantity FROM products", function (err, res) {
        if (err) throw err;
        res.forEach(function (element) {
            console.log(`ID: ${element.item_id} | Name: ${element.product_name} | Price: ${element.price}/unit | Stock: ${element.stock_quantity} units`);
        });
        connection.end()
    });
};

function lowInventory() {
    connection.query("SELECT item_id, product_name, price, stock_quantity FROM products WHERE stock_quantity < ?", [5], function (err, res) {
        if (err) throw err;
        res.forEach(function (element) {
            console.log(`ID: ${element.item_id} | Name: ${element.product_name} | Price: ${element.price}/unit | Stock: ${element.stock_quantity} units`);
        });
            inquirer.prompt([{
                name: "add",
                type: "confirm",
                message: "Would you like to order more inventory?"
            }]).then(function (res) {
                if (res.add) {
                    addInventory();
                } else {
                    connection.end();
                }
            })
        });
    };


function addInventory() {
    inquirer.prompt([
        {
            name: "id",
            type: "input",
            message: "Enter the ID number of the product you would like to order."
        },
        {
            name: "quantity",
            type: "input",
            message: "How many units would you like to order? Please enter a number:"
        }
    ]).then(function (answer) {
        var ID = parseInt(answer.id);
        var quantity = parseInt(answer.quantity);
        connection.query("UPDATE products SET stock_quantity = stock_quantity + ? WHERE item_id = ?", [quantity, ID], function (err) {
            if (err) throw err;
            connection.query("SELECT item_id, product_name, stock_quantity, price FROM products WHERE item_id = ? ", [ID], function (err, res) {
                if (err) throw err;
                console.log(`ID: ${res[0].item_id} | Name: ${res[0].product_name} | Price: ${res[0].price}/unit | Stock: ${res[0].stock_quantity} units`);
                connection.end();
            });
        });
    });
};

function newProduct() {
    inquirer.prompt([
        {
            name: "product_name",
            type: "input",
            message: "What is the name of the product you would like to add to inventory?"
        },
        {
            name: "department_name",
            type: "input",
            message: "What department is the product found in?"
        },
        {
            name: "price",
            type: "input",
            message: "How much would you like to charge per unit?"
        },
        {
            name: "stock_quantity",
            type: "input",
            message: "How many units would you like to order?"
        }
    ]).then(function (answer) {
        var prod = answer.product_name;
        var dep = answer.department_name;
        var price = parseInt(answer.price);
        var stock = parseInt(answer.stock_quantity);
        connection.query("INSERT INTO products (product_name, department_name, price, stock_quantity) values ( ?, ?, ?, ?)", [prod, dep, price, stock], function (err) {
            if (err) throw err;
            console.log(prod + " successfully added to inventory.");
            connection.end();
        })
    })
}


bamazonManagerInit();