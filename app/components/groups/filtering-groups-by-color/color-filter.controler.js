;(function () {
  angular
    .module("todo")
    .controller("ColorFilterController", ColorFilterController)

  ColorFilterController.$inject = ["$scope", "GroupStorage"];

  function ColorFilterController($scope, GroupStorage) {
    var self = this;
    self.color = null;
    self.filter = filter;

    function filter() {
      console.log("dasdasd")
      $scope.params.color__exact = self.color;
      $scope.params.offset = 0;
      GroupStorage.groups.data = [];
      GroupStorage.loadData($scope.params);
    }
  }
})()
