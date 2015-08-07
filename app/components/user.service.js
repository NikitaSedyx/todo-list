;
(function () {
  angular
    .module("todo")
    .service("SessionUser", SessionUser);

  SessionUser.$inject = ["$http", "API"]

  function SessionUser($http, API) {
    var self = this;
    self.userView = "list"
    self.user = {};
    self.getUser = getUser;

    function getUser() {
      $http.get(API.BASE + API.AUTH + API.INFO)
        .then(function (response) {
          self.user.data = response.data.user;
        })
    }
  }
})()
