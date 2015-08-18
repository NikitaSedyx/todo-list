;
(function () {
  angular
    .module("todo")
    .service("CreatingGroupService", CreatingGroupService)

  CreatingGroupService.$inject = ["GroupResource"]

  function CreatingGroupService(GroupResource) {
    var self = this;
    self.newGroup = {
      title: "",
      items: [],
      view: false,
      users: [],
      files: []
    };
    self.addGroup = addGroup;
    self.cancel = cancel;
    self.filesToUpload = [];
    self.addItem = addItem;
    self.deleteItem = deleteItem;
    self.addContributors = addContributors;
    self.newListGroup = newListGroup;

    function addGroup() {
      //self.newGroup.push(SessionService.user.data);
      /*GroupResource.createGroup(self.newGroup)
        .$promise.then(function (response) {
          if (self.filesToUpload.length) {
            return FileService.upload(self.filesToUpload, response)
              .then(cancel)
          } else {
            return addGroupSucces();
          }
        })*/
      console.log(self.newGroup);
    }

    function cancel() {
      self.newGroup.title = "";
      self.newGroup.items = [];
      self.newGroup.view = false;
      self.newGroup.users = [];
      self.filesToUpload = [];
    }

    function deleteItem(index) {
      self.newGroup.items.slice(index, 1);
    }

    function addItem(item) {
      if (item) {
        self.newGroup.items.push(item);
      }
    }

    function newListGroup() {
      self.newGroup.view = true;
    }

    function addContributors() {

    }
  }
})()
