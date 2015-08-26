;(function(){
  angular
    .module("todo")

    .config(function($httpProvider){
      $httpProvider.defaults.xsrfCookieName = "csrftoken"
      $httpProvider.defaults.xsrfHeaderName = "X-CSRFToken"
    })

    .config(function($httpProvider, $injector){
      $httpProvider.interceptors.push(function($q, $injector){
        return {
          responseError: function(rejection){
            if (rejection.status == 401){
              var state = $injector.get("$state")
              state.go("login")
            }
            return $q.reject(rejection)
          }
        }
      })
    })

    .config(function($httpProvider, $injector){
      $httpProvider.interceptors.push(function($q, $injector){
        return {
          responseError: function(rejection){
            if (rejection.status == 404){
              var state = $injector.get("$state")
              state.go("404")
            }
            return $q.reject(rejection)
          }
        }
      })
    })
    .config(function resourceConfig($resourceProvider) {
      $resourceProvider.defaults.stripTrailingSlashes = false;
    })
})()
