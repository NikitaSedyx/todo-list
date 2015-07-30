;(function(){
  angular
    .module("cu-grid")

    .directive("cuGrid", function(){
      return {
        restrict: "E",
        scope: {
          gridConfig: "="
        },
        templateUrl: "../cu-grid.template.html",
        controller: "CuGridController"
      }
    })

})()
