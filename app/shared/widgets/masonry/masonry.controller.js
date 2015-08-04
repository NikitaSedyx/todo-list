;(function(){
  angular
    .module("nm-widgets")

    .controller("MasonryController", MasonryController)

    MasonryController.$inject = ["$scope"]

    function MasonryController($scope){
      return $scope.$watch(function(e){
        $scope.masonry.reloadItems()
        return $scope.masonry.layout()
      })
    }
})()
