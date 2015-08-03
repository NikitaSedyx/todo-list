;
(function () {
  angular
    .module("todo")
    .controller("RegisterController", RegisterController);

  RegisterController.$inject = ["$scope", "$http", "$state"];

  function RegisterController($scope, $http, $state) {
    $scope.signIn = signIn;
    $scope.signUp = signUp;
    this.registerSucces = registerSucces;
    this.registerError = registerError;


    function signUp() {
      $http.post("/api/v1/registration/", $scope.user)
        .then(registerSucces, registerError);
    }


    function registerSucces(response) {
      console.log("succes");
    }

    function registerError(response) {
      console.log("error");
      $scope.allertMsg = "Error:";
      $scope.isMsgHide = false;
    }

    function signIn() {
      $state.go("login");
    }
  }
})();
