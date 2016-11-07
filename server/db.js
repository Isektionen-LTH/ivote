var mongo = require('mongodb')
const config = require('../config.json');
console.log(config.dbUrl);
var db;

mongo.MongoClient.connect(config.dbUrl, function(err, database) {
  db = database;
});

exports.getCurrentVote = function(callback){

  db.collection('votes').findOne({isActive: true}, function(err, doc) {
    if (doc) {

      for (var i = 0; i < doc.options.length; i++) {
        doc.options[i] = doc.options[i].title;
      }

      doc = {state: 'voting', title: doc.title, options:doc.options};
      callback(doc);
    }
  });

};

exports.getVoteResults = function(callback){
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
};

exports.getVotesAdmin = function(callback){
  db.collection('votes').find({}).toArray(function (err, docs) {
    var votes = docs.map(function(vote){
      return { title: vote.title,
        id: vote._id,
        options: vote.options.map(function(option) {
          return option.title;
        }),
        status: vote.isActive === null ? 'waiting' : vote.isActive ? 'ongoing' : 'completed',
        statusOrd: vote.isActive === null ? 1 : vote.isActive ? 0 : 2,
        resultOrd: vote.resultOrd};
      }).sort(function(a, b){
        if (a.statusOrd === b.statusOrd){
          return - a.resultOrd + b.resultOrd;
        } else {
          return a.statusOrd - b.statusOrd;
        }
      });

      callback(votes);

    });
};

exports.setState = function(newState, callback) {
  db.collection('state').update({}, {state: newState}, function(err, docs) {
    callback();
  });
}

exports.startVote = function(id, callback){
  db.collection('votes').find({isActive: false}, function(err, votes) {

    votes.toArray(function(err, votesArray) {

      db.collection('votes').update({$and: [{isActive: null}, {_id: mongo.ObjectId(id)}]}, {$set: {isActive: true, resultOrd: votesArray.length}}, function(err, doc) {
        callback(doc);
      });

    });

  });
}

exports.cancelCurrnetVote = function(callback){
  db.collection('votes').update({isActive: true}, {$set: {isActive: false}}, {}, function (err, numreplaced) {
      callback();
  });
}

exports.deleteVote = function(id, callback) {

  db.collection('votes').deleteOne({$and: [{_id: mongo.ObjectId(id)}, {isActive: null}]}, function (err, doc){
    callback();
  });

}

exports.newVote = function(title, options, callback) {

  var vote = {};

  if(typeof title !== 'undefined' && typeof options !== 'undefined'){

    db.collection('votes').count(function(err, count) {

      vote.isActive = null;
      vote.hasVoted = [];
      vote.resultOrd = count;
      vote.title = title;

      vote.options = options.map(function(title) {
        return {title: title, numberOfVotes: 0};
      });

      db.collection('votes').insert(vote, function(err){
        callback();
      });

    });

  }
}

exports.updateVote = function(id, title, options, callback){
  db.collection('votes').update({$and: [{_id: mongo.ObjectId(id)}, {isActive: null}]}, {$set: {title: title, options: options.map(function(option) {
    return {title: option, numberOfVotes: 0};
  })}}, function(err, doc) {
    callback();
  });
};

exports.getHasVoted = function(id, callback){

  db.collection('votes').findOne({ $and: [{ hasVoted: id } , { isActive: true }] }, function(err, doc) {
      callback(doc !== null);
  });

};

exports.getVotingStatus = function(callback){
  db.collection('votes').findOne({isActive: true}, function(err, doc) {
    db.collection('codes').count(function(err, count) {
      callback({voted: doc.hasVoted.length, total: count});
    });
  });
}

exports.userVote = function(userID, option, callback) {
  db.collection('votes').findOne({ $and: [{ hasVoted: userID } , { isActive: true }] }, function(err, doc) {
      if(!doc){
        db.collection('votes').findAndModify({isActive: true, 'options.title': option},[['_id',1]], {$inc: {'options.$.numberOfVotes': 1}}, {new:true}, function(err, doc) {
          db.collection('votes').update({isActive: true}, {$push: {hasVoted: userID}}, {}, function() {
            callback(true);
          });
        });
      } else {
        callback(false);
      }
    });
}

exports.validateUser = function(userID, callback){

  db.collection('codes').findOne({id: userID}, function(err, doc) {
    callback(!!doc);
  });

}

exports.getState = function(callback) {
  db.collection('state').find({}).toArray(function(err, doc) {
    callback(doc[0]);
  });
}

exports.registerUser = function(name, email, uid, callback) {
  db.collection('codes').insert({name: +name, email: email, id: uid}, function(err){
    callback();
  });
}



exports.getUsers = function(callback) {
  db.collection('codes').find({}).toArray(function (err, docs) {
    callback(docs.map(function(doc) {
      return {
        name: doc.name,
        id: doc._id
      }
    }));
  });
};

exports.deleteUser = function(userID, callback) {
  db.collection('codes').deleteOne({$and: [{_id: mongo.ObjectId(userID)}]}, function (err, doc) {
    callback();
  });
}
