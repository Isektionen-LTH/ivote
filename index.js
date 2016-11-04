var express = require('express');
var bodyParser = require('body-parser');
var mongo = require('mongodb');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var mail = require('./app/mail.js');
var db;
var validCodes = ['123', 'hej'];
var adminPassword = 'hej123';
var cookieParser = require('cookie-parser');
var login = require('login');

var MongoClient = mongo.MongoClient;

//var router = express.Router();

app.get('/', function (req, res) {
  res.sendFile(__dirname + '/client/index.html');
});

app.use(express.static(__dirname));
app.use(require('cors')());
app.use(bodyParser.json());
app.use(cookieParser());

app.use(login.auth);
app.use('/login', login.router);

server.listen(8080, '0.0.0.0', function () {

  //mail("kristoffder.ipod@gmaasdadil.com");
  console.log('Lyssnar');

  MongoClient.connect('mongodb://kristoffer:evote@ds035036.mlab.com:35036/ivote', function(err, database) {

    if(err) console.log(err);
    db = database;

  });

});

app.get('/bundle.js', function (req, res) {
  res.sendFile(__dirname + '/client/bin/app.bundle.js');
});
app.get('/app.bundle.js.map', function (req, res) {
  res.sendFile(__dirname + '/client/bin/app.bundle.js.map');
});

//State: 1 = pågående röstning, 0 = waiting,

function setState(newState){

  console.log('function: setState');

  db.collection('state').update({}, {state: newState}, function(err, docs) {
    console.log('error: setState: ' + err);

    if(newState === 0){
      io.to('vote').emit('state', {state: 'waiting'});
    } else {
      getCurrentVote(function(doc) {
        io.to('vote').emit('state', doc);
      });
    }
  });

}

function getHasVoted(id, callback) {

  db.collection('votes').findOne({ $and: [{ hasVoted: id } , { isActive: true }] }, function(err, doc) {

      callback(doc !== null);
  });
}

function getCurrentVote(callback){

  db.collection('votes').findOne({isActive: true}, function(err, doc) {
    if (doc) {

      for (var i = 0; i < doc.options.length; i++) {
        doc.options[i] = doc.options[i].title;
      }

      doc = {state: 'voting', title: doc.title, options:doc.options};
      callback(doc);
      //Multiple options
    }
  });

}

function getVotingStatus(callback){
  db.collection('votes').findOne({isActive: true}, function(err, doc) {
    callback({voted: doc.hasVoted.length, total: 55});
  });
}

function vote(userID, option, callback){
        console.log(userID);

  db.collection('votes').findOne({ $and: [{ hasVoted: userID } , { isActive: true }] }, function(err, doc) {

    if(!doc){
      db.collection('votes').findAndModify({isActive: true, 'options.title': option},[['_id',1]], {$inc: {'options.$.numberOfVotes': 1}}, {new:true}, function(err, doc) {

        db.collection('votes').update({isActive: true}, {$push: {hasVoted: userID}}, {}, function() {

          getVotingStatus(function(voteStatus) {
            io.to('hasVoted').emit('new vote', voteStatus);
            callback();
          });

        });
        //console.log('Tack för din röst. Error: ' + err + ' doc: '+ doc);


      });
    } else {
      console.log('Användaren har redan röstat');
    }
  });
}

function numberOfUsers(callback){
  callback(1);
}

function getVoteResults(callback){
  db.collection('votes').find({isActive: false}, function(err, docs){
    docs.toArray(function(err, doc) {
      var resultArray = [];
      for (var i = 0; i < doc.length; i++) {
        var options = doc[i].options.sort(function(a, b) {
          return b.numberOfVotes - a.numberOfVotes;
        });
        resultArray.push({id: i, title: doc[i].title, options: options, resultOrd: doc[i].resultOrd});
      }
      resultArray.sort(function(a, b){
        return b.resultOrd - a.resultOrd;
      });
      callback(resultArray);

    });
  });
}

function returnVotesAdmin(res){

  db.collection('votes').find({}).toArray(function (err, docs) {
    var votes = docs.map(function(vote) {
      return {
        title: vote.title,
        id: vote._id,
        options: vote.options.map(function(option) {
          return option.title;
        }),
        status: vote.isActive === null ? 'waiting' : vote.isActive ? 'ongoing' : 'completed',
        statusOrd: vote.isActive === null ? 1 : vote.isActive ? 0 : 2
      }

    }).sort(function(a, b){

      return a.statusOrd - b.statusOrd;

    });
    res.send(votes);

  });
}

function validateUser(userID, callback){

  db.collection('codes').findOne({code: userID}, function(err, doc) {
    if(doc){
      callback(true);
    } else {
      callback(false);
    }
  });

}

//app.use(express.static('/'));

io.on('connection', function (socket) {

  socket.on('join results', function() {
    socket.join('resultRoom');
    getVoteResults(function(results) {
      socket.emit('new results', results);
    });

  });

  /*
  Rum
  Rösta
  */

  socket.on('join vote', function(userID){

    socket.userID = userID.id;
    console.log(userID);

    validateUser(userID.id, function(userIsValid){

      socket.valid = userIsValid;
      console.log('User status: ' + userIsValid);

      if(userIsValid){
        socket.join('vote');

        getHasVoted(userID.id, function(hasVoted) {

          console.log(hasVoted);

          if(hasVoted){
            socket.join('hasVoted');
            //socket.emit('state', {state: 'voted'});
            getVotingStatus(function(voteStatus) {
              socket.emit('state', {state: 'voted', voted: voteStatus.voted, total: voteStatus.total});
              // socket.emit('new vote', voteStatus);
            });
          } else {
            db.collection('state').find({}).toArray(function(err, doc) {
              console.log(doc);
              //socket.emit('state', doc[0]);

              if(doc[0].state === 0){
                socket.emit('state', {state: 'waiting'});
              } else {
                getCurrentVote(function(doc) {
                  console.log(doc);
                  socket.emit('state', doc);
                });
              }

            });
          }
        });
      } else {
        socket.emit('state', {state: 'wrong id'});
      }

    });

  });

  socket.on('getCurrentVote', function(userId){

    getCurrentVote(function(vote) {
        socket.emit('state', vote);
    });

  });

  socket.on('vote', function(option){
    if (socket.valid) {
      vote(socket.userID, option, function(){

        getVotingStatus(function(msg) {
          msg.state = 'voted';
          socket.emit('state', msg);
          socket.join('hasVoted');
        });

      });
    }
  });
});

app.get('/Hej', function (req, res) {

  mail();
  res.send("hej")
});


//Kontrollerar kod hos klienten mot databasen

app.use('/client', function(req, res, next) {

    db.collection('codes').findOne({code:+req.query.id}, function (err, doc) {

      if(doc){
        next();
      }
      else {
        res.send('Du måste var inloggad');
      }
    });

});

//Kontrollerar admins lösenord

app.use('/admin', function(req, res, next) {

  if(true){
    next();
  } else {
    res.send('Du måste var inloggad');
  }

});

//ADMIN FUNKTIONER

app.get('/admin/votes', function (req, res, next) {

  returnVotesAdmin(res);

});

app.post('/admin/vote/new', function (req, res, next) {

  console.log(req.body);

  var vote = {};

  if(typeof req.body.title !== 'undefined' && typeof req.body.options !== 'undefined'){

    vote.isActive = null;
    vote.hasVoted = [];
    vote.resultOrd = null;
    vote.title = req.body.title;

    vote.options = req.body.options.map(function(title) {
      return {title: title, numberOfVotes: 0};
    });

    db.collection('votes').insert(vote, function(err){
      console.log('vote inserted');
      returnVotesAdmin(res);
    });
  } else {
    returnVotesAdmin(res);
  }

});

app.put('/admin/vote/:id', function(req, res) {
  //Går endast att ändra om röstning ej skett, dvs isActive == null
  db.collection('votes').update({$and: [{_id: mongo.ObjectId(req.body.id)}, {isActive: null}]}, {$set: {title: req.body.title, options: req.body.options.map(function(option) {
    return {title: option, numberOfVotes: 0};
  })}}, function(err, doc) {
    console.log(err + ' Insatt');
    returnVotesAdmin(res);

  });

});

app.delete('/admin/vote/:id', function(req, res) {

  db.collection('votes').deleteOne({$and: [{_id: mongo.ObjectId(req.params.id)}, {isActive: null}]}, function (err, doc) {

    returnVotesAdmin(res);
  });

});

app.post('/admin/vote/cancelcurrent', function(req, res) {
  console.log('function: endCurrentVote');
  db.collection('votes').update({isActive: true}, {$set: {isActive: false}}, {}, function (err, numreplaced) {

    console.log('function: error: ' + err);

    returnVotesAdmin(res);
    getVoteResults(function(results){
      io.to('resultRoom').emit('new results', results);
      setState(0);
    });

  });
});

app.post('/admin/vote/:id/start', function(req, res) {

  db.collection('votes').find({isActive: false}, function(err, votes) {

    votes.toArray(function(err, votesArray) {

      db.collection('votes').update({$and: [{isActive: null}, {_id: mongo.ObjectId(req.params.id)}]}, {$set: {isActive: true, resultOrd: votesArray.length}}, function(err, doc) {

        if(doc) setState(1);
        returnVotesAdmin(res);

      });

    });

  });

});

app.post('/register/user', function(req, res) {

  email(req.body.email, function(uid) {
    db.collection('codes').insert({name: req.body.name, email: req.body.email, id: uid}, function(err) {

    });
  });

});

app.get('/login/voter/:id', function(req, res){
  validateUser(req.params.id, function(valid){
    if(valid){
      res.cookie('ivote', req.params.id).send('Cookie is sent');
      res.sendFile(__dirname + '/client/index.html');
    } else {
      res.send('fel lösenord');
    }
  });
});

app.get('*', function (req, res) {
  res.sendFile(__dirname + '/client/index.html');
});
