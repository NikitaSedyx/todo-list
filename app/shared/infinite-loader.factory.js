;(function(){
  angular
    .module("todo")

    .factory("ScrollConfig", function(){
      function ScrollConfig(resource){
        if (!this instanceof ScrollConfig){
          return new ScrollConfig(name)
        }
        this.params = {
          limit: 50
        }
        this.isBusy = false
        this.loadData = function(){
          var self = this
          return resource.get(self.params).$promise
          .then(function(response){
            if (self.params.offset == response.meta.total_count){
              self.isBusy = true
            }
            return response.objects
          })
        }
      }
      return ScrollConfig
    })
})()
