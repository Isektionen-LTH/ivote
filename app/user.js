var db = require('./db.js');
var _io;

module.exports = function(io) {
  _io = io;
  _io.on('connection', function (socket) {

    socket.on('join results', function() {
      socket.join('resultRoom');
      db.getVoteResults(function(results) {
        socket.emit('new results', results);
      });

    });

    socket.on('join vote', function(userID){

      socket.userID = userID.id;
      console.log(userID);

      db.validateUser(userID.id, function(userIsValid){

        socket.valid = userIsValid;
        console.log('User status: ' + userIsValid);

        if(userIsValid){
          socket.join('vote');

          db.getHasVoted(userID.id, function(hasVoted) {

            console.log(hasVoted);

            if(hasVoted){
              socket.join('hasVoted');

              db.getVotingStatus(function(voteStatus) {
                socket.emit('state', {state: 'voted', voted: voteStatus.voted, total: voteStatus.total});
              });
            } else {
              db.getState(function(state){

                if(state === 0){
                  socket.emit('state', {state: 'waiting'});
                } else {

                  db.getCurrentVote(function(doc) {
                    console.log(doc);
                    socket.emit('state', doc);
                  });
                }
              });
            }
          });
        } else {
          socket.emit('state', { state: 'no id' });
        }

      });

    });

    socket.on('getCurrentVote', function(userId){

      db.getCurrentVote(function(vote) {
          socket.emit('state', vote);
      });

    });

    socket.on('vote', function(option){
      if (socket.valid) {
        vote(socket.userID, option, function(){

          db.getVotingStatus(function(msg) {
            msg.state = 'voted';
            socket.emit('state', msg);
            socket.join('hasVoted');
          });

        });
      }
    });
  });
}

function vote(userID, option, callback){

  db.userVote(userID, option, function(succeded) {

    if(succeded){
      db.getVotingStatus(function(voteStatus) {
        _io.to('hasVoted').emit('new vote', voteStatus);
        callback();
      });
    } else {
      console.log('Användaren har redan röstat');
    }

  });
}
