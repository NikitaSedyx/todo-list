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
        $scope.scrollConfig.params.offset = $scope.groups.data.length
        $scope.scrollConfig.loadData()
        .then(function(response){
          _.forEach(response, function(group){
            $scope.groups.data.push(group)
          })
        }) 
      }
    }
})()
