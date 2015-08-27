;(function () {
  angular
    .module("todo")
    .service("CreatingGroupService", CreatingGroupService)

  CreatingGroupService.$inject = ["GroupResource", "FileService", "SessionService"]

  function CreatingGroupService(GroupResource, FileService, SessionService) {
    var self = this;
    self.group = {
      title: "",
      items: [],
      view: false,
      users: []
    };
    self.saveGroup = saveGroup;
    self.filesToUpload = [];
    self.reset = reset;

    function saveGroup() {
      self.group.users.push(SessionService.user.data)
      return GroupResource.createGroup(self.group).$promise
        .then(function(response){
          if(self.filesToUpload.length){
            FileService.upload(self.filesToUpload, response);
          }
      });
    }

    function reset() {
      self.group.title = "";
      self.group.items = [];
      self.group.view = false;
      self.group.users = [];
      self.group.color = "white";
    }

  }
})()
