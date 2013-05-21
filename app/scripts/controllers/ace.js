'use strict';

angular.module('yoNodesApp')
  .controller('AceCtrl', function($scope, $http) {
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
  $scope.addVersion = function() {
    var index = $scope.models.length;
    $scope.models.push({
      name: index,
      text: $scope.editorText,
      checked: false
    });
  };
  $scope.loadVersion = function(index) {
    $scope.editorText = $scope.models[index].text;
  };

  $scope.compareVersions = function() {
    $http.post('http://localhost:3000/bives', {
      'foo': 'bar'
    }).success(function() {
      console.log('Sent request!');
    }).error(function() {
      console.log('Error!');
    });
  }
});
