mysql = require("mysql");

inquirer = require("inquirer");

let divider = "-------------------";

let connection = mysql.createConnection({
    host: "localhost",

    // Your port; if not 3306
    port: 3306,

    // Your username
    user: "root",

    // Your password
    password: "LOLsequellianpeople1!",
    database: "bamazon"
});

connection.connect(function (err) {
    if (err) throw err;
    console.log("connected as id " + connection.threadId);
    afterConnection();
});

function afterConnection() {

    // list a set of menu options using an inquirer list (view products, view low inventory, add to inventory, add new product)

    inquirer.prompt([{
        type: "list",
        name: "command",
        message: "choose a command",
        choices: ["view products", "view low inventory", "add to inventory", "add new product"]
    }]).then(function (user) {

        console.log(user.command);

        // use switch/case statement to run different functions

        switch (user.command) {
            case "view products":
                viewProducts();
            case "view low inventory":
                viewLowInventory();
            case "add to inventory":
                addToInventory();
            case "add new product":
                addProduct();
        }
    });

    // viewProducts() lists all available items

    function viewProducts() {
        connection.query("SELECT * FROM products", function (err, res) {
            if (err) throw err;
            for (let i = 0; i < res.length; i++) {
                console.log(divider);
                console.log("product ID: " + res[i].item_id);
                console.log("product name: " + res[i].product_name);
                console.log("department: " + res[i].department_name);
                console.log("price: $" + res[i].price);
                console.log("stock: " + res[i].stock_quantity);
            }
            console.log(divider);
            newOperation("view products");
        })

    }

    // viewLowInventory() lists all items where the stock_quantity is lower than 5

    function viewLowInventory() {
        connection.query("SELECT * FROM products WHERE stock_quantity < 5", function (err, res) {
            if (err) throw err;
            for (let i = 0; i < res.length; i++) {
                console.log(divider);
                console.log("product ID: " + res[i].item_id);
                console.log("product name: " + res[i].product_name);
                console.log("department: " + res[i].department_name);
                console.log("price: $" + res[i].price);
                console.log("stock: " + res[i].stock_quantity);
            }
            console.log(divider);
            inquirer.prompt([{
                type: "confirm",
                name: "order",
                message: "would you like to order more?"
            }]).then(function (user) {
                if (user.order) {
                    addToInventory();
                } else {
                    afterConnection();
                }
            })

        })
    }

    // addToInventory() adds more of an existing product to the inventory. the manager is prompted for the item_id and the amount they would like to add

    function addToInventory() {
        connection.query("SELECT * FROM products", function (err, res) {
            if (err) throw err;
            for (let i = 0; i < res.length; i++) {
                console.log(divider);
                console.log("product name: " + res[i].product_name);
                console.log("product ID: " + res[i].item_id);
                console.log("department: " + res[i].department_name);
                console.log("price: $" + res[i].price);
                console.log("stock: " + res[i].stock_quantity)
            }
            console.log(divider);

            inquirer.prompt([
                // then prompt the user for the id of the products they would like to buy
                {
                    type: "number",
                    name: "inputID",
                    message: "enter the id of the product you would like to order"
                },
                // then prompt the user to enter how much of the product they would like to buy
                {
                    type: "number",
                    name: "inputAmount",
                    message: "enter the amount of this item you would like to purchase"
                }
            ]).then(function (user) {

                if (user.inputID === "" || user.inputAmount === "") {
                    console.log("please don't leave any fields empty");
                    addToInventory();
                } else {

                    let product;

                    for (let i = 0; i < res.length; i++) {
                        if (res[i].item_id === user.inputID) {
                            product = res[i];
                        }
                    }

                    let newStock = product.stock_quantity + user.inputAmount;
                    console.log(newStock);

                    connection.query(
                        "UPDATE products SET ? WHERE ?",
                        [{
                                stock_quantity: newStock
                            },
                            {
                                item_id: user.inputID
                            }
                        ],
                        function (err) {
                            if (err) throw err;
                            // and alert the user of the total price and tell them that their order was fulfilled
                            console.log("order complete. " + user.inputAmount + " " + product.product_name + " ordered.");
                        }
                    );

                    newOperation("item added");

                }
            })
        })
    }

    // addProduct() adds a new product, prompting the manager for the product_name, the department_name, the price, and the stock_quantity

    function addProduct() {
        inquirer.prompt([{
                type: "input",
                name: "name",
                message: "enter product name"
            },
            {
                type: "number",
                name: "amount",
                message: "enter quantity"
            },
            {
                type: "input",
                name: "department",
                message: "enter department"
            },
            {
                type: "number",
                name: "price",
                message: "enter price"
            }
        ]).then(function (user) {

            // validate inputs

            inputs = [user.name, user.amount, user.department, user.price];

            if (inputs[0] === "" || inputs[1] === "" || inputs[2] === "" || inputs[3] === "") {
                console.log("please fill in all fields")
                addProduct();
            } else if (user.name.split('').length > 25 || user.department.split('').length > 20) {
                console.log("name of product or department too long");
                addProduct();
            } else if (user.amount < 0 || user.price < 0 || !Number.isInteger(user.amount) || !Number.isInteger(user.price)) {
                console.log("enter a positive integer in the amount/price fields");
                addProduct();
            } else {

                connection.query("INSERT INTO products SET ?,?,?,?",
                    [{
                            product_name: user.name
                        },
                        {
                            department_name: user.department
                        },
                        {
                            price: user.price
                        },
                        {
                            stock_quantity: user.amount
                        }
                    ],
                    function (err) {
                        if (err) throw err;
                    }
                )

                newOperation("add product");

            }
        })
    }

    // simple function to alert the user that the operation worked, and sends them back to the list of command options

    function newOperation(prev) {
        console.log(prev + " complete!")
        afterConnection();
    }

}