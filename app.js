const inquirer = require('inquirer');
const fs = require('fs');
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
                                            let newMember;
                                            switch (fresh.role) {
                                                case "Engineer":
                                                    newMember = new Engineer(fresh.name, fresh.id, fresh.email, fresh.unique);
                                                    break;
                                                case "Manager":
                                                    newMember = new Manager(fresh.name, fresh.id, fresh.email, fresh.unique);
                                                    break;
                                                case "Intern":
                                                    newMember = new Intern(fresh.name, fresh.id, fresh.email, fresh.unique);
                                                    break;
                                            }
                                            console.log('New member added:');
                                            console.log(newMember);
                                            team.push(newMember);
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

function genEngineer(member) {
    return `

                <div class="col">
                    <div class="card" style="width: 18rem;">
                        <div class="card-body">

                            <div class="row">
                                <div class="col">
                                    <h3 class="card-title">${member.getName()}</h3>
                                    <h5 class="card-title">${member.getRole()}</h5>
                                </div>
                            </div>

                            <div class="row">
                                <div class="col">

                                    <div class="row">
                                        <div class="col">
                                            <p>ID: ${member.getId()}</p>
                                        </div>
                                    </div>

                                    <div class="row">
                                        <div class="col">
                                            <p>Email: ${member.getEmail()}</p>
                                        </div>
                                    </div>

                                    <div class="row">
                                        <div class="col">
                                            <p>Github: <a href="https://github.com/${member.getGithub()}" target="_blank">${member.getGithub()}</a>
                                            </p>
                                        </div>
                                    </div>

                                </div>
                            </div>
                        </div>
                    </div>
                </div>`
}

function genManager(member) {
    return `

                <div class="col">
                    <div class="card" style="width: 18rem;">
                        <div class="card-body">

                            <div class="row">
                                <div class="col">
                                    <h3 class="card-title">${member.getName()}</h3>
                                    <h5 class="card-title">${member.getRole()}</h5>
                                </div>
                            </div>

                            <div class="row">
                                <div class="col">

                                    <div class="row">
                                        <div class="col">
                                            <p>ID: ${member.getId()}</p>
                                        </div>
                                    </div>

                                    <div class="row">
                                        <div class="col">
                                            <p>Email: ${member.getEmail()}</p>
                                        </div>
                                    </div>

                                    <div class="row">
                                        <div class="col">
                                            <p>Office Number: ${member.getOfficeNumber()}</a>
                                            </p>
                                        </div>
                                    </div>

                                </div>
                            </div>
                        </div>
                    </div>
                </div>`
}

function genIntern(member) {
    return `

                <div class="col">
                    <div class="card" style="width: 18rem;">
                        <div class="card-body">

                            <div class="row">
                                <div class="col">
                                    <h3 class="card-title">${member.getName()}</h3>
                                    <h5 class="card-title">${member.getRole()}</h5>
                                </div>
                            </div>

                            <div class="row">
                                <div class="col">

                                    <div class="row">
                                        <div class="col">
                                            <p>ID: ${member.getId()}</p>
                                        </div>
                                    </div>

                                    <div class="row">
                                        <div class="col">
                                            <p>Email: ${member.getEmail()}</p>
                                        </div>
                                    </div>

                                    <div class="row">
                                        <div class="col">
                                            <p>School: ${member.getSchool()}</a>
                                            </p>
                                        </div>
                                    </div>

                                </div>
                            </div>
                        </div>
                    </div>
                </div>`
}

function genMain(cardsHTML) {
    return `
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
    <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.4.1/css/bootstrap.min.css"
        integrity="sha384-Vkoo8x4CGsO3+Hhxv8T/Q5PaXtkKtu6ug5TOeNV6gBiFeWPGFN9MuhOf23Q9Ifjh" crossorigin="anonymous">
    <script src="https://kit.fontawesome.com/e8a37b8c52.js" crossorigin="anonymous"></script>
</head>

<body>

    <div class="container">
        <div class="row">
            ${cardsHTML}
        </div>
    </div>

</body>

</html>`
}

function finished(team) {
    let sortedTeam = [];
    let htmlArray = [];
    // Sort team members into new array (Manager > Engineer > Intern)
    team.forEach(member => {
        console.log(member);
        if (member.getRole() === "Manager") sortedTeam.push(member);
    });
    team.forEach(member => {
        if (member.getRole() === "Engineer") sortedTeam.push(member);
    });
    team.forEach(member => {
        if (member.getRole() === "Intern") sortedTeam.push(member);
    });

    let cardsHTML = "";
    for (let i = 0; i < sortedTeam.length; i++) {
        const member = sortedTeam[i];
        switch (member.getRole()) {
            case "Engineer":
                cardsHTML += genEngineer(member);
                break;
            case "Manager":
                cardsHTML += genManager(member);
                break;
            case "Intern":
                cardsHTML += genIntern(member);
                break;
        }
    }

    let mainHTML = genMain(cardsHTML);
    saveHTML(mainHTML);

}

function saveHTML(html) {
    fs.writeFile("./output/team.html", html, function (err) {

        if (err) {
            return console.log(err);
        }

        console.log("Success!");

    });

}

beginQuestions("Add a team member?");

