;(function(){
  angular
    .module("todo")

    .controller("GroupController", GroupController)

    GroupController.$inject = ["GroupStorage", "$scope", "SessionUser"]

    function GroupController(GroupStorage, $scope, SessionUser){
      $scope.groupView = "list"
      $scope.groups = GroupStorage.groups
      $scope.params = {
        offset: 0
      }
      $scope.changeGroupView = changeGroupView
      function changeGroupView(){
        SessionUser.user.userView = $scope.groupView;
        $scope.params.offset = 0
        GroupStorage.groups.data = []

      }
    }
})()
