;(function () {
  angular
    .module("todo")
    .controller("LoginController", LoginController);

  LoginController.$inject = ["$scope", "$http", "$state", "API"];

  function LoginController($scope, $http, $state, API) {
    $scope.signIn = signIn;
    $scope.isMsgHide=true;

    function signIn() {
      $http.post(API.BASE + API.AUTH + API.LOGIN, $scope.user)
      .then(loginSucces,loginError);
    }

    function loginSucces(response) {
      $state.go("groups");
    }

    function loginError(response) {
      $scope.allertMsg = "Error:";
      $scope.isMsgHide = false;
      $state.go("groups");
    }
  }
})()
