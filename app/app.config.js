;(function () {
  angular
    .module("todo")

    .config(function ($httpProvider) {
      $httpProvider.defaults.xsrfCookieName = "csrftoken"
      $httpProvider.defaults.xsrfHeaderName = "X-CSRFToken"
    })

    .config(function ($httpProvider, $injector){
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
})()

;(function () {
  angular
    .module("todo")
    .config(resourceConfig);

  function resourceConfig($resourceProvider) {
    $resourceProvider.defaults.stripTrailingSlashes = false;
  }
})();
