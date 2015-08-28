;(function(){
  angular
    .module("todo")

    .controller("LeftNavbarController", LeftNavbarController)

  LeftNavbarController.$inject = ["$scope", "SessionService"]

  function LeftNavbarController($scope, SessionService){
    $scope.user = SessionService.user
  }
})()
