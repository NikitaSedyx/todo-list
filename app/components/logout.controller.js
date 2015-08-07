;(function () {
  angular
    .module("todo")
    .controller("LogoutController", LogoutController);

  LogoutController.$inject = ["$scope", "API", "SessionUserService", "$http", "$state"];

  function LogoutController($scope, API, SessionUserService, $http, $state) {
    this.notify = notify;
    $scope.logout = logout;
    SessionUserService.registerObserver(this);
    $http.get(API.BASE + API.AUTH + API.INFO)
      .then(function (response) {
        SessionUserService.setUser(response.data.user);
        $state.go("groups.list");
    })

    function notify(user) {
      $scope.user = user;
    }

    function logout() {
      $http.get(API.BASE + API.AUTH + API.LOGOUT);
      SessionUserService.removeUser();
      $scope.user = undefined;
      $state.go("login");
    }
  }
})();
