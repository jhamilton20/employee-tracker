const mysql = require("mysql");
const inquirer = require("inquirer");
const clear = require("clear");
const chalk = require("chalk");
const figlet = require("figlet");
const cTable = require("console.table");

var connection = mysql.createConnection({
  host: "localHost",
  port: 3306,
  user: "root",
  password: "1982",
  database: "employee_tracker"
});

connection.connect(function(err) {
  if (err) throw err;
  console.log("you are connected");
  promptQuestions();
  queryRoles();
  queryDepartments();
});

const departments = [];

function queryDepartments() {
  connection.query("SELECT name FROM department", function(err, res) {
    if (err) throw err;
    for (i = 0; i < res.length; i++) {
      departments.push(res[i].name);
    }
  });
}

const roles = [];

function queryRoles() {
  connection.query("SELECT title FROM role", function(err, res) {
    if (err) throw err;
    for (i = 0; i < res.length; i++) {
      roles.push(res[i].title);
    }
  });
}

function promptQuestions() {
  console.clear();
  console.log(
    chalk.yellow(figlet.textSync("Employee", { horizontalLayout: "full" }))
  );
  console.log(
    chalk.red(figlet.textSync("Manager", { horizontalLayout: "full" }))
  );

  inquirer
    .prompt({
      type: "rawlist",
      name: "choices",
      message: "What would you like to do?",
      choices: [
        "View All Employees",
        "View All Departments",
        "View All Roles",
        "Add Employee",
        "Add Department",
        "Add Role",
        "Update Employee Role",
        "Quit"
      ]
    })
    .then(function(answer) {
      switch (answer.choices) {
        case "View All Employees":
          viewAllEmp();
          break;

        case "View All Departments":
          viewAllDept();
          break;

        case "View All Roles":
          viewAllRole();
          break;

        case "Add Employee":
          addEmp();
          break;

        case "Add Department":
          addDept();
          break;

        case "Add Role":
          addRole();
          break;

        case "Update Employee Role":
          updateEmpRole();
          break;

        case "Quit":
          quit();
          break;
      }
    });
}

function viewAllEmp() {
  connection.query("SELECT *  FROM employee", function(err, res) {
    if (err) throw err;
    console.clear();
    console.log(
      chalk.yellow(
        figlet.textSync("Employees", { horizontalLayout: "default" })
      )
    );
    console.table(res);
  });
  promptQuestions();
}

function viewAllDept() {
  connection.query("SELECT *  FROM department", function(err, res) {
    if (err) throw err;
    console.clear();
    console.log(
      chalk.green(
        figlet.textSync("Departments", { horizontalLayout: "default" })
      )
    );
    console.table(res);
  });
  promptQuestions();
}

function viewAllRole() {
  connection.query("SELECT *  FROM role", function(err, res) {
    if (err) throw err;
    console.clear();
    console.log(
      chalk.magenta(figlet.textSync("Roles", { horizontalLayout: "default" }))
    );
    console.table(res);
  });
  promptQuestions();
}

function addEmp() {
  inquirer
    .prompt([
      {
        type: "input",
        name: "firstName",
        message: "What is the employees first name?"
      },
      {
        type: "input",
        name: "lastName",
        message: "What is the employees last name?"
      },
      {
        type: "list",
        name: "role",
        message: "What is the employees role id?",
        choices: [1, 2, 3, 4]
      },
      {
        type: "list",
        name: "managerId",
        message: "What is the employees manager ID?",
        choices: [1, 2, 3, 4, 5, 6, 7, 8, 9, "null"]
      }
    ])

    .then(val => {
      connection.query(
        "INSERT INTO employee SET ?",
        {
          first_name: val.firstName,
          last_name: val.lastName,
          role_id: val.role,
          manager_id: val.man
        },
        function(err, res) {
          if (err) throw err;
          promptQuestions();
        }
      );
    });
}

function addDept() {
  inquirer
    .prompt([
      {
        type: "input",
        name: "dept",
        message: "What is the department you want to add?"
      }
    ])
    .then(val => {
      connection.query(
        "INSERT INTO department SET ?",
        {
          name: val.dept
        },
        function(err, res) {
          if (err) throw err;
          promptQuestions();
        }
      );
    });
}

function addRole() {
  inquirer
    .prompt([
      {
        type: "input",
        name: "role",
        message: "What is the role you want to add?"
      },
      {
        type: "input",
        name: "salary",
        message: "What is the salary for this role?"
      },
      {
        type: "list",
        name: "dept_id",
        message: "What is the department id for this role?",
        choices: [1, 2, 3, 4]
      }
    ])
    .then(val => {
      connection.query(
        "INSERT INTO role SET ?",
        {
          title: val.role,
          salary: val.salary,
          department_id: val.dept_id
        },
        function(err, res) {
          if (err) throw err;
          promptQuestions();
        }
      );
    });
}

function updateEmpRole() {
  inquirer
    .prompt([
      {
        type: "list",
        name: "updaterole",
        message: "Which role would you like to update?",
        choices: roles
      }
    ])
    .then(val => {
      connection.query(
        "SELECT * FROM role WHERE title = ?",
        [val.updaterole],
        function(err, res) {
          if (err) throw err;
          console.log(chalk.cyan("Current role:"));
          console.table(res);
          inquirer
            .prompt([
              {
                type: "input",
                name: "title",
                message: "What is the title of the role?"
              },
              {
                type: "input",
                name: "salary",
                message: "What is the salary of the role?"
              },
              {
                type: "list",
                name: "department",
                message: "What department does the role belong to?",
                choices: departments
              }
            ])
            .then(val2 => {
              connection.query(
                "SELECT * FROM department WHERE name = ?",
                [val2.department],
                function(err, res2) {
                  if (err) throw err;
                  connection.query(
                    "UPDATE role SET title = ?, salary = ?, department_id = ? WHERE title = ?",
                    [val2.title, val2.salary, res2[0].id, val.updaterole]
                  );

                  promptQuestions();
                }
              );
            });
        }
      );
    });
}

function quit() {
  //console.log("quit");
  connection.end();
}
