;
(function () {
  angular
    .module("todo")
    .controller("RegisterController", RegisterController);

  RegisterController.$inject = ["$scope", "$http", "$state", "API"];

  function RegisterController($scope, $http, $state, API) {
    $scope.signUp = signUp;
    $scope.isMsgHide = true;
    this.registerSucces = registerSucces;
    this.registerError = registerError;


    function signUp() {
      $http.post(API.BASE + API.REGISTRATION, $scope.user)
        .then(defineAnswer);
    }

    function defineAnswer(response) {
      if (response.data.success) {
        console.log(response);
        registerSucces(response);
      } else {
        registerError(response);
      }
    }



    function registerSucces(response) {
      $state.go("groups.list");
    }

    function registerError(response) {
      $scope.allertMsg = "User with this login already exist!";
      $scope.isMsgHide = false;
    }
  }
})()
