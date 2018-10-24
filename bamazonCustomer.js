var mysql = require("mysql")
var inquirer = require("inquirer")

var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: 'Ulgo1149',
    database: "bamazon"
});

connection.connect(function (err) {
    if (err) throw err;
    console.log("Welcome to Bamazon!\n\n*************************************");
    
    connection.query("SELECT item_id, product_name, price FROM products", function (err, res) {
        if (err) throw err;
        res.forEach(function (element) {
            console.log(`ID: ${element.item_id} | Name: ${element.product_name} | Price: ${element.price} / unit`);       
    });
    inquirer.prompt([
        {
            name: "ID",
            message: "Please enter the ID of the item you would like to purchase:",
            type:"input"

        },
        {
            name: "quantity",
            message: "How many would you like to purchase?",
            type:"input"
        },
    ]).then(function(ans) {
        var ID = parseInt(ans.ID);
        var quantity = parseInt(ans.quantity);
        connection.query("Select price, stock_quantity FROM products WHERE item_id = ?", [ID], function (err, res) {
            if (err) throw err;
            var currentStock = parseInt(res[0].stock_quantity);
            var price = parseInt(res[0].price);
            if (quantity > currentStock) {
                return console.log("Insufficient quantity in stock, please contact a manager.");
            } else {
                var newStock = currentStock - quantity;
                var sum = quantity * price;
                connection.query(`UPDATE products SET stock_quantity = ?, product_sales = ? WHERE item_id = ?`, [newStock, sum, ID], function (err, res) {
                    console.log(`Total: $${sum}`);
                    connection.end()
                })

            }
        })
    })
});
});