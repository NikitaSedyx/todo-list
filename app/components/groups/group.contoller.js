;(function(){
  angular
    .module("todo")

    .controller("GroupController", GroupController)

    GroupController.$inject = ["$scope"]

    function GroupController($scope){
      $scope.groupView = "list"
      $scope.groups = []
      $scope.changeGroupView = changeGroupView

      function changeGroupView(view){
        $scope.groupView = view
      }
    }
})()
