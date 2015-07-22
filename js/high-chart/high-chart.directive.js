;(function(){
  angular
    .module("high-chart")

    .directive("highChart", function(){
      return {
        restrict: 'A',
        replace: true,
        scope: {
          chartConfig: '='
        },
        templateUrl: "../high-chart.template.html",
        link: link
      }
    })

    function link($scope, element, attrs){
      $scope.container = attrs.highChart
      console.log($scope.container)
      $scope.$watch('chartConfig', function(){
        var chart = new Highcharts.Chart($scope.chartConfig);
      })
    }
})()