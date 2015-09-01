;(function () {
  angular
    .module("todo")
    .controller("TrashController", TrashController)

  TrashController.$inject = ["TrashResource", "$scope", "GroupStorage"]

  function TrashController(TrashResource ,$scope, GroupStorage) {
    var self = this;
    self.deleteGroup = deleteGroup;
    self.restoreGroup = restoreGroup;
    self.clearTrash = clearTrash;

    function clearTrash() {
      TrashResource.delete().$promise.then(reloadGroups);
    }

    function restoreGroup(group) {
      TrashResource.update({id: group.id}, {is_deleted: false}).$promise
        .then(reloadGroups);
    }

    function deleteGroup(group) {
      TrashResource.delete({id: group.id}).$promise
        .then(reloadGroups);
    }

    function reloadGroups() {
      $scope.params.offset = 0;
      GroupStorage.groups.data = [];
      GroupStorage.loadData($scope.params);
    }
  }
})()
