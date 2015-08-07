;(function () {
  angular
    .module("todo")
    .controller("AddGroupController", AddGroupController);

  AddGroupController.$inject = ["$scope", "GroupResource", "SessionUser", "GroupStorage"];

  function AddGroupController($scope, GroupResource, SessionUser, GroupStorage) {
    $scope.actions = {
      action: "default"
    };
    $scope.view = {
      isList: false
    };
    $scope.addGroup = addGroup;
    $scope.cancel = cancel;
    $scope.addTask = addTask;
    $scope.listMode = listMode;
    $scope.newGroup = {
      title: "",
      items: [],
      view: false,
      files: [],
      users: []
    };

    function addGroup() {
      $scope.newGroup.users.push(SessionUser.user.data);
      var result = GroupResource.createGroup($scope.newGroup);
      result.$promise.then(function (response) {
        $scope.params.offset = 0;
        GroupStorage.groups.data = [];
        GroupStorage.loadData($scope.params);
        cancel();
      });
    }

    function cancel() {
      $scope.newGroup.title = "";
      $scope.newGroup.items = [];
      $scope.newGroup.view = false;
      $scope.newGroup.users = [];
      $scope.actions.action = "default";
    }

    function addTask(item) {
      var newItem = {
        description: item.description,
        is_completed: false
      };
      $scope.newGroup.items.push(newItem);
      item.description = undefined;
    }

    function listMode(view) {
      view.isList = true;
      $scope.newGroup.view = true;
    }
  }
})();
