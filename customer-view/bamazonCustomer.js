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

    // display all the available items

    console.log("welcome to the art supply store!");

    connection.query("SELECT * FROM products", function (err, res) {
        if (err) throw err;
        for (let i = 0; i < res.length; i++) {
            console.log(divider);
            console.log("product name: " + res[i].product_name);
            console.log("product ID: " + res[i].item_id);
            console.log("price: $" + res[i].price);
        }
        console.log(divider);

        inquirer.prompt([
            // then prompt the user for the id of the products they would like to buy
            {
                type: "number",
                name: "inputID",
                message: "please enter the id of the product you would like to purchase"
            },
            // then prompt the user to enter how much of the product they would like to buy
            {
                type: "number",
                name: "inputAmount",
                message: "please enter the amount of this item you would like to purchase"
            }
        ]).then(function (user) {

            let product;

            for (let i = 0; i < res.length; i++) {
                if (res[i].item_id === user.inputID) {
                    product = res[i];
                }
            }

            // then check if the desired product/quantity exists in the database

            if (user.inputAmount > product.stock_quantity) {

                // then, EITHER alert the user that their request could not be fulfilled

                console.log("unable to fulfill request: we don't have that much " + product.product_name + " in our store");

                // OR, update the database to reflect the remaining quantity

            } else {

                let newStock = product.stock_quantity - user.inputAmount;
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
                        let price = product.price * user.inputAmount;
                        console.log("your order has been placed! " + user.inputAmount + " " + product.product_name + " for a total of $" + price);

                    }
                );
            }
        })
    })
};