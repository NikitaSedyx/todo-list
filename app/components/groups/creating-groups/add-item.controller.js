;(function(){
  angular
    .module("todo")
    .controller("AddItemController", AddItemController);

  AddItemController.$inject = ["CreatingGroupService"];

  function AddItemController(CreatingGroupService) {
    var self = this;
    self.newGroup = CreatingGroupService.newGroup;
    self.addItem = addItem;
    self.deleteItem = deleteItem;
    self.newItem = null;
    self.addGroup = addGroup;

    function addItem() {
      CreatingGroupService.addItem(self.newItem);
      self.newItem = null;
    }

    function deleteItem(index) {
      CreatingGroupService.deleteItem(index);
    }

    function addGroup() {
      CreatingGroupService.addGroup();
    }
  }
})()

