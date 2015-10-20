angular.module('ebi.controllers')
.controller('TutorialCtrl', function($scope, $rootScope, $stateParams, $location, $ionicPopup, $ionicSlideBoxDelegate, Questions, Preferences) {

  // HELPER Methods
  $scope.randomNumber = function(){
    return Math.floor((Math.random() * $scope.questions.length));
  };

  $scope.shuffleArray = function(array) {
    for (var i = array.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
    return array;
  };

  $scope.notTutorial = function() {
    return Preferences.playType() != 'tut';
  };

  $scope.resetToTutorial = function(){
    $scope.pretest = false;
    $scope.trainingRound = 0;
    $scope.testRound = 0;
    $scope.playState = 'Training';
    $scope.correctAnswers = 0;
    $scope.testAnswered = 0;
    $scope.randomAnswers = $scope.shuffleArray(['a','b']);
    $scope.programComplete = false;
    $scope.questions = Questions.tutorialTraining(0);
    if($scope.questions){
      for(var i=0;i<$scope.questions.length;i++){
        $scope.questions[i].answered = null;
      }
    }
    $ionicSlideBoxDelegate.slide(0);
    $ionicSlideBoxDelegate.update();
  };

  // text for game header
  $scope.roundDisplay = function(){
    var round = ($scope.playState == 'Training') ? $scope.trainingRound : $scope.testRound;
    return $scope.playState.toUpperCase() + ' ' + (round + 1);
  };

  // exit game
  $scope.backToHome = function() {
    var confirmPopup = $ionicPopup.confirm({
      title: 'Back to Home',
      template: "<center> Are you sure you want to exit the program? </center>"
    }).then(function(res) {
      if(res) {
        Preferences.playType('acq');
        $scope.resetToTutorial();
        $ionicSlideBoxDelegate.slide(0,10);
        $location.path('tab.dash');
      }
    });
  };

  $scope.pickAnswer = function(question,ans){
    if($scope.playState == 'Training'){
      $scope.pickTrainingAnswer(question,ans);
    } else {
      $scope.pickTestAnswer(question,ans);
    }
  };

  $scope.pickNextTrainingQuestion = function(question){
    return (question.id == 0)? 1 : 0;
  };

  $scope.pickNextTestQuestion = function(question){
    while(true){
      var newQuestion = $scope.randomNumber();
      if (($scope.questions[newQuestion].answered == 2) || ($scope.questions[newQuestion].id == question.id) ){
        continue;
      } else {
        return newQuestion;
      }
    }
  };

  $scope.maxAnswerCount = function(){
    if(Preferences.playType() == 'tut'){
      if($scope.playState == 'Training'){
        return 12;
      } else {
        return 16;
      }
    }
  };

  $scope.stateAnswerCount = function() {
    if($scope.playState == 'Training'){
      return $scope.correctAnswers;
    } else {
      return $scope.testAnswered;
    }
  };

  $scope.neededAnswerCount = function(){
    if($scope.playState == 'Training'){
      return 11;
    } else {
      return 14;
    }
  };

  $scope.nextPlayState = function(){
    if($scope.playState == 'Training'){
      if($scope.trainingRound == 0){
        $scope.trainingRound = 1;
        $scope.questions = Questions.tutorialTraining(1);
      } else if ($scope.trainingRound == 1){
        $scope.testRound = 0;
        $scope.playState = 'Test';
        $scope.questions = Questions.tutorialTesting();
      }
    } else {
      $scope.programComplete = true;
    }

    if($scope.programComplete){
      var completePopup = $ionicPopup.alert({
        template: "<center><h3>Congratulations! <br> You have completed the tutorial.</h3></center>",
        buttons: [
          {
            type:'button-positive',
            text:'Back to Home',
            onTap: function(){
              $scope.resetToTutorial();
              Preferences.playType('acq');
              $location.path('tab.dash');
            }
          }
        ]
      });
    } else {
      $scope.correctAnswers = 0;
      $scope.testAnswered = 0;
      var nextStatePopup = $ionicPopup.alert({
        template: "<center><h3>Great! Tap OK to start the next " + $scope.playState + " round.</h3></center>"
      });

      $rootScope.getSlideDelegate('play-slide').update();
    }
  }

  $scope.processFailedState = function(){
    for(var i=0;i<$scope.questions.length;i++){
      $scope.questions[i].answered = null;
    };

    if($scope.playState == 'Test'){
      $scope.resetToTutorial();
    } else {
      $scope.testAnswered = 0;
      $scope.correctAnswers = 0;
    }
    $rootScope.getSlideDelegate('play-slide').update();
  };

  $scope.pickTrainingAnswer = function(question, ans){
    if(question.ans === ans){
      // add weights to answered
      if(question.answered){
        question.answered = question.answered + 1;
      } else {
        question.answered = 1;
      }

      if($scope.correctAnswers == $scope.neededAnswerCount()){
        $scope.nextPlayState();
      } else {
        var correctPopup = $ionicPopup.alert({
          template: "<center><h3><font color='blue'><b>CORRECT!</b></font></h3></center>"
        }).then(function(res) {
          $scope.correctAnswers = $scope.correctAnswers + 1;
          $ionicSlideBoxDelegate.slide($scope.pickNextTrainingQuestion(question));
          $scope.randomAnswers = $scope.shuffleArray(['a','b']);
        });
      };
    } else {
      var incorrectPopup = $ionicPopup.alert({
        template: "<center><h3><font color='red'><b>INCORRECT!</b></font></h3></center>"
      }).then(function(res) {
        $scope.correctAnswers = 0;
        $scope.processFailedState();
      });
    }
  };


  $scope.pickTestAnswer = function(question, ans){
    $scope.testAnswered = $scope.testAnswered + 1;
    if(question.ans === ans){
      // add weights to answered
      if(question.answered){
        question.answered = question.answered + 1;
      } else {
        question.answered = 1;
      }
      $scope.correctAnswers = $scope.correctAnswers + 1;
    }

      // if needed answer count is reached, go to the next state
    if($scope.correctAnswers == $scope.neededAnswerCount()){
      $scope.nextPlayState();
      return true;
    } else if ($scope.testAnswered == $scope.maxAnswerCount()){
      var failedPopup = $ionicPopup.alert({
        template: "<center><h3>Test failed! Press OK to go back to training.</h3></center>"
      }).then(function(){
        $scope.testAnswered = 0;
        $scope.correctAnswers = 0;
        $scope.processFailedState();
      });
    } else {
      // next question
      $ionicSlideBoxDelegate.slide($scope.pickNextTestQuestion(question));
      $scope.randomAnswers = $scope.shuffleArray(['a','b']);
    }
  };

  $scope.currentType = function(){
    return "TUTORIAL";
  };

  $scope.resetToTutorial();

});
