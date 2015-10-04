angular.module('ebi.controllers')
.controller('PlayCtrl', function($scope, $stateParams, $location, $ionicPopup, $ionicSlideBoxDelegate, Questions) {

  $scope.resetPlay = function(){
    $scope.questions = Questions.training(0);
    $scope.trainingRound = 0;
    $scope.testRound = 0;
    $scope.playState = 'Training'; // or 'Test'
    $scope.correctAnswers = 10;
    $scope.testAnswered = 0;
    if($scope.questions){
      for(var i=0;i<$scope.questions.length;i++){
        $scope.questions[i].answered = null;
      }
    }
  };

  // reset all variables
  $scope.resetPlay();

  // text for game header
  $scope.roundDisplay = function(){
    var round = ($scope.playState == 'Training') ? $scope.trainingRound : $scope.testRound;
    return $scope.playState + ' ' + (round + 1);
  };

  // exit game
  $scope.backToHome = function() {
    var confirmPopup = $ionicPopup.confirm({
      title: 'Back to Home',
      template: "<center> Are you sure you want to exit the program? </center>"
    });
    confirmPopup.then(function(res) {
      if(res) {
        $scope.resetPlay();
        $ionicSlideBoxDelegate.slide(0,10);
        $location.path('tab.dash');
      }
    });
  };

  $scope.nextRound = function(){
    $scope.correctAnswers = 0;
    $scope.round = $scope.round + 1;
    $scope.questions = Questions.all($scope.round);
    $ionicSlideBoxDelegate.update();

    var alertPopup = $ionicPopup.alert({
      template: "<center><h3>Great! Tap OK to start the next round.</h3></center>"
    });
    // alertPopup();
    // .then(function(res) {
    // });
  };

  $scope.pickAnswer = function(question,ans){
    if($scope.playState == 'Training'){
      $scope.pickTrainingAnswer(question,ans);
    } else {
      $scope.pickTestAnswer(question,ans);
    }
  };

  $scope.pickNextTrainingQuestion = function(question){
    while(true){
      var newQuestion = $scope.randomNumber();
      if (($scope.questions[newQuestion].answered == 3) || ($scope.questions[newQuestion].id == question.id) ){
        continue;
      } else {
        return newQuestion;
      }
    }
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
    if($scope.playState == 'Training'){
      return 12;
    } else {
      var round = $scope.testRound;
      if (round == 0 || round == 1 || round == 3 || round == 4){
        return 8;
      } else if (round == 2) {
        return 16;
      } else {
        return 24;
      }
    }
  };

  $scope.playHeader = function() {
    if($scope.playState == 'Training'){
      return 'Correct';
    } else {
      return 'Answered';
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
      var round = $scope.testRound;
      if (round == 0 || round == 1 || round == 3 || round == 4){
        return 7;
      } else if (round == 2) {
        return 14;
      } else {
        return 21;
      }
    }
  };

  $scope.nextPlayState = function(){
    if($scope.playState == 'Training'){
      if($scope.trainingRound == 0 || $scope.trainingRound == 1){
        $scope.playState = 'Test';
        $scope.testRound = $scope.trainingRound;
      }
      $scope.questions = Questions.testing([$scope.testRound]);
    } else {
      if($scope.testRound == 0){
        $scope.playState = 'Training';
        $scope.trainingRound = 1;
        $scope.questions = Questions.training([1]);
      } else if ($scope.testRound == 1) {
        $scope.playState = 'Test';
        $scope.testRound = 2;
        $scope.questions = Questions.testing([0,1]);
      } else if ($scope.testRound == 2) {
        $scope.playState = 'Test';
        $scope.testRound = 3;
        $scope.questions = Questions.testing([2]);
      } else if ($scope.testRound == 3){
        $scope.playState = 'Test';
        $scope.testRound = 4;
        $scope.questions = Questions.testing([3]);
      } else {
        $scope.playState = 'Test';
        $scope.testRound = 5;
        $scope.questions = Questions.testing([0,1,2,3]);
      }
    }
    $scope.correctAnswers = 0;
    $scope.testAnswered = 0;
    var alertPopup = $ionicPopup.alert({
      template: "<center><h3>Great! Tap OK to start the next " + $scope.playState + " round.</h3></center>"
    });
    $ionicSlideBoxDelegate.update();
  }

  $scope.processFailedState = function(){
    for(var i=0;i<$scope.questions.length;i++){
      $scope.questions[i].answered = null;
    };
    if($scope.playState == 'Test'){
      if($scope.testRound == 0 || $scope.testRound == 1){
        $scope.trainingRound = $scope.testRound;
      } else {
        $scope.trainingRound = 0;
      }
      $scope.playState = 'Training';
    }

    if($scope.testRound > 1){
      $scope.trainingRound = 0;
    }

    $scope.questions = Questions.training($scope.trainingRound);

    $scope.randomAnswers = $scope.shuffleArray(['a','b','c','d']);
    $ionicSlideBoxDelegate.update();
    $ionicSlideBoxDelegate.slide(0);
  };

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

  $scope.randomAnswers = $scope.shuffleArray(['a','b','c','d']);
  $scope.questions = Questions.training(0);

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
        var alertPopup = $ionicPopup.alert({
          // title: 'Don\'t eat that!',
          template: "<center><h3><font color='blue'>CORRECT!</font></h3></center>"
        });

        alertPopup.then(function(res) {
          $scope.randomAnswers = $scope.shuffleArray(['a','b','c','d']);
          $ionicSlideBoxDelegate.slide($scope.pickNextTrainingQuestion(question));
          $scope.correctAnswers = $scope.correctAnswers + 1;
        });
      };
    } else {
      var alertPopup = $ionicPopup.alert({
        template: "<center><h3><font color='red'>INCORRECT!</font></h3></center>"
      });
      alertPopup.then(function(res) {
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

      var alertPopup = $ionicPopup.alert({
        template: "<center><h3>Test failed! Press OK to go back to training.</h3></center>"
      }).then(function(){
        $scope.testAnswered = 0;
        $scope.correctAnswers = 0;
        $scope.processFailedState();
        return true;
      });
    } else {
      // next question
      $ionicSlideBoxDelegate.slide($scope.pickNextTestQuestion(question));
      $scope.randomAnswers = $scope.shuffleArray(['a','b','c','d']);
    }
  };

});
