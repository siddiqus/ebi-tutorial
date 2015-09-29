angular.module('ebi.controllers')
.controller('PlayCtrl', function($scope, $stateParams, $location, $ionicPopup, $ionicSlideBoxDelegate, Questions) {

  $scope.playState = 'train';
  $scope.round = 0;
  $scope.roundDisplay=function(){
    return $scope.round + 1;
  }
  $scope.questions = Questions.all($scope.round);

  $scope.backToHome = function() {
    var confirmPopup = $ionicPopup.confirm({
      title: 'Back to Home',
      template: "<center> Are you sure you want to exit the program? </center>"
    });
    confirmPopup.then(function(res) {
      if(res) {
        $scope.correctAnswers = 0;
        $scope.round = 0;
        $ionicSlideBoxDelegate.slide(0,10);
        $location.path('tab.dash');
      }
    });
  };

  $scope.correctAnswers = 0;

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

  // $scope.randomAnswers = ['a','b','c','d'];

  $scope.pickAnswer = function(question, ans){
    if(question.ans === ans){
      $scope.correctAnswers = $scope.correctAnswers + 1;
      if(question.answered){
        question.answered = question.answered + 1;
      } else {
        question.answered = 1;
      }
      if($scope.correctAnswers == 12){
        $scope.nextRound();
      } else {
        var alertPopup = $ionicPopup.alert({
          // title: 'Don\'t eat that!',
          template: "<center><h3><font color='blue'>CORRECT!</font></h3></center>"
        });
        for(var i=0;i<$scope.questions.length;i++){
          $scope.questions[i].answered = null;
        };
        alertPopup.then(function(res) {
          $scope.randomAnswers = $scope.shuffleArray(['a','b','c','d']);
          $ionicSlideBoxDelegate.slide($scope.pickNextQuestion(question));
        });
      };
    } else {
      var alertPopup = $ionicPopup.alert({
        // title: 'Don\'t eat that!',
        template: "<center><h3><font color='red'>INCORRECT!</font></h3></center>"
      });
      alertPopup.then(function(res) {
        $scope.correctAnswers = 0;
        $scope.randomAnswers = $scope.shuffleArray(['a','b','c','d']);
        $ionicSlideBoxDelegate.slide(0);
      });
    }
  };

  $scope.pickNextQuestion = function(question){
    while(true){
      var newQuestion = $scope.randomNumber();
      if (($scope.questions[newQuestion].answered == 3) || ($scope.questions[newQuestion].id == question.id) ){
        continue;
      } else {
        return newQuestion;
      }
    }
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
});
