;(function () {
  angular
    .module("todo")
    .controller("RegisterController", RegisterController);

  RegisterController.$inject = ["$scope", "$http", "$state", "API"];

  function RegisterController($scope, $http, $state, API) {
    $scope.signUp = signUp;
    this.registerSucces = registerSucces;
    this.registerError = registerError;


    function signUp() {
      $http.post(API.BASE + API.REGISTRATION, $scope.user)
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
})()
