var mysql = require("mysql");
var inquirer = require("inquirer");
var table = require("easy-table");

// Create connection to mysql server
var connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "G4qtyx7v1!",
  database: "bamazon"
});

connection.connect(function(err) {
  if (err) throw err;
  console.log("=========================================");
  console.log("    WELCOME TO BAMAZON MANAGER PORTAL    ");
  console.log("=========================================");
  managerInput();
});

function managerInput() {
  inquirer
    .prompt({
      name: "action",
      type: "list",
      message: "\nWhat would you like to do?\n",
      choices: [
        "View Products for Sale",
        "View Low Inventory",
        "Add to Inventory",
        "Add New Product",
        "Exit"
      ]
    })
    .then(function(response) {
      switch (response.action) {
        case "View Products for Sale":
          viewInventory();
          break;
        case "View Low Inventory":
          lowInventory();
          break;
        case "Add to Inventory":
          break;
        case "Add New Product":
          break;
        case "Exit":
          console.log("Goodbye!");
          connection.end();
          break;
      }
    });
}

function viewInventory() {
  connection.query(
    "SELECT item_id, product_name, department_name, price, stock_quantity FROM products ORDER BY item_id",
    function(err, results) {
      if (err) throw err;
      console.log(
        table.print(results, {
          item_id: { name: "Product ID" },
          product_name: { name: "Product Name" },
          department_name: { name: "Department Name" },
          price: { name: "Price ($)", printer: table.number(2) },
          stock_quantity: {
            name: "Stock Quantity",
            printer: table.number()
          }
        })
      );
      managerInput();
    }
  );
}

function lowInventory() {
  inquirer
    .prompt({
      name: "invtNumber",
      type: "input",
      message: "Enter an inventory threshold."
    })
    .then(function(response) {
      var inventory = response.invtNumber;
      connection.query(
        "SELECT product_name, department_name, stock_quantity FROM products WHERE stock_quantity <= ?",
        inventory,
        function(err, results) {
          if (err) throw err;
          console.log(
            table.print(results, {
              product_name: { name: "Product Name" },
              department_name: { name: "Department Name" },
              stock_quantity: {
                name: "Stock Quantity",
                printer: table.number()
              }
            })
          );
          managerInput();
        }
      );
    });
}
