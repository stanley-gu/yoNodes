'use strict';

describe('Controller: AceCtrl', function () {

  // load the controller's module
  beforeEach(module('yoNodesApp'));

  var AceCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    AceCtrl = $controller('AceCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
