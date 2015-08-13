;(function () {
  angular
    .module("todo")
    .controller("AddGroupController", AddGroupController);

  AddGroupController.$inject = ["$scope", "GroupResource", "SessionUser", "GroupStorage", "$modal", "FileService"];

  function AddGroupController($scope, GroupResource, SessionUser, GroupStorage, $modal, FileService) {
    $scope.actions = { action: "default" };
    $scope.view = { isList: false };
    $scope.addGroup = addGroup;
    $scope.cancel = cancel;
    $scope.addTask = addTask;
    $scope.listMode = listMode;
    $scope.addFiles = addFiles;
    $scope.addContributors = addContributors;
    $scope.newListGroup = newListGroup;
    $scope.newTextGroup = newTextGroup;
    $scope.filesToUpload = [];
    $scope.newGroup = {
      title: "",
      items: [],
      view: false,
      users: [],
      files: []
    };

    function newTextGroup(){
      $scope.actions.action = "new-group";
      $scope.view.mode = "text";
    }

    function newListGroup() {
      $scope.actions.action = "new-group";
      listMode();
    }

    function addGroup() {
      $scope.newGroup.users.push(SessionUser.user.data);
      var result = GroupResource.createGroup($scope.newGroup);
      result.$promise.then(function (response) {
        if ($scope.filesToUpload.length) {
          FileService.upload($scope.filesToUpload, response)
            .then(addGroupSucces)
        } else {
          addGroupSucces();
        }
      });
    }

    function addGroupSucces(){
      $scope.params.offset = 0;
      GroupStorage.groups.data = [];
      GroupStorage.loadData($scope.params);
      cancel();
    }

    function cancel() {
      $scope.newGroup.title = "";
      $scope.newGroup.items = [];
      $scope.newGroup.view = false;
      $scope.newGroup.users = [];
      $scope.actions.action = "default";
      $scope.filesToUpload = [];
    }

    function addTask(item) {
      var newItem = {
        description: item.description,
        is_completed: false
      };
      $scope.newGroup.items.push(newItem);
      item.description = undefined;
    }

    function listMode() {
      $scope.view.mode = "list";
      $scope.newGroup.view = true;
    }

    function addContributors() {
      var contributorsModal = $modal.open({
        templateUrl: "app/views/components/groups/edit-contributors/edit-contributors.html",
        controller: "EditContributorsController",
        windowClass: "edit-contributors-modal",
        resolve: {
          contributors: function() {
            return $scope.newGroup.users;
          }
        }
      });

      contributorsModal.result
        .then(function (contributors) {
          $scope.newGroup.users = contributors;
        });
    }

    function addFiles() {
      var addFilesModal = $modal.open({
        templateUrl: "app/views/components/groups/file-upload/file-upload-modal.html",
        controller: "AddFilesController",
        windowClass: "file-upload-modal",
        resolve: {
          files: function () {
            return $scope.filesToUpload;
          }
        }
      });

      addFilesModal.result
        .then(function (files) {
          $scope.filesToUpload = files;
        })
    }
  }
})();
