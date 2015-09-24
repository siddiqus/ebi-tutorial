angular.module('starter.controllers', [])

.controller('DashCtrl', function($scope, $location, $ionicModal) {

  $ionicModal.fromTemplateUrl('templates/tutorial-modal.html', {
    scope: $scope,
    animation: 'slide-in-right'
  }).then(function(modal) {
    $scope.tutorialModal = modal;
  });

  $ionicModal.fromTemplateUrl('templates/play-start-modal.html', {
    scope: $scope,
    animation: 'slide-in-right'
  }).then(function(modal) {
    $scope.startInfoModal = modal;
  });

  $scope.openTutorial = function() {
    $scope.activeSlide = 1;
    $scope.tutorialModal.show();
  };
  $scope.closeTutorial = function() {
    $scope.tutorialModal.hide();
  };


  $scope.openStartInfo = function() {
    $scope.startInfoModal.show();
  };
  $scope.closeStartInfo = function() {
    $scope.startInfoModal.hide();
  };

  $scope.start = function(){
    $scope.closeStartInfo();
    $location.path('play');
  }
})

.controller('ChatsCtrl', function($scope, Chats) {
  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //
  //$scope.$on('$ionicView.enter', function(e) {
  //});

  $scope.chats = Chats.all();
  $scope.remove = function(chat) {
    Chats.remove(chat);
  };
})

.controller('ChatDetailCtrl', function($scope, $stateParams, Chats) {
  $scope.chat = Chats.get($stateParams.chatId);
})

.controller('PlayCtrl', function($scope, $stateParams, $location, $ionicPopup, $ionicSlideBoxDelegate, Questions) {

  $scope.round = 0;
  $scope.roundDisplay=function(){
    return $scope.round + 1;
  }
  $scope.questions = Questions.all($scope.round);
  $ionicSlideBoxDelegate.enableSlide(0);

  // $scope.start = function(){
  //   $ionicSlideBoxDelegate.slide($scope.randomNumber());
  // }

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
  }

  $scope.randomAnswers = ['a','b','c','d'];

  $scope.pickAnswer = function(question, ans){
    if(question.ans === ans){
      $scope.correctAnswers = $scope.correctAnswers + 1;

      if($scope.correctAnswers == 12){
        $scope.nextRound();
      } else {
        var alertPopup = $ionicPopup.alert({
          // title: 'Don\'t eat that!',
          template: "<center><h3><font color='blue'>CORRECT!</font></h3></center>"
        });
        alertPopup.then(function(res) {
          $scope.randomAnswers = $scope.shuffleArray(['a','b','c','d']);
          $ionicSlideBoxDelegate.slide($scope.randomNumber());
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

  $scope.randomNumber = function(){
    return Math.floor((Math.random() * $scope.questions.length)+1);
  }

  $scope.shuffleArray = function(array) {
    for (var i = array.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
    return array;
  }

})

.controller('AccountCtrl', function($scope, $stateParams, $location, Categories) {
  $scope.chosenCategory = 0;
  $scope.categories = Categories.all();
  $scope.setRadioClass = function(id){
    if($scope.chosenCategory == id){
      return 'ion-android-radio-button-on';
    } else {
      return 'ion-android-radio-button-off';
    }
  };
  $scope.chooseCategory = function(id) {
    $scope.chosenCategory = id;
  }
});
