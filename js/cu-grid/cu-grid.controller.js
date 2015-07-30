;(function(){
  angular
    .module("cu-grid")

    .controller("CuGridController", function($scope, cuGridConstants){

      $scope.gridConfig.columns = _.map($scope.gridConfig.columns, function(column){
        if (!column.name) {
          column.name = column.field
        }
        column.name = formatName(column.name)
        if (column.enableSorting !== false){
          column.enableSorting = true
        }
        if (!column.filter) {
          column.filter = {
            type: cuGridConstants.ICONTAINS,
            enableFiltering: true
          }
        }
        if (column.filter.enableFiltering !== false){
          column.filter.enableFiltering = true
        }
        if (!column.filter.type && column.filter.enableFiltering) {
          column.filter.type = cuGridConstants.ICONTAINS
        }
        return column
      }) 

      $scope.isFilterable = function(column){
        return $scope.gridConfig.filteringConfig.enableFiltering && column.filter.enableFiltering
      }

      $scope.isSorting = function(column){
        return $scope.gridConfig.sortingConfig.enableSorting && column.enableSorting
      }

      $scope.changePage = function(page){
        $scope.gridConfig.paginationConfig.changePage(page)
      }   

      $scope.changeOrder = function(column){
        if ($scope.isSorting(column)){
          $scope.orderBy = defineOrder($scope.orderBy, column.field)
          $scope.gridConfig.sortingConfig.changeOrder($scope.orderBy)
        }
      }

      $scope.addFilter = function(column, value){
        var filter = {
          key: column.field + column.filter.type,
          value: value
        }
        $scope.gridConfig.filteringConfig.addFilter(filter)
      }

      function formatName(name){
        name = name[0].toUpperCase() + name.slice(1).toLowerCase()
        return name.replace("_", " ")      
      }

      function defineOrder(orderBy, field){
        if (!orderBy) {
          return field
        }
        if (orderBy[0] == "-"){
          if (orderBy.slice(1, orderBy.length) == field){
            return null
          }
          return field
        }
        if (orderBy == field){
          return "-" + field
        }
        return field
      }
    })

})()
