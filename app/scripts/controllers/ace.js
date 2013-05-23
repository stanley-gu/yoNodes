'use strict';

angular.module('yoNodesApp')
  .controller('AceCtrl', function($scope, $http) {
  $scope.awesomeThings = ['HTML5 Boilerplate', 'AngularJS', 'Karma'];
  $scope.visible = true;
  $scope.active = '';
  $scope.models = [];
  $scope.toggle = function() {
    $scope.visible = !$scope.visible;
    $scope.active = 'active';
  };

  $scope.githubUserName = 'stanley-gu';
  $scope.githubRepository = 'simpleSbmlModel';
  $scope.githubModelName = 'model.sbml';


  $scope.loadFromGithub = function() {
    $http.defaults.headers.common.Accept = $http.defaults.headers.common.Accept + ', application/vnd.github.VERSION.raw';
    $http.get('https://api.github.com/repos/' + $scope.githubUserName + '/' + $scope.githubRepository + '/commits').success(function(data) {

      function compare(a, b) {
        if (a.commit.author.date < b.commit.author.date) {
          return -1;
        }
        if (a.commit.author.date < b.commit.author.date) {
          return 1;
        }
        return 0;
      }
      //$scope.commits = data.sort(compare);

     data.forEach(function(element){
       console.log(element.commit.message)
     })
      $scope.commits = data;
      $scope.models = [];
      $scope.versions = [];
      $scope.commits.forEach(function(element, index, array) {
        $http.get('https://api.github.com/repos/stanley-gu/simpleSbmlModel/contents/' + $scope.githubModelName, {
          'params': {
            'ref': element.sha
          }
        }).success(function(data) {
          console.log(index)
          console.log(element.commit.message)
          $scope.models[array.length-1-index] = {
            name: element.commit.message,
            text: data,
            checked: false
          };
        });
      });
    });
  }
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
      'first': $scope.models[isChecked[0]].text,
      'second': $scope.models[isChecked[1]].text
    }).success(function(data, status, headers, config) {
      $scope.modelDiff = data.diff;
      $scope.graphml = data.graphml;
      console.log('Sent request!');
    }).error(function(data, status, headers, config) {
      console.log('Error!');
    });
  };
  $scope.loadFromGithub();
});
