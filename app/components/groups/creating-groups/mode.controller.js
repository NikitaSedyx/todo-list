;(function () {
  angular
    .module("todo")
    .controller("ModeController", ModeController);

  ModeController.$inject = ["$scope", "CreatingGroupService"];

  function ModeController($scope, CreatingGroupService) {
    var self = this;
    self.newTextGroup = newTextGroup;
    self.newListGroup = newListGroup;
    self.action = "default";
    self.mode = "text";
    self.listMode = listMode;
    self.cancel = cancel;

    function cancel(){
      CreatingGroupService.cancel();
      self.action = "default";
      self.mode = "text";
    }

    function newTextGroup() {
      self.action = "new-group";
      self.mode = "text";
    }

    function newListGroup() {
      self.action = "new-group";

    }

    function listMode() {
      self.mode = "list";
      CreatingGroupService.newListGroup();
    }
  }
})();
