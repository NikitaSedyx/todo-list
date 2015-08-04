;(function () {
  angular
    .module("todo")
    .controller("AddGroupController", AddGroupController);

  AddGroupController.$inject = ["$scope"];

  function AddGroupController($scope) {
    $scope.groups = [];
    $scope.addGroup = addGroup;
    $scope.cancel = cancel;
    $scope.addTask = addTask;
    $scope.listMode = listMode;
    $scope.newGroup = {
      title: "",
      tasks: [],
      view: false
    };

    function addGroup(newGroup) {
      $scope.groups.push({
        title: newGroup.title,
        tasks: newGroup.tasks,
        view: newGroup.view
      });
      cancel();
    }

    function cancel() {
      $scope.newGroup.title = "";
      $scope.newGroup.tasks = [];
      $scope.newGroup.view = false;
      $scope.actions.action = "default";
    }

    function addTask(task) {
      var newTask = {
        description: task.description,
        is_completed: false
      };
      $scope.newGroup.tasks.push(newTask);
      task.description = undefined;
    }

    function listMode(view) {
      view.isList = true;
      $scope.newGroup.view = true;
    }
  }
})();
