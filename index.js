var express = require('express');
var bodyParser = require('body-parser');
var mongo = require('mongodb');
var MongoClient = mongo.MongoClient;
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);

var db;
var validCodes = ['123', 'hej'];
var adminPassword = "hej123";

app.get('/', function (req, res) {
  res.sendFile(__dirname + '/client/index.html');
});

app.use(express.static(__dirname));
app.use(require('cors')());

server.listen(8080, "0.0.0.0", function () {

  console.log("Lyssnar");

  MongoClient.connect('mongodb://kristoffer:evote@ds035036.mlab.com:35036/ivote', function(err, database) {

    if(err) console.log(err);
    db = database;

  });

});

app.get('/bundle.js', function (req, res) {
  res.sendFile(__dirname + '/client/bin/app.bundle.js');
});

//State: 1 = pågående röstning, 2 = röstning klar,

function setState(newState){

  console.log("function: setState");

  db.collection('state').update({}, {state: newState}, function(err, docs) {
    console.log("error: setState: " + err);
    io.emit('state', newState);
  });

}

function getHasVoted(id, callback) {

  db.collection("votes").findOne({ $and: [{ hasVoted: id } , { isActive: true }] }, function(err, doc) {

      callback(doc !== null);
  });
}

function getCurrentVote(callback){

  db.collection("votes").findOne({isActive: true}, function(err, doc) {
    if (doc) {

      for (var i = 0; i < doc.options.length; i++) {
        doc.options[i] = doc.options[i].title;
      }

      doc = {state: 'voting', title: doc.title, options:doc.options};
      callback(doc);
      //Multiple options
    } else {
    }
  });

}

function addNewVote(vote, callback){

  console.log(vote);
  if(vote.title !== null && vote.options !== null && vote.multipleAnswers !== null){
    vote.isActive = null;
    vote.hasVoted = [];
    db.collection("votes").insert(vote, function(err){
      console.log("vote inserted");
      callback(null);
    });
  } else {
    callback({error: "Missing input"});
  }

}

function editVote(editedVote, callback){
  //Går endast att ändra om röstning ej skett, dvs isActive == null
  db.collection("votes").replaceOne({$and: [{_id: editedVote._id}, {isActive: null}]}, editedVote, function(err, doc) {
    console.log(err + " Insatt");
    callback();
  });

}

function endCurrentVote(){

  console.log("function: endCurrentVote");
  db.collection("votes").update({isActive: true}, {$set: {isActive: false}}, {}, function (err, numreplaced) {
    console.log("function: error: " + err);
    if(numreplaced.nModified > 0) setState(0);
  });

}

function startVote(voteId){

  db.collection("votes").update({$and: [{isActive: null}, {_id: mongo.ObjectId(voteId)}]}, {$set: {isActive: true}}, function(err, doc) {
    if(doc) setState(1);
  });

}

function getVotingStatus(callback){
  db.collection('votes').findOne({isActive: true}, function(err, doc) {
<<<<<<< Updated upstream
    callback({voted: doc.hasVoted.length, total: 55});
=======
    callback({state: 'voted', numberOfVotes: doc.hasVoted.length, numberOfUsers: 55});
>>>>>>> Stashed changes
  });
}

function vote(userID, option){
        console.log(userID);

  db.collection("votes").findOne({ $and: [{ hasVoted: userID } , { isActive: true }] }, function(err, doc) {

    if(!doc){
      db.collection("votes").findAndModify({isActive: true, "options.title": option},[['_id',1]], {$inc: {"options.$.numberOfVotes": 1}}, {new:true}, function(err, doc) {
        getVotingStatus(function(voteStatus) {
          io.to('has voted').emit('new vote', voteStatus);
        });
        console.log(doc)
        //console.log("Tack för din röst. Error: " + err + " doc: "+ doc);
        db.collection("votes").update({isActive: true}, {$push: {hasVoted: userID}}, {}, function() {

        });

      });
    } else {
      console.log("Användaren har redan röstat");
    }
  });
}

function numberOfUsers(callback){
  callback(1);
}

//app.use(express.static('/'));

io.on('connection', function (socket) {

  /*
  Rum
  Rösta
  */

  socket.on('join vote', function(userID){

    socket.userID = userID.id;
    socket.join('vote');

    getHasVoted(userID.id, function(hasVoted) {
      console.log(hasVoted);
      if(hasVoted){
        socket.join("hasVoted");
        //socket.emit('state', {state: 'voted'});
        getVotingStatus(function(voteStatus) {
          socket.emit('numberOfVotes', voteStatus);
        });
      } else {
        db.collection('state').find({}).toArray(function(err, doc) {
          console.log(doc);
          //socket.emit('state', doc[0]);

          if(doc[0].state === 0){
            socket.emit('state', {state: 'waiting'});
          } else {
            getCurrentVote(function(doc) {
              socket.emit('state', doc);
            });
          }

        });
      }
    });

  });

  socket.on('getID', function() {
    io.emit('state', socket.userID);
  });

  socket.on('startVote', function(adminPass, voteId){
    console.log("hej");
    startVote("5819a59bd641a035ef7a3a0d");
  });

  socket.on('endCurrentVote', function(adminPass){
    endCurrentVote();
  });

  socket.on('newVote', function(vote){
    addNewVote(vote, function(err) {
      console.log(err);
      socket.emit('state', "Mottaget");
    });
  });

  socket.on('getCurrentVote', function(userId){

    getCurrentVote(function(vote) {
        socket.emit("state", vote);
    });

  });

  socket.on('vote', function(option){
    socket.join('hasVoted');
    vote(socket.userID, option);
    //socket.emit('state', {state: 'voted'});
  });

});

app.get('/Hej', function (req, res) {

  /*io.emit('state', {state:2});
  res.send("skickat");*/
  //startVote("57fbdd7c0f46f92ade412dd4");
  io.
  res.send("Skickat");

});

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

//CLIENT FUNKTIONER

app.get('/client/currentvote', function (req, res, next) {

  getHasVoted(id, function(hasVoted) {

    if(hasVoted){

      db.collection("votes").findOne({isActive: true}, function(err, doc) {
        if (doc) {

          for (var i = 0; i < doc.options.length; i++) {
            doc.options[i] = doc.options[i].title;
          }

          doc = {title: doc.title, options:doc.options};

          //Multiple options

          res.json(doc);
        } else {
          res.send("Det finns för närvarande ingen omröstning");
        }
      });

    } else {

      res.send(" ");

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

app.get('*', function (req, res) {
  res.sendFile(__dirname + '/client/index.html');
});
