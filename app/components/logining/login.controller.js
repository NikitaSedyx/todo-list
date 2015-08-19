;(function () {
  angular
    .module("todo")
    .controller("LoginController", LoginController);

  LoginController.$inject = ["SessionService"];

  function LoginController(SessionService) {
    var self = this;
    self.signIn = signIn;
    self.isMsgHide = true;
    self.loginError = loginError;
    self.user = null;

    function signIn() {
      SessionService.login(self.user).catch(loginError);
    }

    function loginError() {
      self.allertMsg = "User with curren login and password does not exist!";
      self.isMsgHide = false;
    }
  }
})();
