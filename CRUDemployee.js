const mysql = require("mysql");
const inquirer = require("inquirer")

const connection = mysql.createConnection({
    host: "localhost",
    port: process.env.PORT || 3306,
    user: "root",
    password: "notmypassword",
    database: "employee_db"
});

connection.connect(function (err) {
    if (err) throw err;
    console.log("Connected to port");
    startNext();
});

function startNext() {
    inquirer.prompt([
        {
            type: "list",
            name: "choice",
            choices: ["Add new department.", "Add new roles.","Add new employee.", "View all employees.", "View employees by department.", "View employees by role.", "Update department.", "Update roles.", "Update employee.", "QUIT"],
            message: "What action would you like to perform?"
        }
    ]).then(function (data) {
        connection.query("SELECT * FROM department", function(err,res){
            if (err) throw err;
        })

        //Add functions (awaiting add employee as it relies on other adds first)
        if (data.choice === "Add new employee.") { addEmployee() }
        else if (data.choice === "Add new department.") { addDepartment() }
        else if (data.choice === "Add new roles.") { addRole() }
        

    })
}

function addDepartment() {
    inquirer.prompt([
        {
            type : "input",
            name : "department",
            message : "What is the new department name?"
        }
    ]).then(function(data){
        connection.query(
            "INSERT INTO department SET ?",
            {
                name : data.department
            }
        ), function(err, res) {
            if (err) throw err;

        }
        console.log("Successfully added.")
        startNext();
        
    })
}
