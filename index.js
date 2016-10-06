var express = require('express');
var bodyParser = require('body-parser');
var app = express();

var db = require('nedb');
codes = new db({ filename: 'data.db', autoload: true });
votes = new db({filename: 'votes.db', autoload: true});

/*or (var i = 0; i < 10; i++) {
  codes.insert({code: Math.floor((Math.random() * 500) + 100)}, function (err, docs) {
  });
}*/

app.use(require('cors')());

app.use(express.static('client'));
//app.use(express.json());

var validCodes = ['123', 'hej'];
var adminPassword = "hej123";

//Kontrollerar kod hos klienten mot databasen

app.use('/client', function(req, res, next) {

    codes.findOne({code:+req.query.id}, function (err, doc) {

      if(doc){
        next();
      }
      else {
        res.send("Du måste var inloggad");
      }
    });

});

//Kontrollerar admins lösenord

app.use('/admin', function(req, res, next) {

  if(req.query.pass == adminPassword){
    next();
  } else {
    res.send("Du måste var inloggad");
  }

});

app.get('/admin/votes', function (req, res, next) {

  votes.find({}, function (err, docs) {
    res.json(docs);
  });

});

//ADMIN FUNKTIONER

app.get('/admin/newvote', function (req, res, next) {

  votes.findOne({isActive:true}, function(err, doc) {
    if(!doc){
      if(req.query.title){

          vote = {
            title: req.query.title,
            options: [
              {
                title: "Kristoffer",
                numberOfVotes: 0
              },
              {
                title: "John",
                numberOfVotes: 0
              }
            ],
            hasVoted: [],
            multipleAnswers: false,
            isActive: true,
          };

          votes.insert(vote, function(err, docs) {
            if(!err) res.send("Vote accepted");
          });

      } else {
        res.send("Fel, saknar parametara");
      }
    } else {
      res.send("Det finns redan en aktiv omröstning");
    }
  });

});

app.get('/admin/exitcurrentvote', function(req, res, next) {

  votes.update({isActive: true}, {$set: {isActive: false}}, {}, function (err, numreplaced) {
    if(!err){
      res.send("Lyckades");
    } else {
      res.send("Misslyckades");
    }
  });

});

//CLIENT FUNKTIONER

app.get('/client/currentvote', function (req, res, next) {

  var currentVote = {
    title: 'Vice ordförande',
    options: [
      "Kristoffer",
      "John"
    ],
    allowMultipleChoices: false
  };

  votes.findOne({isActive: true}, function(err, doc) {
    if (doc) {

      for (var i = 0; i < doc.options.length; i++) {
        doc.options[i] = doc.options[i].title;
      }

      doc = {title: doc.title, options:doc.options};

      res.json(doc);
    } else {
      res.send("Det finns för närvarande ingen omröstning");
    }
  });

  //res.json(currentVote);

});

app.get('/client/vote', function(req, res, next) {

  votes.findOne({ $and: [{ hasVoted: req.query.id } , { isActive: true }] }, function(err, doc) {

    if(!doc){

      res.send(req.query.title);

      votes.findOne({isActive:true}, {options: 1}, function (err, doc) {

        var pos;

        for (var i = 0; i < doc.options.length; i++) {
          if(doc.options[i].title == req.query.title){
            pos = i;
          }
        }

        console.log(pos);

        votes.update({isActive:true}, {$inc: {options[0]: 1}}, function(err, numreplaced) {

        });

      });

      /*votes.update({isActive: true}, {$push: {hasVoted: req.query.id}}, {}, function() {

        res.send("Röst mottagen");
      });*/



    } else {
      res.send("Användare har redan röstat");
    }

  });
});

app.get('/results', function (req, res) {

  var currentVote = {
    title: 'Vice ordförande',
    winner: 'Kristoffer'
  };

  res.json(currentVote);

});

app.listen(8080, function () {
  console.log('Example app listening on port 3000!');
});
