angular.module('app')
.value('apiUrl', 'http://10.3.5.240:8088')
.service('api', function($http, $q, apiUrl) {
  this.getCurrentVote = function() {
    // return $http({
    //   method: 'GET',
    //   url: apiUrl + '/client/currentvote',
    //   params: {
    //     id: 406
    //   }
    // }).then(function(result) {
    //   return result.data;
    // }, function() {
      return $q.when({
        title: 'Överphös' ,
        options: ['Adhara', 'Bracco'],
        hasVoted: false,
        multipleChoise: false
      });
    // });
  };

  this.submitVote = function(option) {
    console.log('You voted', option)
  };

  this.submitVotes = function(options) {
    console.log('You voted', options.join(','))
  };
});
