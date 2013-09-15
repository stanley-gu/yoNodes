/* globals angular:true */
'use strict';

angular.module('yoNodesApp').controller('AceCtrl', function($scope, $http, $window, $location, $routeParams) {
  $scope.awesomeThings = ['HTML5 Boilerplate', 'AngularJS', 'Karma'];
  $scope.visible = true;
  $scope.active = '';
  $scope.models = [];
  $scope.toggle = function() {
    $scope.visible = !$scope.visible;
    $scope.active = 'active';
  };

  if ($routeParams.githubUserName) {
    $scope.githubUserName = $routeParams.githubUserName;
  }
  if ($routeParams.githubRepository) {
    $scope.githubRepository = $routeParams.githubRepository;
  }
  if ($routeParams.githubModelName) {
    $scope.githubModelName = $routeParams.githubModelName;
  }

  // configuring for socket.io
  var simSocket = $window.io.connect('http://sysb.io:8003');
  simSocket.on('connect', function() {
    console.log('connected to simulator');
  });

  //$scope.bivesUrl = 'http://bives.sysb.io';
  $scope.bivesUrl = 'http://node-bives.stanley-gu.c9.io';

  // logging in to github
  
  if ($window.localStorage.getItem('accessToken')) {
    $scope.accessToken = $window.localStorage.getItem('accessToken');
    $scope.classGithubLoginButton = 'btn btn-success';
    $scope.loginMessage = 'Logged in to GitHub';
  } else {
    $scope.classGithubLoginButton = 'btn btn-danger';
    $scope.loginMessage = 'Log in to Github';
  }
  $scope.loginToGithub = function() {
    if (!$scope.accessToken) {
      $window.OAuth.initialize('EFBBdvbz8MYOYgVTBxOG2sg7JGM');
      $window.OAuth.popup('github', function(err, result) {
        //handle error with err
        //use result.access_token in your API request
        $scope.$apply(function() {
          $window.localStorage.setItem('accessToken', result.access_token);
          $scope.accessToken = result.access_token;
          $scope.classGithubLoginButton = 'btn btn-success';
          $scope.loginMessage = 'Logged in to GitHub';
        });
      });
    }
  };

  // typeahead
  $scope.githubRepositories = ['a', 'ab', 'abc'];
  $scope.githubFiles = ['a', 'ab', 'abc'];

  $scope.$watch('githubUserName', function(newVal, oldVal) {
    console.log('Detected a change in User Name!');
    var url = 'https://api.github.com/users/' + $scope.githubUserName + '/repos';
    if ($scope.accessToken) {
      url += '?access_token=' + $scope.accessToken;
    }
    $http.get(url).success(function(data) {
      var repos = [];
      data.forEach(function(element) {
        repos.push(element.name);
      });
      $scope.githubRepositories = repos;
    });
  });

  $scope.$watch('githubRepository', function(newVal, oldVal) {
    console.log('Detected a change in GitHub Repository Name!');
    var urlRepositories = 'https://api.github.com/repos/' + $scope.githubUserName + '/' + $scope.githubRepository + '/branches/master';
    if ($scope.accessToken) {
      urlRepositories += '?access_token=' + $scope.accessToken;
    }
    $http.get(urlRepositories).success(function(data) {
      var urlFiles = 'https://api.github.com/repos/' + $scope.githubUserName + '/' + $scope.githubRepository + '/git/trees/' + data.commit.sha + '?recursive=1';
      if ($scope.accessToken) {
        urlFiles += '&access_token=' + $scope.accessToken;
      }
      $http.get(urlFiles).success(function(data) {
        var files = [];
        data.tree.forEach(function(element, index) {
          files.push(element.path);
        });
        $scope.githubFiles = files;
      });
    });
  });


  // functions to model histories from github
  $scope.loadFromGithub = function() {
    $http.defaults.headers.common.Accept = $http.defaults.headers.common.Accept + ', application/vnd.github.VERSION.raw';
    var urlCommits = 'https://api.github.com/repos/' + $scope.githubUserName + '/' + $scope.githubRepository + '/commits?path=' + $scope.githubModelName;
    if ($scope.accessToken) {
      urlCommits += '&access_token=' + $scope.accessToken;
    }
    $http.get(urlCommits).success(function(data) {

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
        console.log(element.commit.message);
      });
      $scope.commits = data;
      $scope.models = [];
      $scope.versions = [];
      $scope.commits.forEach(function(element, index, array) {
        var urlContents = 'https://api.github.com/repos/' + $scope.githubUserName + '/' + $scope.githubRepository + '/contents/' + $scope.githubModelName;
        if ($scope.accessToken) {
          urlContents += '?access_token=' + $scope.accessToken;
        }
        $http.get(urlContents, {
          'params': {
            'ref': element.sha
          }
        }).success(function(data) {
          console.log(index);
          console.log(element.commit.message);
          $scope.models[array.length - 1 - index] = {
            name: element.commit.message,
            text: data,
            checked: false
          };
        });
      });
    });
  };
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
    }).success(function(data) {
      $scope.previewGraphml = data.graphml;
    });

    simSocket.emit('run', {
      method: 'loadSBML',
      params: [$scope.editorText]
    });
    simSocket.emit('run', {
      method: 'simulate',
      params: []
    });
    simSocket.on('response', function(data) {
      if (data.method.indexOf('simulate') > -1) {
        var n, i, species, titles, numSpecies, palette, output;
        palette = new $window.Rickshaw.Color.Palette({
          scheme: 'classic9'
        });
        data = data.output;
        titles = data[0];
        numSpecies = data[0].length - 1;
        output = [];
        for (n = 0; n < numSpecies; n += 1) {
          species = {};
          species.name = titles[n + 1];
          species.data = [];
          species.color = palette.color();
          for (i = 1; i < data.length; i += 1) {
            species.data.push({
              x: parseInt(data[i][0], 10),
              y: parseInt(data[i][n + 1], 10)
            });
          }
          output.push(species);
        }
        $scope.simData = output;
      }
    });
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
