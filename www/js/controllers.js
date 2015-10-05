angular.module('ebi.controllers', [])

.controller('DashCtrl', function($scope, $location, $rootScope, $ionicModal, Categories) {

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
    $scope.category = Categories.all()[$rootScope.chosenCategory];
    $scope.startInfoModal.show();
  };
  $scope.closeStartInfo = function() {
    $scope.startInfoModal.hide();
  };

  $scope.start = function(){
    $scope.closeStartInfo();
    $location.path('play');
  };

  $scope.pretest = function(){
    $location.path('#/play/1');
  };

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


.controller('AccountCtrl', function($scope, $stateParams, $rootScope, $location, Categories) {
  $scope.categories = Categories.all();
  $scope.setRadioClass = function(id){
    if($rootScope.chosenCategory == id){
      return 'ion-android-radio-button-on';
    } else {
      return 'ion-android-radio-button-off';
    }
  };
  $scope.chooseCategory = function(id) {
    $rootScope.chosenCategory = id;
  }
});
