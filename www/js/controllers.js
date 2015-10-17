angular.module('ebi.controllers', [])

.controller('DashCtrl', function($scope, $location, $rootScope, $ionicModal, $ionicSlideBoxDelegate, Categories, Preferences) {
  $scope.infoModalType = 'acq';

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

  $scope.typeToName = function(type){
    if(type == 'acq'){
      return 'ACQUISITION';
    } else {
      return 'MAINTENANCE';
    }
  };

  $scope.openTutorial = function() {
    $scope.activeSlide = 1;
    $scope.tutorialModal.show();
  };
  $scope.closeTutorial = function() {
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
    // if(type=='acq'){
    //   $rootScope.getSlideDelegate('home-slide').slide(0);
    // } else {
    //   $rootScope.getSlideDelegate('home-slide').slide(1);
    // }
    Preferences.playType(type);
  };

  $scope.changeTypeSlide = function(index){
    if(index==0){
      Preferences.playType('acq');
    } else {
      Preferences.playType('mnt');
    }
  };



  $scope.startTypeButton = function(){
    if(Preferences.playType() == 'acq'){
      return 'button-royal';
    } else {
      return 'button-calm';
    }
  };

  $scope.setRadioClass = function(type){
    if(Preferences.playType() == type){
      return 'ion-android-radio-button-on';
    } else {
      return 'ion-android-radio-button-off';
    }
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
