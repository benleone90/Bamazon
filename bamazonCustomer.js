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
  customerInput();
});

function customerInput() {
  inquirer
    .prompt({
      name: "action",
      type: "list",
      message: "\nWhat would you like to do?\n",
      choices: [
        "View available inventory",
        "Place an order",
        // "Back to main menu",
        "Exit"
      ]
    })
    .then(function(response) {
      switch (response.action) {
        case "View available inventory":
          viewInventory();
          break;
        case "Place an order":
          break;
        // case "Back to main menu":
        //   var greeting = require("./bamazonCustomer.js");
        //   greeting();
        //   break;
        case "Exit":
          connection.end();
          break;
      }
    });
}

function viewInventory() {
  inquirer
    .prompt({
      name: "action",
      type: "list",
      message: "\nSory by:",
      choices: ["Department", "Price (low to high)", "Price (high to low)"]
    })
    .then(function(response) {
      switch (response.action) {
        case "Department":
          connection.query(
            "SELECT item_id, product_name, department_name, price, stock_quantity FROM products ORDER BY department_name",
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
              customerInput();
            }
          );
          break;
        case "Price (low to high)":
          connection.query(
            "SELECT item_id, product_name, department_name, price, stock_quantity FROM products ORDER BY price",
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
              customerInput();
            }
          );
          break;
        case "Price (high to low)":
          connection.query(
            "SELECT item_id, product_name, department_name, price, stock_quantity FROM products ORDER BY price DESC",
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
              customerInput();
            }
          );
          break;
      }
    });
}
