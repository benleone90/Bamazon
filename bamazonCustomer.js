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
  console.log("            WELCOME TO BAMAZON!          ");
  console.log("=========================================");
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
          placeOrder();
          break;
        // case "Back to main menu":
        //   var greeting = require("./bamazonCustomer.js");
        //   greeting();
        //   break;
        case "Exit":
          console.log("Thanks for shopping! Goodbye!");
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
      message: "\nSort by:",
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

function placeOrder() {
  inquirer
    .prompt({
      name: "productID",
      type: "input",
      message: "Enter the Product ID of them item you wish to purchase."
    })
    .then(function(response1) {
      var product = response1.productID;
      connection.query(
        "SELECT * FROM products WHERE item_id = ?",
        product,
        function(err, results) {
          if (err) throw err;
          if (Object.keys(results).length === 0) {
            console.log(
              "That product does not exist. Please choose a valid Product ID.\n"
            );
            placeOrder();
          } else {
            inquirer
              .prompt({
                name: "quantity",
                type: "input",
                message:
                  "You selected: " +
                  results[0].product_name +
                  "\nHow many would you like to purchase?"
              })
              .then(function(response2) {
                var quantity = response2.quantity;
                // console.log(results[0].stock_quantity);
                if (
                  quantity > results[0].stock_quantity &&
                  results[0].stock_quantity > 0
                ) {
                  console.log(
                    "\nWe're sorry but we only have " +
                      results[0].stock_quantity +
                      " " +
                      results[0].product_name +
                      " in stock. Please try again.\n"
                  );
                  placeOrder();
                } else if (
                  quantity > results[0].stock_quantity &&
                  results[0].stock_quantity === 0
                ) {
                  console.log(
                    "\nWe're sorry but " +
                      results[0].product_name +
                      " is currently out of stock. Please try again.\n"
                  );
                  placeOrder();
                } else {
                  var newQuantity = results[0].stock_quantity - quantity;
                  var totalPrice = quantity * results[0].price;
                  connection.query(
                    "UPDATE products SET stock_quantity = " +
                      newQuantity +
                      " WHERE item_id = " +
                      results[0].item_id,
                    function(err, response) {
                      if (err) throw err;
                      console.log(
                        "\nThank you for your purchase!\n\nYour total is: $" +
                          totalPrice.toFixed(2)
                      );
                      customerInput();
                    }
                  );
                }
              });
          }
        }
      );
    });
}
