
var nodemailer = require('nodemailer');
var uuid = require('node-uuid');
var fs = require('fs');

var password = fs.readFileSync('./mail-password.txt');

module.exports = function(email) {
  var transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
            user: 'kristoffer.nordstrom@isek.se', // Your email id
            pass: password // Your password
        }
    });

    var mailOptions = {
      from: 'kristoffer.nordstrom@isek.se', // sender address
      to: email, // list of receivers
      subject: 'Email Example', // Subject line
      text: "http://localhost:8080/login/" + uuid.v4() //, // plaintext body
      // html: '<b>Hello world ✔</b>' // You can choose to send an HTML body instead
    };

    transporter.sendMail(mailOptions, function(error, info){
      if(error){
          console.log(error);
      }else{
          console.log('Message sent: ' + info.response);
      }
    });
};
