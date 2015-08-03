;(function(){
  angular
    .module("todo")
    .controller("LogoutController", LogoutController);

    LogoutController.$inject = ["$scope"];

    function LogoutController($scope){
      $scope.user = null;
    }
})();
