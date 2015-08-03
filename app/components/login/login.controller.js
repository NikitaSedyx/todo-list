;(function () {
  angular
    .module("todo")
    .controller("LoginController", LoginController);

  LoginController.$inject = ["$scope", "$http", "$state"];

  function LoginController($scope, $http, $state) {
    $scope.signIn = signIn;
    $scope.signUp = signUp;
    this.loginSucces = loginSucces;
    this.loginError = loginError;


    function signIn() {
      $http.post("/api/v1/auth/login/", $scope.user)
      .then(loginSucces,loginError);
      $state.go("groups");
    }

    function loginSucces(response) {
      console.log("succes");
    }

    function loginError(response) {
      console.log("error");
      $scope.allertMsg = "Error:";
      $scope.isMsgHide = false;
      $state.go("groups");
    }

    function signUp() {
      $state.go("register");
    }
  }
})();
