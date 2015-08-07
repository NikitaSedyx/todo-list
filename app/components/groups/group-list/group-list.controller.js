;
(function () {
  angular
    .module("todo")

  .controller("GroupListController", GroupListController)

  GroupListController.$inject = ["GroupStorage", "$scope"]

  function GroupListController(GroupStorage, $scope) {
    $scope.params.limit = 10
    GroupStorage.loadData($scope.params)

    $scope.paginatorConfig = {
      currentPage: 1,
      changePage: function () {
        var currentPage = $scope.paginatorConfig.currentPage - 1
        $scope.params.offset = currentPage * $scope.params.limit
        GroupStorage.loadData($scope.params)
      }
    }
  }
})()
