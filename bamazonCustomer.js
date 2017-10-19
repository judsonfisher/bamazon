var mysql = require("mysql");
var inquirer = require("inquirer");

var connection = mysql.createConnection({
  host: "localhost",
  port: 3306,

  // Your username
  user: "root",

  // Your password
  password: "",
  database: "bamazon"
});

connection.connect(function(err) {
  if (err) throw err;
  start();
});

function start() {
	connection.query("SELECT * FROM products", function(err, results) {
		if (err) throw err;
		for (var x = 0; x < results.length; x++) {
			console.log(results[x].item_id, results[x].product_name, results[x].department_name, results[x].price, results[x].stock_quantity);
		};
		inquirer.prompt([
      			 {
			        name: "choice",
			        type: 'input',
			        message: "What is the ID of the item you would like to buy?",
			        validate: function(value) {
			          if (isNaN(value) === false) {
			            return true;
			          }
			          return false;
			        }
			     },
			     {
			        name: "quantity",
			        type: 'input',
			        message: "How many units would you like ot buy?",
			        validate: function(value) {
			          if (isNaN(value) === false) {
			            return true;
			          }
			          return false;
			        }
			     }
			      ]).then(function(answers) {
			      	checkQuantity(answers.choice, answers.quantity);
			      });
	});
};

var checkQuantity = function(choice, quantity){
	connection.query("SELECT * FROM products WHERE ?", [{ item_id: choice }], function(err, results) {
		if (err) throw err;
		var usedId = results[0].item_id;
		var desiredQuantity = quantity;
		var price = results[0].price;
		var realQuantity = results[0].stock_quantity;
		if (desiredQuantity > realQuantity) {
			console.log('Insufficient Quantity!');
			return start();
		} else if (desiredQuantity <= realQuantity) {
			realQuantity -= desiredQuantity;
			orderTotal = price * desiredQuantity;
			order(usedId, realQuantity, orderTotal);
		};
	});
};

function order(id, remaining, price) {
	connection.query("UPDATE products SET ? WHERE ?", 
		[
		  { 
		  	stock_quantity: remaining 
		  },
		  { 
		  	item_id: id 
		  }
		], function(err, results) {
			if (err) throw err;
			console.log("Thank you for shopping at Bamazon! Your total final price is: " + price);
			connection.end();
	});
};