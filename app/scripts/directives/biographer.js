'use strict';

angular.module('yoNodesApp')
  .directive('biographer', function() {
  return {
    template: '<div></div>',
    replace: true,
    //restrict: 'E',
    link: function postLink(scope, element, attrs) {
      //element.text('this is the biographer directive');
      bui.ready(function(){
        scope.graph = new bui.Graph(element[0]);
        console.log(showcaseJSON);
      });
    }
  };
});
