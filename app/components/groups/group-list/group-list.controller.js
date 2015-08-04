;(function(){
  angular
    .module("todo")

    .controller("GroupListController", GroupListController)

    GroupListController.$inject = ["$scope", "GroupResource"]

    function GroupListController($scope, GroupResource){

      getGroups(0)

      $scope.paginatorConfig = {
        currentPage: 1,
        itemsPerPage: 10,
        changePage: function(){
          var currentPage = $scope.paginatorConfig.currentPage - 1
          var offset = currentPage * $scope.paginatorConfig.itemsPerPage
          getGroups(offset)
        }
      }

      function getGroups(offset){
        GroupResource.getGroups({offset: offset}).$promise
        .then(function(response){
          $scope.paginatorConfig.totalItems = response.meta.total_count
          $scope.groups = response.objects
        })        
      }

    }
})()
