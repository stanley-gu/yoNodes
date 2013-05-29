'use strict';

angular.module('yoNodesApp', ['ui', 'ui.ace', 'ui.bootstrap', 'stanley-gu.angular-rickshaw'])
  .config(function($routeProvider) {
  $routeProvider
    .when('/', {
    templateUrl: 'views/main.html',
    controller: 'AceCtrl'
  })
    .otherwise({
    redirectTo: '/'
  });
});
