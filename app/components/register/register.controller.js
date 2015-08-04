;
(function () {
  angular
    .module("todo")
    .controller("RegisterController", RegisterController);

  RegisterController.$inject = ["$scope", "$http", "$state"];

  function RegisterController($scope, $http, $state) {
    $scope.signUp = signUp;
    this.registerSucces = registerSucces;
    this.registerError = registerError;


    function signUp() {
      $http.post("/api/v1/registration/", $scope.user)
        .then(registerSucces, registerError);
    }


    function registerSucces(response) {
      $state.go("groups");
    }

    function registerError(response) {
      $scope.allertMsg = "Error:";
      $scope.isMsgHide = false;
    }
  }
})();
