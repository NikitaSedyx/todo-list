;(function(){
  angular
    .module("todo")

    .controller("GroupListController", GroupListController)

    GroupListController.$inject = ["$scope", "GroupResource"]

    function GroupListController($scope, GroupResource){

      var params = {
        offset: 0,
        limit: 10
      }

      getGroups()

      $scope.paginatorConfig = {
        currentPage: 1,
        itemsPerPage: 10,
        changePage: function(){
          var currentPage = $scope.paginatorConfig.currentPage - 1
          params.offset = currentPage * $scope.paginatorConfig.itemsPerPage
          getGroups()
        }
      }

      function getGroups(){
        GroupResource.getGroups(params).$promise
        .then(function(response){
          $scope.paginatorConfig.totalItems = response.meta.total_count
          $scope.groups.data = response.objects
        })        
      }
    }
})()
