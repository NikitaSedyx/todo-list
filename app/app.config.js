;(function(){
  angular
    .module("todo")

    .config(function($httpProvider){
      $httpProvider.defaults.xsrfCookieName = 'csrftoken'
      $httpProvider.defaults.xsrfHeaderName = 'X-CSRFToken'
    })
})
