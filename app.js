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

let fresh = {};

function beginQuestions(firstQuestion) {
    inquirer
        .prompt([
            {
                type: "confirm",
                name: "continueEntering",
                message: firstQuestion
            },
        ])
        .then(answers => {
            fresh = {};
            if (!answers.continueEntering) {
                finished(team);
                asking = false;
            } else {
                inquirer
                    .prompt([
                        {
                            type: "list",
                            name: "memberRole",
                            message: "Select role",
                            choices: (managerExists) ? ["Engineer", "Intern"] : ["Manager"]
                        }
                    ])
                    .then(answers => {
                        if (answers.memberRole != "Manager" || !managerExists) {
                            fresh.role = answers.memberRole;
                            if (answers.memberRole === "Manager") managerExists = true;
                            inquirer
                                .prompt([
                                    {
                                        type: "input",
                                        name: "memberName",
                                        message: "Enter name",
                                        validate: function (value) {
                                            if (value != '') return true;
                                            else return "Name must not be blank!"
                                        }
                                    },
                                    {
                                        type: "input",
                                        name: "memberId",
                                        message: "Enter ID Number",
                                        // This validate taken directly from https://github.com/SBoudrias/Inquirer.js/blob/master/packages/inquirer/examples/pizza.js line:46
                                        validate: function (value) {
                                            return (value == parseInt(value)) ? true : "Please enter a valid ID";
                                        }
                                    },
                                    {
                                        type: "input",
                                        name: "memberEmail",
                                        message: "Enter email",
                                        validate: function (value) {
                                            return (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(value) ? true : "Enter a valid email address!");
                                        }
                                    }
                                ]).then(answers => {
                                    fresh.name = answers.memberName;
                                    fresh.id = answers.memberId;
                                    fresh.email = answers.memberEmail;
                                    let uniqueQuestion;
                                    switch (fresh.role) {
                                        case "Engineer":
                                            uniqueQuestion = {
                                                type: "input",
                                                name: "uniqueInfo",
                                                message: "Enter engineer's Github",
                                            };
                                            break;
                                        case "Intern":
                                            uniqueQuestion = {
                                                type: "input",
                                                name: "uniqueInfo",
                                                message: "Enter intern's school",
                                            };
                                            break;
                                        case "Manager":
                                            uniqueQuestion = {
                                                type: "input",
                                                name: "uniqueInfo",
                                                message: "Enter manager's office number",
                                                validate: function (value) {
                                                    return (value == parseInt(value)) ? true : "Please enter a valid ID";
                                                }
                                            };
                                    }
                                    inquirer
                                        .prompt(uniqueQuestion)
                                        .then(answers => {
                                            fresh.unique = answers.uniqueInfo;
                                            console.log('New member added:');
                                            console.log(fresh);
                                            team.push(fresh);
                                            beginQuestions("Add another team member?");
                                        });
                                });
                        } else {
                            beginQuestions("Error: This team already has a manager! Would you like to continue adding members?");
                        }
                    });
            }
        });
}

function genMain(team) {

}

function genEngineer(engineer) {

}

function genManager(manager) {

}

function genIntern(intern) {

}

function finished(team) {
    let sortedTeam = [];
    let htmlArray = [];
    // Sort team members into new array (Manager > Engineer > Intern)
    team.forEach(member => {
        if (member.role === "Manager") sortedTeam.push(member);
    });
    team.forEach(member => {
        if (member.role === "Engineer") sortedTeam.push(member);
    });
    team.forEach(member => {
        if (member.role === "Intern") sortedTeam.push(member);
    });

    for (let i = 0; i < sortedTeam.length; i++) {
        const member = sortedTeam[i];
        switch (member.role) {
            case "Engineer":

                break;
            case "Manager":

                break;
            case "Intern":

                break;
        }

    }
    // let managerHTML = genManager();
    // let internHTML;
    // let engineerHTML;
    // console.log("finished adding members")
    // console.log(team);
    // genMain(team);
}

beginQuestions("Add a team member?");