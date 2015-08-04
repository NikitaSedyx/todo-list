;(function () {
  angular
    .module("todo")
    .controller("AddGroupController", AddGroupController);

  AddGroupController.$inject = ["$scope", "GroupResource"];

  function AddGroupController($scope, GroupResource) {
    var self=this;
    self.addingSucces=addingSucces;
    self.addingError=addingError;
    $scope.actions={action : "default"};
    $scope.view={isList : false};
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
      var result=GroupResource.createGroup(newGroup);
      result.$promise.then(addingSucces, addingError);
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

    function addingSucces(response) {
      cancel();
    }

    function addingError(response) {

    }
  }
})();
