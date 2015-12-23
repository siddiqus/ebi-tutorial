angular.module('ebi.controllers', [])

.controller('DashCtrl', function($scope, $state, $location, $rootScope, $ionicModal, $ionicSlideBoxDelegate, Categories, Preferences) {
  $scope.infoModalType = 'acq';

  $ionicModal.fromTemplateUrl('templates/play-start-modal.html', {
    scope: $scope,
    animation: 'slide-in-right'
  }).then(function(modal) {
    $scope.startInfoModal = modal;
  });

  $scope.openTutorial = function() {
    // $scope.tutorialModal.show();
    $state.go("tutorial_info");

  };
  $scope.closeTutorial = function() {
    $rootScope.getSlideDelegate('tutorial-slide').slide(0);
    $scope.tutorialModal.hide();
  };

  $scope.openStartInfo = function(type) {
    $scope.category = Categories.all()[Preferences.category()];
    $scope.infoModalType = type;
    $scope.startInfoModal.show();
  };
  $scope.closeStartInfo = function() {
    $scope.startInfoModal.hide();
  };

  $scope.start = function(){
    $scope.closeStartInfo();
    $location.path('play');
  };

  $scope.checkPlayType = function(type){
    return type == $scope.infoModalType;
  };

  $scope.changePlayType = function(type){
    Preferences.playType(type);
  };

  $scope.setRadioClass = function(type){
    if(Preferences.playType() == type){
      return 'ion-android-radio-button-on';
    } else {
      return 'ion-android-radio-button-off';
    }
  };

  $scope.pagerClicked = function(index){
    $rootScope.getSlideDelegate('tutorial-slide').slide(index);
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

.controller('TutorialInfoCtrl', function($scope, $rootScope, $ionicSlideBoxDelegate, $state, $stateParams, Preferences) {
  // $rootScope.getSlideDelegate('tutorial-slide').slide(0);

  $scope.startTutorial = function() {
    Preferences.playType('tut');
    $state.go('tutorial');
  };

  $scope.closeTutorial = function() {
    $state.go("tab.dash");
    $rootScope.getSlideDelegate('tutorial-slide').slide(0);
  };
})

.controller('AccountCtrl', function($scope, $stateParams, $rootScope, $location, Categories, Preferences) {
  $scope.categories = Categories.all();
  $scope.setRadioClass = function(id){
    if(Preferences.category() == id){
      return 'ion-android-radio-button-on';
    } else {
      return 'ion-android-radio-button-off';
    }
  };
  $scope.chooseCategory = function(id) {
    Preferences.category(id);
  };
});
