DROP DATABASE IF EXISTS employee_tracker;

CREATE database employee_tracker;

USE employee_tracker;

CREATE TABLE department (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR (30) NOT NULL
);

CREATE TABLE role (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR (30),
    salary DECIMAL,
    department_id INT NOT NULL,
    FOREIGN KEY (department_id) REFERENCES department (id)
);

CREATE TABLE Employee (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR (30),
    last_name VARCHAR (30),
    role_id INT NOT NULL,
    manager_id INT,
    FOREIGN KEY (role_id) REFERENCES role (ID),
    FOREIGN KEY (manager_id) REFERENCES employee (id)
);

INSERT INTO
    department (name)
VALUES
    ("Operations"),
    ("Production"),
    ("HR"),
    ("Sales");

INSERT INTO
    role (title, salary, department_id)
VALUES
    ("Operations Director", 190000, 1),
    ("Operations Manager", 120000, 1),
    ("Operations Intern", 85000, 1),
    ("Production Director", 150000, 2),
    ("Production Manager", 110000, 2),
    ("Production Intern", 65000, 2),
    ("HR Director", 220000, 3),
    ("HR Manager", 175000, 3),
    ("HR Intern", 90000, 3),
    ("Sales Director", 175000, 4),
    ("Sales Manager", 145000, 4),
    ("Sales Intern", 65000, 4);

INSERT INTO
    employee (first_name, last_name, role_id, manager_id)
VALUES
    ("john", "smith", 1, NULL),
    ("arnold", "Sung", 1, 1),
    ("rorr", "obama", 1, 2),
    ("mac ", "longmire", 2, 3),
    ("Dick", "strong", 2, NULL),
    ("drake", "bell", 2, 4),
    ("arnold", "smith", 3, 5),
    ("denzel", "washngton", 3, 6),
    ("lil ", "wayne", 3, NULL),
    ("jeff", "josh", 4, 7),
    ("Crystal", "johnson", 4, 8),
    ("jack", "johbn", 4, 9),
    ("Jakk", "arnie", 4, NULL);