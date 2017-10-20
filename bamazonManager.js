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
	inquirer.prompt([
	{
		name: 'choice',
		type: 'list',
		choices: ['View Products for Sale', 'View Low Inventory', 'Add to Inventory', 'Add New Product'],
		message: 'Which option would you like to select from?'
	}
	]).then(function (answer) {
		var choice = answer.choice;
		switch (choice) {
			case 'View Products for Sale':
			return viewProducts();
			break;
			case 'View Low Inventory': 
			return lowInventory();
			break;
			case 'Add to Inventory': 
			return addInventory();
			break;
			case 'Add New Product':
			return newProduct();
			break;
		};
	});
};

function viewProducts() {
	connection.query("SELECT * FROM products", function(err, results) {
		if (err) throw err;
		for (var x = 0; x < results.length; x++) {
			console.log(results[x].item_id, results[x].product_name, results[x].department_name, results[x].price, results[x].stock_quantity);
		};
	});
	// return start();	
	connection.end();
};

function lowInventory() {
	connection.query("SELECT * FROM products", function(err, results) {
		if (err) throw err;
		for (var x = 0; x < results.length; x++) {
			if (results[x].stock_quantity < 5) {
				console.log('LOW INVENTORY! Item: ' + results[x].product_name + '| Remaining: ' + results[x].stock_quantity);
			}; 
		};
	});
	// return start();	
	connection.end();
};

function addInventory() {
	inquirer.prompt([
		{
			name: 'choice',
			type: 'input',
			message: "What is the ID of the item you would like to add to?",
	        validate: function(value) {
	          if (isNaN(value) === false) {
	            return true;
	          }
	          return false;
	        }
		},
		{
			name: 'number',
			type: 'input',
			message: "How much would you like to add?",
	        validate: function(value) {
	          if (isNaN(value) === false) {
	            return true;
	          }
	          return false;
	        }
		}
		]).then(function(answers) {
			connection.query("SELECT * FROM products WHERE ?", [{ item_id: answers.choice }], function(err, results) {
				if (err) throw err;
				var newQuantity = parseInt(results[0].stock_quantity) + parseInt(answers.number);
				connection.query("UPDATE products SET ? WHERE ?", 
					[
					  { 
					  	stock_quantity: newQuantity
					  },
					  { 
					  	item_id: answers.choice 
					  }
					], function(err, results) {
						if (err) throw err;
						console.log("The stock quantity has been increased by: " + answers.number + '. Thank you!');
						connection.end();
					});
				});
		});
};

function newProduct() {
	inquirer.prompt([
		{
			name: 'name',
			type: 'input',
			message: "What is name of the new product?",
		},
		{
			name: 'department',
			type: 'input',
			message: "In which department does it belong?",
		},
		{
	        name: "price",
	        type: 'input',
	        message: "What will the price be set to?",
	        validate: function(value) {
	          if (isNaN(value) === false) {
	            return true;
	          }
	          return false;
	        }
	    },
	    {
	        name: "stock",
	        type: 'input',
	        message: "What the stock quantity be set to?",
	        validate: function(value) {
	          if (isNaN(value) === false) {
	            return true;
	          }
	          return false;
	        }
	    }
		]).then(function(answers) {
			var name = answers.name
			var department = answers.department;
			var itemPrice = answers.price;
			var stock = answers.stock;
			var values = { 
				product_name: name,
				department_name: department,
				price: itemPrice,
				stock_quantity: stock
			};
			connection.query('INSERT INTO products SET ?', values, function (error, results, fields) {
			  if (error) throw error;
			  console.log('Thank you! Your product has been added.');
			  connection.end();
			});
		});
};

// if add new product, will send to new inquiere function and then run through series of questions relating to columns