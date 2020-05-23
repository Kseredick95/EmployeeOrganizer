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

//User chooses action
function startNext() {
    inquirer.prompt([
        {
            type: "list",
            name: "choice",
            choices: ["Add new department.", "Add new roles.", "Add new employee.", "View all employees.", "View departments.", "View roles.", "Update employee.", "QUIT"],
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

            case "View departments.":
                viewDept();
                break;

            case "View roles.":
                viewRole();
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

//Add functions
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
        ), function (err) {
            if (err) throw err;
        }

        console.log("Successfully added.")

        startNext();
    })
}

function addRole() {
    connection.query("SELECT * FROM department", function (err, res) {
        if (err) throw err;

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
            },
            {
                type: "rawlist",
                name: "department",
                message: "Which department does this role belong to?",
                choices: function () {
                    var listDept = [];
                    res.forEach(result => {
                        listDept.push(result.name);
                    });
                    return listDept;
                }
            },

        ]).then(function (data) {

            var chosenDept;
            for (var i = 0; i < res.length; i++) {
                if (res[i].name === data.department) {
                    chosenDept = res[i];
                }
            }

            connection.query(
                "INSERT INTO roles SET ?",
                {
                    title: data.role,
                    salary: data.salary,
                    department_id: chosenDept.id
                },
                function (err) {
                    if (err) throw err;
                })

            console.log("Successfully added.")

            startNext();

        })
    })
}

function addEmployee() {
    connection.query("SELECT * FROM roles", function (err, res) {
        if (err) throw err;

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
                type: "rawlist",
                name: "role",
                message: "Which role is this employee filling?",
                choices: function () {
                    let roles = [];

                    res.forEach(result => {
                        roles.push(result.title)
                    })
                    return roles;
                }
            }
        ]).then(function (data) {
            let chosenRole;

            for (var i = 0; i < res.length; i++) {
                if (res[i].title === data.role) {
                    chosenRole = res[i];
                }
            }

            connection.query(
                "INSERT INTO employee SET ?",
                {
                    first_name: data.firstName,
                    last_name: data.lastName,
                    role_id: chosenRole.id
                }
            ), function (err) {
                if (err) throw err;
            }

            console.log("Successfully added.")
            startNext();
        })
    })
}

// Update function

function updateEmployee() {
    connection.query("SELECT * FROM employee", function (err, res) {
        if (err) throw err;
        connection.query("SELECT * FROM roles", function (roleErr, roleRes) {
            if (roleErr) throw (roleErr);

            inquirer.prompt([
                {
                    type: "rawlist",
                    name: "oldEmployee",
                    message: "Which employee would you like to update?",
                    choices: function () {
                        var listEmployee = [];

                        res.forEach(result => {
                            listEmployee.push(result.last_name);
                        })
                        return listEmployee;
                    }
                },
                {
                    type: "rawlist",
                    name: "newRole",
                    message: "What would you like to change the employee role to?",
                    choices: function () {
                        var listRole = []
                        roleRes.forEach(results => {
                            listRole.push(results.title)
                        })
                        return listRole;
                    }

                }
            ]).then(function (data) {

                let chosenEmployee;
                let chosenRole;

                for (var i = 0; i < res.length; i++) {
                    if (res[i].last_name === data.oldEmployee) {
                        chosenEmployee = res[i];
                    }
                }

                for (var i = 0; i < roleRes.length; i++) {
                    if (roleRes[i].title === data.newRole) {
                        chosenRole = roleRes[i];
                    }
                }

                connection.query(
                    "UPDATE employee SET ? WHERE ?",
                    [
                        {
                            id: chosenEmployee.id
                        },
                        {
                            role_id: chosenRole.id
                        }
                    ], function (error) {
                        if (error) throw error;
                    }
                );


                console.log("Successfully updated.")

                startNext();
            })
        })
    })
}

//View functions
function viewAll() {
    connection.query("SELECT * FROM employee", function (err, res) {
        if (err) throw err;

        console.table(res);

        startNext();
    })
}

function viewDept() {
    connection.query("SELECT * FROM department", function (err, res) {
        if (err) throw err;

        console.table(res);

        startNext();
    })
}

function viewRole() {
    connection.query("SELECT * FROM roles", function (err, res) {
        if (err) throw err;

        console.table(res);

        startNext();
    })
}