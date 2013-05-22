'use strict';

describe('Directive: cytoscape', function () {
  beforeEach(module('yoNodesApp'));

  var element;

  it('should make hidden element visible', inject(function ($rootScope, $compile) {
    element = angular.element('<cytoscape></cytoscape>');
    element = $compile(element)($rootScope);
    expect(element.text()).toBe('this is the cytoscape directive');
  }));
});
