;(function(){
  angular
    .module("todo")

    .controller("GroupController", GroupController)

    GroupController.$inject = ["GroupStorage", "$scope"]

    function GroupController(GroupStorage, $scope){
      $scope.groupView = "list"
      $scope.groups = GroupStorage.groups
      $scope.params = {
        offset: 0
      }
      $scope.changeGroupView = changeGroupView
      function changeGroupView(){
        $scope.params.offset = 0
        GroupStorage.groups.data = []
      }
    }
})()
