;(function () {
  angular
    .module("todo")
    .controller("LoginController", LoginController);

  LoginController.$inject = ["$scope", "$http", "$state", "API", "SessionUser"];

  function LoginController($scope, $http, $state, API, SessionUser) {
    $scope.signIn = signIn;
    $scope.isMsgHide = true;

    function signIn() {
      $http.post(API.BASE + API.AUTH + API.LOGIN, $scope.user)
        .then(loginSucces, loginError);
    }

    function loginSucces(response) {
      SessionUser.getUser();
      $state.go("groups.list");
    }

    function loginError(response) {
      var responseStatus = response.status;
      $scope.allertMsg = "User with curren login and password does not exist!";
      $scope.isMsgHide = false;
    }
  }
})();
