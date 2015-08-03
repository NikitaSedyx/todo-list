;(function(){
  angular
    .module("todo")

    .config(function($httpProvider, $injector){
      $httpProvider.interceptors.push(function($q, $injector){
        return {
          responseError: function(rejection){
            if (rejection.status !== 401){
              return rejection
            }
            var state = $injector.get("$state")
            state.go("login")
            return $q.reject(rejection)
          }
        }
      })
    })
})