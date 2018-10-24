var mysql = require("mysql")
var inquirer = require("inquirer")
var Table = require("easy-table")

var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: 'Ulgo1149',
    database: "bamazon"
});

connection.connect(function (err) {
    if (err) throw err;
    inquirer.prompt([
        {
            name: "command",
            type: "list",
            message: "Hello supervisor, how may I help you today?",
            choices: ["View Product Sales by Department", "Create New Department"]
        }
    ]).then(function (res) {
        switch (res.command) {
            case "View Product Sales by Department":
                viewSales();
                break;
            case "Create New Department":
                newDepartment();
                break;
        }
    })
});



function viewSales() {
    connection.query("SELECT departments.department_id AS ID, departments.department_name AS name, departments.over_head_costs AS costs, sum(products.product_sales) AS sales FROM departments JOIN products ON departments.department_name = products.department_name GROUP BY products.department_name",
        function (err, res) {
            var tableData = [];
            if (err) throw err;
            res.forEach(function (element) {
                var net = element.sales - element.costs
                var data = { "ID": element.ID, "Deparment Name": element.name, "Overhead Costs": element.costs, "Total Sales": element.sales, "Net Sales": net }
                tableData.push(data)
            });
            console.log(Table.print(tableData));
            connection.end();
        })


};

function newDepartment() {
    inquirer.prompt([
        {
            name: "dName",
            type: "input",
            message: "Name of the new department?"
        },
        {
            name: "over_head",
            type: "input",
            message: "Overhead costs?"
        }
    ]).then(function(resp){
        var dName = resp.dName;
        var over_head = resp.over_head;
        connection.query("INSERT INTO departments (department_name, over_head_costs) values (?, ?)", [dName, over_head], function(err, res){
            if (err) throw err;
            if (res){
                console.log(`New department ${dName} successfully added.`);
                connection.end();
            }
        })
    })
}