angular.module('ebi.controllers')
.controller('PlayCtrl', function($scope, $rootScope, $stateParams, $location, $ionicPopup, $ionicSlideBoxDelegate, Questions, Preferences) {

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

  $scope.not = function() {
    return Preferences.playType() != 'tut';
  }

  $scope.resetPlay = function(){
    $scope.pretest = false;
    $scope.questions = Questions.training(0);
    $scope.trainingRound = 0;
    $scope.testRound = 0;
    $scope.playState = 'Training'; // or 'Test'
    $scope.correctAnswers = 0;
    $scope.testAnswered = 0;
    $scope.randomAnswers = $scope.shuffleArray(['a','b','c','d']);
    $scope.programComplete = false;
    if($scope.questions){
      for(var i=0;i<$scope.questions.length;i++){
        $scope.questions[i].answered = null;
      }
    }
    $rootScope.getSlideDelegate('play-slide').slide(0);
    $rootScope.getSlideDelegate('play-slide').update();
  };

  $scope.resetToPretest = function(){
    Preferences.playType('acq');
    $scope.pretest = true;
    $scope.trainingRound = 0;
    $scope.testRound = 5;
    $scope.playState = 'Test';
    $scope.correctAnswers = 0;
    $scope.testAnswered = 0;
    $scope.randomAnswers = $scope.shuffleArray(['a','b','c','d']);
    $scope.programComplete = false;
    $scope.questions = Questions.testing([0,1,2,3]);
    if($scope.questions){
      for(var i=0;i<$scope.questions.length;i++){
        $scope.questions[i].answered = null;
      }
    }
    $rootScope.getSlideDelegate('play-slide').slide(0);
    $rootScope.getSlideDelegate('play-slide').update();
  };

  // text for game header
  $scope.roundDisplay = function(){
    if($scope.pretest){
      return "PRETEST";
    } else if($scope.testRound == 5 && $scope.playState == 'Test'){
      return 'POST TEST';
    } else {
      var round = ($scope.playState == 'Training') ? $scope.trainingRound : $scope.testRound;
      return $scope.playState.toUpperCase() + ' ' + (round + 1);
    }
  };

  // exit game
  $scope.backToHome = function() {
    var confirmPopup = $ionicPopup.confirm({
      title: 'Back to Home',
      template: "<center> Are you sure you want to exit the program? </center>"
    }).then(function(res) {
      if(res) {
        $scope.resetToPretest();
        $ionicSlideBoxDelegate.slide(0,10);
        $location.path('tab.dash');
      }
    });
  };


  $scope.pickAnswer = function(question,ans){
    if($scope.pretest){
      $scope.pickPretestAnswer(question,ans);
    } else if($scope.playState == 'Training'){
      $scope.pickTrainingAnswer(question,ans);
    } else {
      $scope.pickTestAnswer(question,ans);
    }
  };

  // $scope.pickNextTrainingQuestion = function(question){
  //   var count = 0;
  //   var newQuestion = $scope.randomNumber();
  //   while(count < 24){
  //     if (($scope.questions[newQuestion].answered < 4) && ($scope.questions[newQuestion].id != question.id) ){
  //       return newQuestion;
  //     } else {
  //       newQuestion = $scope.randomNumber();
  //       continue;
  //     }
  //     if(count == 24){
  //       count = 0;
  //     }
  //   }
  // };
  //
  // $scope.pickNextTestQuestion = function(question){
  //   while(true){
  //     var newQuestion = $scope.randomNumber();
  //     if (($scope.questions[newQuestion].answered == 2) || ($scope.questions[newQuestion].id == question.id) ){
  //       continue;
  //     } else {
  //       return newQuestion;
  //     }
  //   }
  // };

  $scope.pickNextQuestion = function(question){
    var maxCount = ($scope.playState == 'Training')? 4 : 3;
    var count = 0;
    var newQuestion = $scope.randomNumber();
    while(count < 24){
      if (($scope.questions[newQuestion].answered < maxCount) && ($scope.questions[newQuestion].id != question.id) ){
        return newQuestion;
      } else {
        newQuestion = $scope.randomNumber();
        continue;
      }
      if(count == 24){
        count = 0;
      }
    }
  };

  $scope.maxAnswerCount = function(){
    if(Preferences.playType() == 'tut'){
      if($scope.playState == 'Training'){
        return 4;
      } else {
        return 16;
      }
    }

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
    if(Preferences.playType() == 'tut'){
      if($scope.playState == 'Training'){
        return 3;
      } else {
        return 14;
      }
    }

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


  $scope.completePopup = function() {
    return $ionicPopup.alert({
      template: "<center><img class='col congrats-gif' ng-src='img/congrats.gif'></img><br> You have completed the program!</h3></center>",
      buttons: [
        {
          type:'button-positive',
          text:'Back to Home',
          onTap: function(){
            $scope.resetToPretest();
            $location.path('tab.dash');
          }
        }
      ]
    });
  };

  $scope.nextPlayState = function(){
    if(Preferences.playType == 'tut'){
      if($scope.playState == 'Training'){
        if($scope.trainingRound == 0){
          $scope.trainingRound = 1;
          // $scope.
        }
      }
    }

    if($scope.playState == 'Training'){
      if($scope.trainingRound == 0 || $scope.trainingRound == 1){
        $scope.playState = 'Test';
        $scope.testRound = $scope.trainingRound;
      }
      $scope.questions = Questions.testing([$scope.testRound]);
    } else {
      if(Preferences.playType() == 'mnt'){
        $scope.playState = 'Test';
        $scope.testRound = 5;
        $scope.questions = Questions.testing([0,1,2,3]);
      } else if($scope.testRound == 0){
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
      } else if ($scope.testRound == 4){
        $scope.playState = 'Test';
        $scope.testRound = 5;
        $scope.questions = Questions.testing([0,1,2,3]);
      } else {
        $scope.programComplete = true;
      }
    }
    if($scope.programComplete){
      // var completePopup = $ionicPopup.alert({
      //   template: "<center><h3>Congratulations! <br> You have completed the program.</h3></center>",
      //   buttons: [
      //     {
      //       type:'button-positive',
      //       text:'Back to Home',
      //       onTap: function(){
      //         $scope.resetToPretest();
      //         $location.path('tab.dash');
      //       }
      //     }
      //   ]
      // });
      $scope.completePopup();
    } else {
      $scope.correctAnswers = 0;
      $scope.testAnswered = 0;
      var nextStatePopup = $ionicPopup.alert({
        template: "<center><h3>Great! Tap OK to start the next " + $scope.playState + " round.</h3></center>"
      });
      $rootScope.getSlideDelegate('play-slide').update();
    }
  }

  $scope.nextMaintenancePlayState = function(){
    if($scope.trainingRound == 0){
      $scope.playState = 'Training';
      $scope.trainingRound = 1;
      $scope.questions = Questions.training(1);
    } else if ($scope.trainingRound == 1){
      $scope.playState = 'Test';
      $scope.testRound = 5;
      $scope.questions = Questions.testing([0,1,2,3]);
    } else {
      $scope.maintenanceComplete = true;
    }

    if($scope.maintenanceComplete){
      // var maintenanceCompletePopup = $ionicPopup.alert({
      //   template: "<center><h3>Congratulations! <br> You have completed the program.</h3></center>",
      //   buttons: [
      //     {
      //       type:'button-positive',
      //       text:'Back to Home',
      //       onTap: function(){
      //         $scope.resetToPretest();
      //         $location.path('tab.dash');
      //       }
      //     }
      //   ]
      // });
      $scope.completePopup();
    } else {
      $scope.correctAnswers = 0;
      $scope.testAnswered = 0;
      var nextStatePopup = $ionicPopup.alert({
        template: "<center><h3>Great! Tap OK to start the next " + $scope.playState + " round.</h3></center>"
      });
      $rootScope.getSlideDelegate('play-slide').update();
    }
  };

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
    $rootScope.getSlideDelegate('play-slide').update();
    $scope.randomAnswers = $scope.shuffleArray(['a','b','c','d']);
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
          $ionicSlideBoxDelegate.slide($scope.pickNextQuestion(question));
          $scope.randomAnswers = $scope.shuffleArray(['a','b','c','d']);
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
        return true;
      });
    } else {
      // next question
      $ionicSlideBoxDelegate.slide($scope.pickNextQuestion(question));
      $scope.randomAnswers = $scope.shuffleArray(['a','b','c','d']);
    }
  };

  $scope.pickPretestAnswer = function(question, ans){
    $scope.testAnswered = $scope.testAnswered + 1;

    // correct answers / data collection
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
    if($scope.testAnswered == 24){
      var pretestCompletePopup = $ionicPopup.alert({
        template: "<center><h3>Pre-Test Complete! Press OK to start program.</h3></center>"
      }).then(function(){
        $scope.resetPlay();
      });
    } else {
      // next question
      $ionicSlideBoxDelegate.slide($scope.pickNextQuestion(question));
      $scope.randomAnswers = $scope.shuffleArray(['a','b','c','d']);
    }
  };

  $scope.checkPlayType = function(type){
    return type == Preferences.playType();
  };

  $scope.$on('$stateChangeSuccess', function() {
    if(Preferences.playType() == 'mnt'){
      $scope.resetPlay();
    } else if (Preferences.playType() == 'acq'){
      $scope.resetToPretest();
    } else {
      $scope.resetToTutorial();
    }
  });

  $scope.currentType = function(){
    return $rootScope.typeToName(Preferences.playType());
  };

});
