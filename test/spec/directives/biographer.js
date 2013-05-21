'use strict';

describe('Directive: biographer', function () {
  beforeEach(module('yoNodesApp'));

  var element;

  it('should make hidden element visible', inject(function ($rootScope, $compile) {
    element = angular.element('<biographer></biographer>');
    element = $compile(element)($rootScope);
    expect(element.text()).toBe('this is the biographer directive');
  }));
});
