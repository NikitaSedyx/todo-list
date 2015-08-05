;(function () {
  angular
    .module("todo")
    .service("UserService", UserService);

  function UserService() {
    this.user = undefined;
    this.setUser = setUser;
    this.removeUser = removeUser;

    function setUser(user) {
      this.user = user;
    }

    function removeUser() {
      this.user = undefined;
    }
  }
})()
