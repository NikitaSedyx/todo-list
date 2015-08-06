;(function () {
  angular
    .module("todo")
    .controller("LogoutController", LogoutController);

  LogoutController.$inject = ["$scope", "API", "UserService", "$http", "$state"];

  function LogoutController($scope, API, UserService, $http, $state) {
    this.notify = notify;
    $scope.logout = logout;
    UserService.registerObserver(this);
    $http.get(API.BASE + API.AUTH + API.INFO)
      .then(function (response) {
        UserService.setUser(response.data.user);
        $state.go("groups.list");
    })

    function notify(user) {
      $scope.user = user;
    }

    function logout() {
      $http.get(API.BASE + API.AUTH + API.LOGOUT);
      UserService.removeUser();
      $scope.user = undefined;
      $state.go("login");
    }
  }
})();
