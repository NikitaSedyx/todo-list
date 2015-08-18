;(function () {
  angular
    .module("todo")
    .controller("CreatingGroupController", CreatingGroupController);

  CreatingGroupController.$inject = ["$scope", "CreatingGroupService"];

  function CreatingGroupController($scope, CreatingGroupService) {
    var self = this;
    self.addGroup = addGroup;

    function addGroup() {
      CreatingGroupService.addGroup();
    }
  }
})();
