const inquirer = require('inquirer');
const Employee = require('./lib/Employee');
const Engineer = require('./lib/Engineer');
const Intern = require('./lib/Intern');
const Manager = require('./lib/Manager');

// Data Variables
let roleChoices = ["Manager", "Engineer", "Intern"];
let questions = [
    {
        type: "input",
        name: ""
    }
];

// Team Array
let team = [];

// Inquirer Prompt:
let asking = true;
let managerExists = false;

function begin(firstMessage, i = 0) {
    inquirer
    .prompt([

    ])
    .then(answers => {

    });
}