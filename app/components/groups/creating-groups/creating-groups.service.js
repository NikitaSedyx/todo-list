;
(function () {
  angular
    .module("todo")
    .service("CreatingGroupService", CreatingGroupService)

  CreatingGroupService.$inject = ["GroupResource", "FileService"]

  function CreatingGroupService(GroupResource, FileService) {
    var self = this;
    self.newGroup = {
      title: "",
      items: [],
      view: false,
      users: [],
      files: []
    };
    self.addGroup = addGroup;
    self.cancel = reset;
    self.filesToUpload = [];
    self.addItem = addItem;
    self.deleteItem = deleteItem;
    self.newListGroup = newListGroup;
    self.reset = reset;

    function addGroup() {
      if(self.filesToUpload.length){
        return GroupResource.createGroup(self.newGroup).$promise
          .then(function(response){
            FileService.upload(self.filesToUpload, response);
        }).then(reset);
      } else {
        return GroupResource.createGroup(self.newGroup).$promise
          .then(reset);
      }
    }

    function reset() {
      self.newGroup.title = "";
      self.newGroup.items = [];
      self.newGroup.view = false;
      self.newGroup.users = [];
      self.filesToUpload = [];
    }

    function deleteItem(index) {
      self.newGroup.items.splice(index, 1);
      console.log(self.newGroup.items);
    }

    function addItem(item) {
      if (item) {
        self.newGroup.items.push(item);
      }
    }

    function newListGroup() {
      self.newGroup.view = true;
    }

  }
})()
