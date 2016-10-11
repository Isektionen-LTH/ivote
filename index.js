var express = require('express');
var bodyParser = require('body-parser');
var MongoClient = require('mongodb').MongoClient;

var app = express();

var db;

app.listen(8080, function () {

  MongoClient.connect('mongodb://kristoffer:evote@ds035036.mlab.com:35036/ivote', function(err, database) {

    if(err) console.log(err);
    db = database;

  });

});

app.use(require('cors')());

app.use(express.static('client'));

var validCodes = ['123', 'hej'];
var adminPassword = "hej123";

//Kontrollerar kod hos klienten mot databasen

app.use('/client', function(req, res, next) {

    db.collection("codes").findOne({code:+req.query.id}, function (err, doc) {

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

//ADMIN FUNKTIONER

app.get('/admin/votes', function (req, res, next) {

  db.collection("votes").find({}).toArray(function (err, docs) {

    res.send(docs);

  });

});

app.get('/admin/newvote', function (req, res, next) {

  db.collection("votes").findOne({isActive:true}, function(err, doc) {
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

          db.collection("votes").insert(vote, function(err, docs) {
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

  db.collection("votes").update({isActive: true}, {$set: {isActive: false}}, {}, function (err, numreplaced) {
    if(!err){
      res.send("Lyckades");
    } else {
      res.send("Misslyckades");
    }
  });

});

//CLIENT FUNKTIONER

app.get('/client/currentvote', function (req, res, next) {

  db.collection("votes").findOne({isActive: true}, function(err, doc) {
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

  db.collection("votes").findOne({ $and: [{ hasVoted: req.query.id } , { isActive: true }] }, function(err, doc) {

    if(!doc){
      db.collection("votes").update({isActive: true, "options.title": req.query.title}, {$inc: {"options.$.numberOfVotes": 1}}, function(err, doc) {

        res.send("Tack för ding röst" + err + doc);

        db.collection("votes").update({isActive: true}, {$push: {hasVoted: req.query.id}}, {}, function() {

        });

      });

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
