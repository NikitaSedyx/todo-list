;(function(){
  angular
    .module("todo")

    .controller("GroupPanelController", GroupPanelController)

    GroupPanelController.$inject = ["GroupResource", "$scope",
      "ScrollConfig", "$window"]

    function GroupPanelController(GroupResource, $scope, ScrollConfig, $window){
      $scope.scrollConfig = new ScrollConfig(GroupResource)
      $scope.loadData = loadData
      loadData()

      function loadData(){
        $scope.scrollConfig.loadData($scope.groups.data.length)
        .then(function(response){
          _.forEach(response, function(group){
            $scope.groups.data.push(group)
          })
        }) 
      }
    }
})()
