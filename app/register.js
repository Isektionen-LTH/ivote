var db = require('./db.js');
var mail = require('../app/mail.js');

module.exports = function(app) {

  app.get('/register/voter', function(req, res) {

    mail(req.query.email, function(uid) {
      db.registerUser(req.query.email, req.query.email, uid, function () {
          res.redirect('/register/done');
      });
    });
  });
}
