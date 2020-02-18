const inquirer = require('inquirer');
const fs = require('fs');
const Employee = require('./lib/Employee');
const Engineer = require('./lib/Engineer');
const Intern = require('./lib/Intern');
const Manager = require('./lib/Manager');


// ---Global Variables----

// Team Array
let team = [];

// Track wether a manager already exists
let managerExists = false;

// Fresh member object for tracking user's input of team member
let fresh = {};



// ----Functions----

// Main prompt function
function beginQuestions(firstQuestion) {
    // Ask first question
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
            // If user answers no
            if (!answers.continueEntering) {
                // execute finished team (generates html)
                finished(team);
                // If yes, continue prompt to get information regarding new member
            } else {
                // Get member's role
                inquirer
                    .prompt([
                        {
                            type: "list",
                            name: "memberRole",
                            message: "Select role",
                            // Use global boolean to determine choices
                            choices: (managerExists) ? ["Engineer", "Intern"] : ["Manager"]
                        }
                    ])
                    .then(answers => {
                        // If user did not select manager or manager does not exist already
                        if (answers.memberRole != "Manager" || !managerExists) {
                            // Store role in fresh object property
                            fresh.role = answers.memberRole;
                            // Indicate manager exists if member's role is manager
                            if (answers.memberRole === "Manager") managerExists = true;
                            // Continue asking questions regarding member
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
                                    // Store answers in fresh object properties
                                    fresh.name = answers.memberName;
                                    fresh.id = answers.memberId;
                                    fresh.email = answers.memberEmail;

                                    let uniqueQuestion;

                                    // Set unique question object based on current member's role
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
                                        // Ask the unique question
                                        .prompt(uniqueQuestion)
                                        .then(answers => {
                                            // Store in fresh object property
                                            fresh.unique = answers.uniqueInfo;
                                            // Create new employee from fresh object properties based on member's role
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
                                            // Add the new member to the team array
                                            team.push(newMember);
                                            // Repeat this function from the beginning
                                            beginQuestions("Add another team member?");
                                        });
                                });
                        } else { // if the user selected manager role and a manager already exists
                            beginQuestions("Error: This team already has a manager! Would you like to continue adding members?");
                        }
                    });
            }
        });
}

// Function to generate html code for an engineer
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

// Function to genreate html code for a manager
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

// Function to genreate html code for an intern
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

// Function to generate complete html code to be written to './output/team.html'
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

// Function to be executed once user is finished entering team members should stop asking questions and generate team.html to display all user's inputted team members
function finished(team) {
    let sortedTeam = [];
    // Sort team members into new array (Manager > Engineer > Intern)
    // Push each manager to team array
    team.forEach(member => {
        console.log(member);
        if (member.getRole() === "Manager") sortedTeam.push(member);
    });
    // Push each engineer to team array
    team.forEach(member => {
        if (member.getRole() === "Engineer") sortedTeam.push(member);
    });
    // Push each intern to team array
    team.forEach(member => {
        if (member.getRole() === "Intern") sortedTeam.push(member);
    });

    // Concatinate each member's html code and store in variable
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

    // Generate final html code and store in variable
    let mainHTML = genMain(cardsHTML);
    // Write html code string to file
    saveHTML(mainHTML);

}

// Function to write given string to ./output/team.html
function saveHTML(html) {
    fs.writeFile("./output/team.html", html, function (err) {
        if (err) {
            return console.log(err);
        }
        console.log("Success!");
    });
}



// First function execution
beginQuestions("Add a team member?");