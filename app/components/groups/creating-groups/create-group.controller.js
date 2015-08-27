;(function () {
  angular
    .module("todo")
    .controller("CreateGroupController", CreateGroupController);

  CreateGroupController.$inject = ["$scope", "CreatingGroupService", "$modal", "GroupStorage"];

  function CreateGroupController($scope, CreatingGroupService, $modal, GroupStorage) {
    var self = this;
    self.viewParams = {view: "default"}
    self.listGroup = listGroup;
    self.reset = reset;
    self.addContributors = addContributors;
    self.addFiles = addFiles;
    self.saveGroup = saveGroup;
    self.addItem = addItem;
    self.deleteItem = deleteItem;
    self.newItem = null;
    self.group = CreatingGroupService.group;
    self.setColor = setColor;

    function addItem() {
      self.group.items.push(self.newItem);
      self.newItem = null;
    }

    function deleteItem(index) {
      self.group.items.splice(index, 1);
    }

    function reset(){
      self.viewParams.view = "default";
      CreatingGroupService.reset();
    }

    function listGroup() {
      self.viewParams.view = "create-group";
      self.group.view = true;
    }

    function addContributors() {
      var contributorsModal = $modal.open({
        templateUrl: "app/views/components/groups/edit-contributors/edit-contributors.html",
        controller: "EditContributorsController",
        windowClass: "edit-contributors-modal",
        resolve: {
          contributors: function () {
            return self.group.users;
          }
        }
      });

      contributorsModal.result
        .then(function (contributors) {
           self.group.users = contributors
        });
    }

    function addFiles() {
      var addFilesModal = $modal.open({
        templateUrl: "app/views/components/groups/file-upload/file-upload-modal.html",
        controller: "AddFilesController",
        windowClass: "file-upload-modal",
        resolve: {
          files: function () {
            return CreatingGroupService.filesToUpload;
          }
        }
      });

      addFilesModal.result
        .then(function (files) {
          CreatingGroupService.filesToUpload = files;
        })
    }

    function saveGroup() {
      CreatingGroupService.saveGroup()
        .then(reset)
        .then(reloadGroups);
    }

    function reloadGroups() {
      $scope.params.offset = 0;
      GroupStorage.groups.data = [];
      GroupStorage.loadData($scope.params);
    }

    function setColor(color) {
      self.group.color = color;
    }
  }
})();
