const mysql = require("mysql");
const inquirer = require("inquirer")
const async = require("async")

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
            choices: ["Add new department.", "Add new roles.", "Add new employee.", "View all employees.", "View employees by department.", "View employees by role.", "Update department.", "Update roles.", "Update employee.", "QUIT"],
            message: "What action would you like to perform?"
        }
    ]).then(function (data) {
        switch (data.choice) {
            case "Add new department.":
                addDepartment();
                break;
            
            case "Add new roles.":
                addRole();
                break;
            
            case "Add new employee.":
                addEmployee();
                break;

            case "View all employees.":
                viewAll();
                break;

            case "View employees by department.":
                viewDept();
                break;
            
            case "View employees by role.":
                viewRole();
                break;

            case "Update department.":
                updateDept();
                break;

            case "Update roles.":
                updateRole();
                break;

            case "Update employee.":
                updateEmployee();
                break;

            case "QUIT":
                console.log("Thanks for using the employee manager");
                connection.end();
        }
    })
}

function addDepartment() {
    inquirer.prompt([
        {
            type: "input",
            name: "department",
            message: "What is the new department name?"
        }
    ]).then(function (data) {
        connection.query(
            "INSERT INTO department SET ?",
            {
                name: data.department
            }
        ), function (err, res) {
            if (err) throw err;

        }
        console.log("Successfully added.")
        startNext();

    })
}

function addRole() {
    inquirer.prompt([
        {
            type: "input",
            name: "role",
            message: "What is the new role name?"
        },
        {
            type: "number",
            name: "salary",
            message: "What is the salary for this role?"
        }
    ]).then(function (data) {
        connection.query(
            "INSERT INTO role SET ?",
            {
                title: data.role,
                salary: data.salary
            }
        ), function (err, res) {
            if (err) throw err;

        }
        console.log("Successfully added.")
        startNext();

    })
}

//Need to have a way to select roles and departments --FIX ME
function addEmployee() {
    inquirer.prompt([
        {
            type: "input",
            name: "firstName",
            message: "What is the employee's first name?"
        },
        {
            type: "input",
            name: "lastName",
            message: "What is the employee's last name?"
        },
        {
            type : "input",
            name : "dept",
            message : "Which department is this employee joining?"
        },
        {
            type : "input",
            name : "role",
            message : "Which role is this employee filling?"
        }
    ]).then(async function (data) {
        // Add in search results for role/dept and set values
    })
}
