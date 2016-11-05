
var nodemailer = require('nodemailer');
var uuid = require('node-uuid');
var fs = require('fs');

var credentials = require('../credentials.json').email;

module.exports = function(email, callback) {

  const uid = uuid.v4();

  var transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
            user: credentials.username, // Your email id
            pass: credentials.password // Your password
        }
    });

    var mailOptions = {
      from: credentials.email, // sender address
      to: email, // list of receivers
      subject: 'Email Example', // Subject line
      text: "http://localhost:8080/login/voter/" + uid//, // plaintext body
      // html: '<b>Hello world ✔</b>' // You can choose to send an HTML body instead
    };

    transporter.sendMail(mailOptions, function(error, info){
      if(error){
          console.log(error);
      }else{
          console.log('Message sent: ' + info.response);
          callback(uid);
      }
    });
};
