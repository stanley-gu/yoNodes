'use strict';

angular.module('yoNodesApp')
  .controller('AceCtrl', function($scope) {
  $scope.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
  ];
  $scope.editorText = 'Enter in some text here';
  $scope.visible = true;
  $scope.active = '';
  $scope.toggle = function() {
    $scope.visible = !$scope.visible;
    $scope.active = 'active';
  };
});
