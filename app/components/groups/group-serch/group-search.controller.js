;(function () {
  angular
    .module("todo")
    .controller("SearchController", SearchController)

  SearchController.$inject = ["$scope", "GroupStorage"];

  function SearchController($scope, GroupStorage) {
    var self = this;
    self.searchParam = null;
    self.search = search;
    self.reset = reset;

    function search() {
      $scope.params.title__icontains = self.searchParam;
      $scope.params.offset = 0;
      GroupStorage.groups.data = [];
      GroupStorage.loadData($scope.params);
    }

    function reset() {
      self.searchParam = "";
      search();
    }

  }
})()
