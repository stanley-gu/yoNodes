'use strict';

angular.module('yoNodesApp')
  .directive('cytoscape', function () {
    return {
      template: '<div></div>',
      restrict: 'E',
      link: function postLink(scope, element, attrs) {
        element.text('this is the cytoscape directive');
      }
    };
  });
