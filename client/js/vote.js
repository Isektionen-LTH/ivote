angular.module('app')
.component('vote', {
  templateUrl: 'templates/vote.html',
  controller: VoteController,
  bindings: {
    currentVote: '<'
  }
});

function VoteController(api) {
  var $ctrl = this;

  $ctrl.title = $ctrl.currentVote.title;
  $ctrl.hasVoted = $ctrl.currentVote.hasVoted;

  if (!$ctrl.hasVoted) {
    $ctrl.multipleChoise = $ctrl.currentVote.multipleChoise;

    $ctrl.options = $ctrl.currentVote.options.map(function(option) {
      return { name: option, selected: false };
    });
  }

  $ctrl.hasSelectedVote = function() {
    if ($ctrl.multipleChoise) {
      return $ctrl.options.filter(function(option) {
        return option.selected;
      }).length > 0;
    } else {
      return $ctrl.selected;
    }
  };

  $ctrl.submitVote = function() {
    if ($ctrl.multipleChoise) {
      var options = $ctrl.options.filter(function(option) {
        return option.selected;
      }).map(function(option) {
        return option.name;
      });
      api.submitVotes(options);
    } else {
      api.submitVote($ctrl.selected);
    }
  };
}
