;(function () {
  angular
    .module("todo")
    .controller("LogoutController", LogoutController);

  LogoutController.$inject = ["SessionService"];

  function LogoutController(SessionService) {
    var self = this;
    self.logout = logout;
    self.user = SessionService.user;

    function logout() {
      SessionService.logout();
    }
  }
})();
