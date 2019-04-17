var mysql = require("mysql");
var inquirer = require("inquirer");
var table = require("easy-table");

// Create connection to mysql server
var connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "",
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
          addInventory();
          break;
        case "Add New Product":
          addProduct();
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
      message: "Enter an inventory threshold:"
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

function addInventory() {
  inquirer
    .prompt({
      name: "itemid",
      type: "input",
      message: "Enter the Item ID of the product you wish to add inventory."
    })
    .then(function(response) {
      var itemid = response.itemid;
      connection.query(
        "SELECT item_id, product_name, department_name, price, stock_quantity FROM products WHERE item_id = ?",
        itemid,
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
          inquirer
            .prompt({
              name: "invtadd",
              type: "input",
              message: "Enter the number of inventory you wish to add:"
            })
            .then(function(response1) {
              var invtadd = +response1.invtadd;
              var newInvt = +results[0].stock_quantity + invtadd;
              connection.query(
                "UPDATE products SET stock_quantity = " +
                  newInvt +
                  " WHERE item_id = " +
                  results[0].item_id,
                function(err, response) {
                  if (err) throw err;
                  console.log(
                    "\nConfirmed! The inventory of " +
                      results[0].product_name +
                      " is now " +
                      newInvt +
                      "."
                  );
                  managerInput();
                }
              );
            });
        }
      );
    });
}

function addProduct() {
  connection.query("SELECT DISTINCT department_name FROM products", function(
    err,
    results
  ) {
    if (err) throw err;
    var dept = [];
    for (var i = 0; i < Object.keys(results).length; i++) {
      dept.push(results[i].department_name);
    }
    // console.log(dept);
    inquirer
      .prompt({
        name: "dept",
        type: "list",
        choices: dept,
        message: "\nWhich department would you like to add a product?"
      })
      .then(function(response) {
        inquirer
          .prompt({
            name: "itemName",
            type: "input",
            message:
              "You selected: " +
              response.dept +
              "\nWhat is the name of the new product?"
          })
          .then(function(response1) {
            inquirer
              .prompt({
                name: "itemPrice",
                type: "input",
                message:
                  "What is the unit price of " +
                  response1.itemName +
                  " in USD($)?"
              })
              .then(function(response2) {
                inquirer
                  .prompt({
                    name: "itemStock",
                    type: "input",
                    message:
                      "The unit price of " +
                      response1.itemName +
                      " is $" +
                      +response2.itemPrice +
                      "\nHow many would you like to put in stock?"
                  })
                  .then(function(response3) {
                    inquirer
                      .prompt({
                        name: "confirmAdd",
                        type: "confirm",
                        message:
                          "You would like to add " +
                          response3.itemStock +
                          " " +
                          response1.itemName +
                          " at a unit price of $" +
                          response2.itemPrice +
                          " to the " +
                          response.dept +
                          " department.\nIs that correct?"
                      })
                      .then(function(response4) {
                        if (response4.confirmAdd) {
                          connection.query(
                            "INSERT INTO products SET ?",
                            [
                              {
                                product_name: response1.itemName,
                                department_name: response.dept,
                                price: response2.itemPrice,
                                stock_quantity: response3.itemStock
                              }
                            ],
                            function(err, results) {
                              if (err) throw err;
                              console.log(
                                response1.itemName +
                                  " successfully added to database!"
                              );
                              managerInput();
                            }
                          );
                        } else {
                          console.log("Product Add Canceled!");
                          managerInput();
                        }
                      });
                  });
              });
          });
      });
  });
}
