var db = require('./db.js');
var _io;

function returnVotesAdmin(res){
    db.getVotesAdmin(function(votes){
      res.send(votes);
    });
}

function setState(newState){

  db.setState(newState, function(err, docs) {

    if(newState === 0){
      //FIXA IO
      _io.to('vote').emit('state', {state: 'waiting'});
    } else {
      db.getCurrentVote(function(doc) {
        //FIXA IO
        _io.to('vote').emit('state', doc);
      });
    }
  });

}

module.exports = function(app, io){

  _io = io;

  app.get('/admin/votes', function (req, res, next) {
    returnVotesAdmin(res);
  });

  app.get('/admin/userlist', function (req, res, next) {
    db.getUsers(function(users) {
      res.send(users);
    })
  });

  app.post('/admin/vote/new', function (req, res, next) {

    db.newVote(req.body.title, req.body.options, req.body.numberOfChoices, function() {
      returnVotesAdmin(res);
    });

  });

  app.put('/admin/vote/:id', function(req, res) {

    db.updateVote(req.body.id, req.body.title, req.body.options, req.body.numberOfChoices, function() {
      returnVotesAdmin(res);
    });

  });

  app.delete('/admin/vote/:id', function(req, res) {

    db.deleteVote(req.params.id, function(){
      returnVotesAdmin(res);
    });
  });

  app.delete('/admin/user/:id', function(req, res) {
    db.deleteUser(req.params.id, function () {
      db.getUsers(function(users) {
        res.send(users);
      });
    });
  });

  app.post('/admin/vote/cancelcurrent', function(req, res) {

    db.cancelCurrnetVote(function(){

      returnVotesAdmin(res);

      db.getVoteResults(function(results){
        //FIXA IO
        io.to('resultRoom').emit('new results', results);
        setState(0);
      });

    });
  });

  app.post('/admin/vote/:id/start', function(req, res) {

    db.startVote(req.params.id, function(doc) {
      if(doc) setState(1);
      returnVotesAdmin(res);
    });
  });

}
