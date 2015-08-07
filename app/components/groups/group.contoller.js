;(function(){
  angular
    .module("todo")

    .controller("GroupController", GroupController)

    GroupController.$inject = ["GroupStorage", "$scope", "SessionUserService"]

    function GroupController(GroupStorage, $scope, SessionUserService){
      $scope.groupView = "list"
      $scope.groups = GroupStorage.groups
      $scope.params = {
        offset: 0
      }
      $scope.changeGroupView = changeGroupView
      function changeGroupView(groupView){
        SessionUserService.userView = groupView;
        $scope.params.offset = 0
        GroupStorage.groups.data = []

      }
    }
})()
