;(function () {
  angular
    .module("todo")
    .service("SessionService", SessionService);

  SessionService.$inject = ["$http", "API", "$state"];

  function SessionService($http, API, $state) {
    var self = this;
    self.user = {
      userView: "list"
    };
    self.getUser = getUser;
    self.login = login;
    self.registration = registration;
    self.logout = logout;

    self.getUser();

    function getUser() {
      $http.get(API.BASE + API.AUTH + API.INFO)
        .then(function (response) {
          self.user.data = response.data.user;
          $state.go("groups.list");
        });
    }

    function login(user) {
      return $http.post(API.BASE + API.AUTH + API.LOGIN, user)
        .then(function (response) {
          self.getUser();
          $state.go("groups.list");
          return response;
        });
    }

    function registration(user) {
      return $http.post(API.BASE + API.REGISTRATION, user)
      .then(function (response) {
        if (response.data.success) {
          self.getUser();
          $state.go("groups.list");
        }
        return response.data;
      });

    }

    function logout() {
      return $http.get(API.BASE + API.AUTH + API.LOGOUT)
        .then(function () {
          self.user.data = undefined;
          $state.go("login");
        })
    }
  }

})();
