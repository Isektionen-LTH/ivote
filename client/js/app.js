angular.module('app', ['ui.router'])
.config(function($stateProvider) {
  $stateProvider.state('vote', {
    url: '/vote',
    resolve: {
      currentVote: function(api) {
        return api.getCurrentVote();
      }
    },
    controller: function(currentVote) {
      this.currentVote = currentVote;
    },
    controllerAs: '$ctrl',
    template: '<vote current-vote="$ctrl.currentVote"></vote>',
  });
});
