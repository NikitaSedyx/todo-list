;(function(){
  angular
    .module("cu-grid")

    .controller("CuGridController", function($scope){
      $scope.changePage = function(page){
        $scope.gridConfig.paginationConfig.changePage(page)
      }   
    })

})()
