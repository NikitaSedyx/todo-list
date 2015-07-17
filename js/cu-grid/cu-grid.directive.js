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
        link: link,
        controller: "CuGridController"
      }
    })

    function link($scope, element, attrs){
      $scope.gridConfig.columns = _.map($scope.gridConfig.columns, function(column){
        if (!column.name) {
          column.name = column.field
        }
        return column
      }) 
    }
})()
