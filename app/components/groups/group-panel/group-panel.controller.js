;(function(){
  angular
    .module("todo")

    .controller("GroupPanelController", GroupPanelController)

    GroupPanelController.$inject = ["$scope", "GroupResource", "$window"]

    function GroupPanelController($scope, GroupResource, $window){

      $scope.scrollConfig = {
        loadData: function(){
          var offset = $scope.groups.data.length
          $scope.scrollConfig.isBusy = true
          GroupResource.getGroups({offset: offset}).$promise
          .then(function(response){
            addGroups(response.objects)
            $scope.scrollConfig.isBusy = false
            if ($window.scrollMaxY == 0){
              $scope.scrollConfig.loadData()
            }
            var totalCount = response.meta.total_count
            var count = $scope.groups.data.length
            if (totalCount == count){
              $scope.scrollConfig.isBusy = true
            }
          })
        },
        isBusy: false
      }

      function addGroups(groups){
        _.forEach(groups, function(group){
          $scope.groups.data.push(group)
        })
      }

    }
})()
