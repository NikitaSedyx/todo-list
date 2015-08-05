;(function(){
  angular
    .module("todo")

    .factory("ScrollConfig", function(){
      function ScrollConfig(resource){
        if (!this instanceof ScrollConfig){
          return new ScrollConfig(name)
        }
        var params = {
          limit: 50
        }
        this.isBusy = false
        this.loadData = function(offset){
          var self = this
          params.offset = offset
          self.isBusy = true
          return resource.get(params).$promise
          .then(function(response){
            var count = params.offset + response.objects.length
            var totalCount = response.meta.total_count
            if (count != totalCount){
              self.isBusy = false
            }
            return response.objects
          })
        }
      }
      return ScrollConfig
    })
})()