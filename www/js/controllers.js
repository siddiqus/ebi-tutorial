angular.module('starter.controllers', [])

.controller('DashCtrl', function($scope, $location, $ionicModal) {

  $ionicModal.fromTemplateUrl('templates/tutorial-modal.html', {
    scope: $scope,
    animation: 'slide-in-up'
  }).then(function(modal) {
    $scope.tutorialModal = modal;
  });

  $scope.closeButton = [
    {
      type: 'button-positive',
      content: '<i class="icon ion-navicon"></i>',
      tap: function(e) {
        $scope.tutorialModal.hide();
      }
    }
  ]
  $scope.openTutorial = function() {
    $scope.activeSlide = 1;
    $scope.tutorialModal.show();
  };
  $scope.closeTutorial = function() {
    $scope.tutorialModal.hide();
  };

  $scope.start = function(){
    $location.path('play')
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

.controller('PlayCtrl', function($scope, $stateParams, $location) {
  $scope.backToHome = function() {
    $location.path('tab.dash');
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
