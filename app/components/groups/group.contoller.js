;(function(){
  angular
    .module("todo")

    .controller("GroupController", GroupController)

    GroupController.$inject = ["GroupStorage", "$scope", "SessionService"]

    function GroupController(GroupStorage, $scope, SessionService){
      $scope.groupView = SessionService.user.userView
      $scope.groups = GroupStorage.groups
      $scope.params = {
        offset: 0
      }
      $scope.changeGroupView = changeGroupView
      function changeGroupView(){
        SessionService.user.userView = $scope.groupView;
        $scope.params.offset = 0
        GroupStorage.groups.data = []
      }
    }
})()
