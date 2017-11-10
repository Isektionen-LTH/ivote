module.exports = [
  {
    type: 'input',
    name: 'dbUrl',
    message: 'Url to database',
    default: 'mongodb://db'
  },
  {
    type: 'input',
    name: 'url',
    message: 'Url of website for email',
    default: 'ivote.isek.se'
  },
  {
    type: 'input',
    name: 'adminUsername',
    message: 'Admin username',
    default: 'admin'
  },
  {
    type: 'password',
    name: 'adminPassword',
    message: 'Admin password',
    default: 'admin123'
  },
  {
    type: 'input',
    name: 'registerUsername',
    message: 'Register username',
    default: 'register'
  },
  {
    type: 'password',
    name: 'registerPassword',
    message: 'Register password',
    default: 'register123'
  },
  {
    type: 'input',
    name: 'emailUsername',
    message: 'Email username',
    validate: x => !!x
  },
  {
    type: 'password',
    name: 'emailPassword',
    message: 'Email password',
    validate: x => !!x
  }
];