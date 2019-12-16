# bamazon

# Overview:

This node application interacts with a MySQL database to send, recieve and modify data pertaining to a fictional art supply store. There are two levels, a customer and manager level. The customer level allows the user to see a list of all available items in the store and make a purchase based on the ID of the item. The manager level allows the user to see a list of all available items, see which items are low in inventory, add more of an existing item to the database, or add a completely new item to the store.

Both views declare a connection to the MySQL database, and require MySQL and Inguirer.js packages before running the afterConnection() function.

# Customer view

In the customer view, a SELECT query is made to the database, returning all the available items to the customer. Inquirer.js is then used to prompt the user for an ID and the amount they want to order, corresponding to an item in the database. Once the user enters an ID, the app verifies that there is enough of the item in the database, and that the ID exists within the database.



If both of those conditions are met, the specified amount of the selected items are removed from the database, and the user is sent back to the list of items.

# Manager view

In the manager view, the user is asked to select one of four commands: [image]

The viewProducts() function has the same effect as it does in the customer view; all the available items in the database are displayed with their ID, name, department, price, and quantity. The user is then sent back to the afterConnection() function and prompted to select another command.

The viewLowInventory() function does the same thing as the viewProducts() function, but only displays the items where the quantity is lower than 5. The user is then asked if they want to order more of an item. If they confirm, they are sent to the addToInventory() function. If not, they are returned to the afterConnection() function and prompted to select another command.

The addToInventory() function displays all available items, then prompt the user to enter the ID of the item they want to order more of, and the amount they want to order. Then their inputs are verified to make sure that the ID exists within the database and all fields are filled in. Then, an UPDATE query is made to the MySQL database to update the quantity of the item ordered. Then they are sent back to the afterConnection() function and prompted to select another command.

The addProduct() function prompts the user for the name, department, price and quantity of the item they want to add. An if/else statement checks that all the fields have been filled in and that the inputs make sense for the database column they will be added to (checking that strings don't exceed the MySQL database limit and that the price and quantity fields contain integers). Then, an INSERT INTO query is made to the MySQL database, and the user inputs are inserted into their respective fields. Then the user is informed that the operation was successful and are returned to the afterConnection() function and prompted to select another command.

