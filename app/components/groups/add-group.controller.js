;(function () {
  angular
    .module("todo")
    .controller("AddGroupController", AddGroupController);

  AddGroupController.$inject = ["$scope", "GroupResource", "UserService"];

  function AddGroupController($scope, GroupResource, UserService) {
    $scope.actions = {action : "default"};
    $scope.view = {isList : false};
    $scope.addGroup = addGroup;
    $scope.cancel = cancel;
    $scope.addTask = addTask;
    $scope.listMode = listMode;
    $scope.newGroup = {
      title: "",
      items: [],
      view: false,
      files: [],
      users: [UserService.getUser()]
    };

    function addGroup() {
      var result = GroupResource.createGroup($scope.newGroup);
      result.$promise.then(addingSucces, addingError);
    }

    function cancel() {
      $scope.newGroup.title = "";
      $scope.newGroup.tasks = [];
      $scope.newGroup.view = false;
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

    function addingSucces(response) {
      cancel();
    }

    function addingError(response) {
    }
  }
})();
