var mysql = require("mysql");
var inquirer = require("inquirer");
var Table = require('easy-table');
var t = new Table;

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
		choices: ['View Product Sales by Department', 'Create New Department'],
		message: 'Which option would you like to select from?'
	}
	 ]).then(function(answers) {
	  	if (answers.choice === 'View Product Sales by Department') {
	  		return depSales();
	  	} else if (answers.choice === 'Create New Department') {
	  		return createDepartment();
	  	};
	  });
}

function depSales() {
	console.log("This operation is still in the works. Please ckeck back later! :)");
	connection.end();
};


function createDepartment() {
	inquirer.prompt([
		{
			name: 'name',
			type: 'input',
			message: "What is name of the new department?",
		},
		{
	        name: "costs",
	        type: 'input',
	        message: "What are the overhead costs associated with this department?",
	        validate: function(value) {
	          if (isNaN(value) === false) {
	            return true;
	          }
	          return false;
	        }
	    },
		]).then(function(answers) {
			var name = answers.name
			var costs = answers.costs;
			var values = { 
				department_name: name,
				over_head_costs: costs
			};
			connection.query('INSERT INTO departments SET ?', values, function (error, results, fields) {
			  if (error) throw error;
			  console.log('This department has been created. Go hire some people.');
			  connection.end();
			});
		});
};




// var data = [];
// 	connection.query("SELECT * FROM departments", function(err, results) {
// 		if (err) throw err;
// 		var id;
// 		var name;
// 		var overhead;
// 		for (var x = 0; x < results.length; x++) {
// 			console.log(results[x].item_id, results[x].product_name, results[x].department_name, results[x].price, results[x].stock_quantity);
// 		};
// 	});