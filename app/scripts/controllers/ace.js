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

  $scope.bivesUrl = 'http://localhost:3000/bives';
  //$scope.bivesUrl = 'http://bives.sysb.io';


  // typeahead
  $scope.githubRepositories = ['a', 'ab', 'abc'];
  $scope.githubFiles = ['a', 'ab', 'abc'];

  $scope.$watch('githubUserName', function(newVal, oldVal) {
    console.log('Detected a change in User Name!');
    $http.get('https://api.github.com/users/' + $scope.githubUserName + '/repos').success(function(data) {
      var repos = [];
      data.forEach(function(element) {
        repos.push(element.name);
      });
      $scope.githubRepositories = repos;
    });
  });

  $scope.$watch('githubRepository', function(newVal, oldVal) {
    console.log('Detected a change in GitHub Repository Name!');
    $http.get('https://api.github.com/repos/' + $scope.githubUserName + '/' + $scope.githubRepository + '/branches/master').success(function(data) {
      $http.get('https://api.github.com/repos/' + $scope.githubUserName + '/' + $scope.githubRepository + '/git/trees/' + data.commit.sha + '?recursive=1').success(function(data) {
        var files = [];
        data.tree.forEach(function(element) {
          files.push(element.path);
        });
        $scope.githubFiles = files;
      });
    });
  });


  // functions to model histories from github
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

      data.forEach(function(element) {
        console.log(element.commit.message)
      })
      $scope.commits = data;
      $scope.models = [];
      $scope.versions = [];
      $scope.commits.forEach(function(element, index, array) {
        $http.get('https://api.github.com/repos/' + $scope.githubUserName + '/' + $scope.githubRepository + '/contents/' + $scope.githubModelName, {
          'params': {
            'ref': element.sha
          }
        }).success(function(data) {
          console.log(index)
          console.log(element.commit.message)
          $scope.models[array.length - 1 - index] = {
            name: element.commit.message,
            text: data,
            checked: false
          };
        });
      });
    });
  }
  $scope.addVersion = function() {
    //var index = $scope.models.length;
    $scope.models.push({
      name: $scope.commitMessage,
      text: $scope.editorText,
      checked: false
    });
  };
  $scope.loadVersion = function(index) {
    $scope.editorText = $scope.models[index].text;
    $http.post($scope.bivesUrl, {
      'first': $scope.editorText,
      'second': $scope.editorText
    }).success(function(data){
      $scope.previewGraphml = data.graphml;
    })
  };

  $scope.compareVersions = function() {
    var isChecked = [];
    var numChecked = 0;
    $scope.models.forEach(function(element, index) {
      if (element.checked) {
        numChecked += 1;
        isChecked.push(index);
      }
    });
    if (numChecked !== 2) {
      alert('Please check only 2 versions to compare.');
      return;
    }
    $http.post($scope.bivesUrl, {
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
