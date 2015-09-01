;(function(){
  angular
    .module("todo")

    .service("GroupStorage", GroupStorage)

  GroupStorage.$inject = ["GroupResource", "SessionService", "TrashResource", "$state"]

    function GroupStorage(GroupResource, SessionService, TrashResource, $state){
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

      var loadResources = {
        "groups.list": GroupResource,
        "trash.list": TrashResource
      }

      function loadData(params){
        var view = sessionStorage.getItem("userView")
        var loadResource = loadResources[$state.current.name]
        loaders[view](loadResource, params)
      }

      function listLoader(loadResource, params){
        loadResource.get(params).$promise
        .then(function(response){
          self.groups.data = response.objects
          self.groups.totalItems = response.meta.total_count
        })  
      }

      function panelLoader(loadResource, params){
        loadResource.get(params).$promise
        .then(function(response){
          _.forEach(response.objects, function(group){
            self.groups.data.push(group)
          })
        })  
      }
    }
})()
