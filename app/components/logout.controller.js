;(function () {
  angular
    .module("todo")
    .controller("LogoutController", LogoutController);

  LogoutController.$inject = ["$scope", "API", "SessionUser", "$http", "$state"];

  function LogoutController($scope, API, SessionUser, $http, $state) {
    $scope.logout = logout;
    $scope.user = SessionUser.user;

    SessionUser.getUser();

    function logout() {
      $http.get(API.BASE + API.AUTH + API.LOGOUT);
      SessionUser.user.data=undefined;
      $state.go("login");
    }
  }
})();
