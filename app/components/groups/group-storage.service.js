;(function(){
  angular
    .module("todo")
    //inject session storage
    .service("GroupStorage", function(GroupResource){
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

      function loadData(params){
        //instead of view use SessionUser.user.groupView
        //var view = "list"
        var view = "panel"
        loaders[view](params)
      }

      function listLoader(params){
        GroupResource.getGroups(params).$promise
        .then(function(response){
          self.groups.data = response.objects
          self.groups.totalItems = response.meta.total_count
        })
      }

      function panelLoader(params){
        GroupResource.getGroups(params).$promise
        .then(function(response){
          _.forEach(response.objects, function(group){
            self.groups.data.push(group)
          })
        })
      }
    })
})()
