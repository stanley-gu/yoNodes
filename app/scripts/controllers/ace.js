'use strict';

angular.module('yoNodesApp')
  .controller('AceCtrl', function($scope) {
  $scope.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
  ];
  $scope.editorText = 'Enter in some SBML here';
  $scope.visible = true;
  $scope.active = '';
  $scope.toggle = function() {
    $scope.visible = !$scope.visible;
    $scope.active = 'active';
  };

  $scope.models = [];
  $scope.addVersion = function () {
      var index = $scope.models.length;
      $scope.models.push({name: index, text: $scope.editorText})
  }
  $scope.loadVersion = function (index) {
    $scope.editorText = $scope.models[index].text;
  }
});
