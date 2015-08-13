;(function () {
  angular
    .module("todo")
    .service("SessionUser", SessionUser);

  SessionUser.$inject = ["$http", "API"];

  function SessionUser($http, API) {
    var self = this;
    self.user = {userView : "list"};
    self.getUser = getUser;

    self.getUser();

    function getUser() {
      $http.get(API.BASE + API.AUTH + API.INFO)
        .then(function (response) {
          self.user.data = response.data.user;
        });
    }
  }
})();
