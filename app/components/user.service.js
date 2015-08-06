;(function () {
  angular
    .module("todo")
    .service("UserService", UserService);

  function UserService() {
    var self = this;
    self.user = undefined;
    self.setUser = setUser;
    self.removeUser = removeUser;
    self.notifyObservers = notifyObservers;
    self.registerObserver = registerObserver;
    self.unRegisterObserver = unRegisterObserver;
    self.getUser = getUser;
    self.observers = [];

    function notifyObservers() {
      for (var i = 0; i < self.observers.length; i++) {
        self.observers[i].notify(self.user);
      }
    }

    function unRegisterObserver(observer) {
      var index = _.indexOf(self.observers, observer);
      if (index > 0) {
        self.observers.slice(index, 1);
      }
    }

    function registerObserver(observer) {
      if (observer) {
        self.observers.push(observer);
      }
    }

    function setUser(user) {
      self.user = user;
      notifyObservers();
    }

    function removeUser() {
      this.user = undefined;
      notifyObservers();
    }

    function getUser() {
      return self.user;
    }
  }
})()
