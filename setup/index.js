const inquirer = require('inquirer');
const fs = require('fs');

const questions = require('./questions');

inquirer.prompt(questions).then((answers) => {
  const {
    adminUsername,
    adminPassword,
    registerUsername,
    registerPassword,
    emailUsername,
    emailPassword,
    dbUrl,
    url
  } = answers;

  const credentials = {
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
  const config = { dbUrl, url };

  fs.writeFileSync('../credentials.json', JSON.stringify(credentials, null, '\t'));
  fs.writeFileSync('../config.json', JSON.stringify(config, null, '\t'));
});