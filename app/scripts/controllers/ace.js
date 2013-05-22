'use strict';

angular.module('yoNodesApp')
  .controller('AceCtrl', function($scope, $http) {
  $scope.awesomeThings = ['HTML5 Boilerplate', 'AngularJS', 'Karma'];
  $scope.visible = true;
  $scope.active = '';
  $scope.toggle = function() {
    $scope.visible = !$scope.visible;
    $scope.active = 'active';
  };
  $http.defaults.headers.common.Accept = $http.defaults.headers.common.Accept + ', application/vnd.github.VERSION.raw';
  $http.get('https://api.github.com/repos/stanley-gu/simpleSbmlModel/contents/model.sbml').success(function(data){
    $scope.editorText = data;
  });

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
    var isChecked = [];
    $scope.models.forEach(function(element, index) {
      if (element.checked) {
        isChecked.push(index);
      }
    });
    $http.post('http://localhost:3000/bives', {
      'first': $scope.models[0].text,
      'second': $scope.models[1].text
    }).success(function(data, status, headers, config) {
      $scope.modelDiff = data.diff;
      console.log('Sent request!');
    }).error(function(data, status, headers, config) {
      console.log('Error!');
    });
  };
});
