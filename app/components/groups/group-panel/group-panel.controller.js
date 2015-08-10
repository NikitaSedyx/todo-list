;(function(){
  angular
    .module("todo")

    .controller("GroupPanelController", GroupPanelController)

    GroupPanelController.$inject = ["GroupStorage", "$scope"]

    function GroupPanelController(GroupStorage, $scope){
      $scope.params.limit = 50

      $scope.loadData = loadData
      loadData()

      function loadData(){
        $scope.params.offset = $scope.groups.data.length
        GroupStorage.loadData($scope.params)
      }
    }
})()
