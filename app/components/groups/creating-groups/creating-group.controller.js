;(function(){
  angular
    .module("todo")
    .controller("CreatingGroupController", CreatingGroupController);

  CreatingGroupController.$inject = ["CreatingGroupService"];

  function CreatingGroupController(CreatingGroupService) {
    var self = this;
    self.newGroup = CreatingGroupService.newGroup;
    self.addItem = addItem;
    self.deleteItem = deleteItem;
    self.newItem = null;

    function addItem() {
      CreatingGroupService.addItem(self.newItem);
      self.newItem = null;
    }

    function deleteItem(index) {
      CreatingGroupService.deleteItem(index);
    }
  }
})()

