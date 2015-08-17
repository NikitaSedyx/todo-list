;(function () {
  angular
    .module("todo")
    .service("SessionService", SessionService);

  SessionService.$inject = ["$http", "API", "$state"];

  function SessionService($http, API, $state) {
    var self = this;
    self.user = {};
    self.getUser = getUser;
    self.login = login;
    self.registration = registration;
    self.logout = logout;
    self.setUserView = setUserView;

    self.getUser();

    function setUserView(userView) {
      sessionStorage.setItem("userView", userView);
    }

    function checkUserView() {
      var viewInSessionStorage = sessionStorage.getItem("userView");
      if(!viewInSessionStorage){
        sessionStorage.setItem("userView", "list");
      }
    }

    function getUser() {
      checkUserView();
      $http.get(API.BASE + API.AUTH + API.INFO)
        .then(function (response) {
          self.user.data = response.data;
          $state.go("groups.list");
        })
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
          sessionStorage.clear();
          $state.go("login");
        })
    }
  }

})();
