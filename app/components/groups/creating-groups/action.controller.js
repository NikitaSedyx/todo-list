;(function () {
  angular
    .module("todo")
    .controller("ActionController", ActionController);

  ActionController.$inject = ["$scope", "CreatingGroupService", "$modal", "GroupStorage"];

  function ActionController($scope, CreatingGroupService, $modal, GroupStorage) {
    var self = this;
    self.newTextGroup = newTextGroup;
    self.newListGroup = newListGroup;
    self.action = "default";
    self.mode = "text";
    self.listMode = listMode;
    self.cancel = cancel;
    self.addContributors = addContributors;
    self.addFiles = addFiles;
    self.addGroup = addGroup;

    function cancel(){
      CreatingGroupService.reset();
      self.action = "default";
      self.mode = "text";
    }

    function newTextGroup() {
      self.action = "new-group";
      self.mode = "text";
    }

    function newListGroup() {
      self.action = "new-group";
      listMode();
    }

    function listMode() {
      self.mode = "list";
      CreatingGroupService.newListGroup();
    }

    function addContributors() {
      var contributorsModal = $modal.open({
        templateUrl: "app/views/components/groups/edit-contributors/edit-contributors.html",
        controller: "EditContributorsController",
        windowClass: "edit-contributors-modal",
        resolve: {
          contributors: function () {
            return CreatingGroupService.newGroup.users;
          }
        }
      });
      contributorsModal.result
        .then(function (contributors) {
          CreatingGroupService.newGroup.users = contributors
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

    function addGroup() {
      CreatingGroupService.addGroup().then(addGroupSucces);
    }

    function addGroupSucces() {
      cancel();
      $scope.params.offset = 0;
      GroupStorage.groups.data = [];
      GroupStorage.loadData($scope.params);
    }

  }
})();
