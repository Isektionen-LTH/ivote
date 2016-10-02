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

codes.find({a:1}, function(err, docs) {
  console.log(docs);
});

app.use(require('cors')());

app.use(express.static('client'));
//app.use(express.json());

var validCodes = ['123', 'hej'];
var adminPassword = "hej123";

app.use('/client', function(req, res, next) {

    console.log(req.query.id);
    codes.findOne({code:+req.query.id}, function (err, doc) {
      console.log(doc);
      console.log(err);
      if(doc){
        next();
      }
      else {
        res.send("Du måste var inloggad");
      }
    });

});

app.use('/admin', function(req, res, next) {

  if(req.query.pass == adminPassword){
    next();
  } else {
    res.send("Du måste var inloggad");
  }

});

app.get('/admin/votes', function (req, res, next) {

  var votes = [{
    title: 'överphhös',
    result: 'Adhara'
  }, {
    title: 'Ordförande',
    result: null
  }];

  res.json(votes);

});

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

app.get('/results', function (req, res) {

  var currentVote = {
    title: 'Vice ordförande',
    winner: 'Kristoffer'
  };

  res.json(currentVote);

});

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
            hasVoted: null,
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

app.listen(8080, function () {
  console.log('Example app listening on port 3000!');
});
