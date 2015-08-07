;
(function () {
  angular
    .module("todo")
    //inject session storage
    .service("GroupStorage", GroupStorage)

  GroupStorage.$inject = ["GroupResource", "SessionUser"]

  function GroupStorage(GroupResource, SessionUser) {
    var self = this
    self.groups = {
      data: [],
      totalItems: 0
    }
    self.loadData = loadData

    var loaders = {
      "list": listLoader,
      "panel": panelLoader
    }

    function loadData(params) {
      var view = SessionUser.userView
      loaders[view](params)
    }

    function listLoader(params) {
      GroupResource.getGroups(params).$promise
        .then(function (response) {
          self.groups.data = response.objects
          self.groups.totalItems = response.meta.total_count
        })
    }

    function panelLoader(params) {
      GroupResource.getGroups(params).$promise
        .then(function (response) {
          _.forEach(response.objects, function (group) {
            self.groups.data.push(group)
          })
        })
    }
  }
})()
