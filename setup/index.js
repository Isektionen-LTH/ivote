var inquirer = require('inquirer');
var fs = require('fs');

var questions = require('./questions');

inquirer.prompt(questions).then(function (answers) {
  var adminUsername = answers.adminUsername,
      adminPassword = answers.adminPassword,
      registerUsername = answers.registerUsername,
      registerPassword = answers.registerPassword,
      emailUsername = answers.emailUsername,
      emailPassword = answers.emailPassword,
      dbUrl = answers.dbUrl,
      url = answers.url;


  var credentials = {
    admin: {
      username: adminUsername,
      password: adminPassword
    },
    register: {
      username: registerUsername,
      password: registerPassword
    },
    email: {
      username: emailUsername,
      password: emailPassword
    }
  };
  var config = { dbUrl: dbUrl, url: url };

  fs.writeFileSync('../credentials.json', JSON.stringify(credentials, null, '\t'));
  fs.writeFileSync('../config.json', JSON.stringify(config, null, '\t'));

  console.log('Successfully set up!');
});