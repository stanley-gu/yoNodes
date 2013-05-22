'use strict';

angular.module('yoNodesApp', ['ui', 'ui.ace', 'ui.bootstrap'])
  .config(function($routeProvider) {
  $routeProvider
    .when('/', {
    templateUrl: 'views/main.html',
    controller: 'MainCtrl'
  })
    .otherwise({
    redirectTo: '/'
  });
});
