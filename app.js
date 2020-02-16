const inquirer = require('inquirer');
const Employee = require('./lib/Employee');
const Engineer = require('./lib/Engineer');
const Intern = require('./lib/Intern');
const Manager = require('./lib/Manager');

// Data Variables

// Team Array
let team = [];

// Inquirer Prompt:
let asking = true;
let managerExists = false;

function beginQuestions() {
    inquirer
        .prompt([
            {
                type: "confirm",
                name: "continueEntering",
                message: "Add a team member?"
            },
        ])
        .then(answers => {
            if (!answers.continueEntering) {
                // finished();
                asking = false;
            } else {
                inquirer
                    .prompt([
                        {
                            type: "list",
                            name: "memberRole",
                            message: "Select role",
                            choices: ["Manager", "Engineer", "Intern"],
                            validate: (input, answers) => (input != "Manager" || !managerExists) ? true : "This team already has a manager."
                        }
                    ])
                    .then(answers => {
                        if (answers.memberRole.validate) {
                            console.log("yay");
                            console.log(answers.memberRole.validate);
                            beginQuestions();
                        } else {
                            console.log("hello");
                            console.log(answers.memberRole.validate);
                            beginQuestions();
                        }
                    });
            }
        });
}

beginQuestions();


function finished() {
    console.log("finished adding members")
}