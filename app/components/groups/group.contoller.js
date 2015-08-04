;(function(){
  angular
    .module("todo")

    .controller("GroupController", GroupController)

    GroupController.$inject = ["$scope"]

    function GroupController($scope){
      $scope.groupView = "list"
      $scope.groups = {
        data: []
      }
      $scope.deleteData = deleteData

      function deleteData(){
        $scope.groups.data = []
      }
    }
})()
