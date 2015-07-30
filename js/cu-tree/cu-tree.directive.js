;(function(){
  angular
    .module("cu-tree")

    .directive("cuTree", function(){
      return {
        restrict: "E",
        scope: {
          treeConfig: "="
        },
        controller: "CuTreeController"
      }
    })
    
})()
