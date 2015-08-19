;(function () {
  angular
    .module("todo")
    .controller("RegisterController", RegisterController);

  RegisterController.$inject = ["SessionService"];

  function RegisterController(SessionService) {
    var self = this;
    self.signUp = signUp;
    self.isMsgHide = true;
    self.registerError = registerError;
    self.user = null;

    function signUp() {
      SessionService.registration(self.user).then(registerError);
    }

    function registerError(data) {
      if (!data.success){
        self.allertMsg = "User with this login already exist!";
        self.isMsgHide = false;
      }
    }

  }
})();
